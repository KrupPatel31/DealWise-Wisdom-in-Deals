import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Helper: fetch with timeout to keep total search latency bounded
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Source 1: Real-Time Product Search (existing)
async function searchRealTimeProducts(query: string, rapidApiKey: string): Promise<any[]> {
  try {
    const url = `https://real-time-product-search.p.rapidapi.com/search-v2?q=${encodeURIComponent(query)}&country=in&language=en&limit=20`;
    const response = await fetchWithTimeout(url, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com',
      },
    }, 6000);

    if (!response.ok) {
      console.error('Real-Time Product Search error:', response.status);
      return [];
    }

    const data = await response.json();
    const items = data?.data?.products || data?.data || data?.products || [];
    if (!Array.isArray(items)) return [];

    return items.map((item: any, index: number) => {
      const offerPriceStr = item.offer?.price ?? item.price ?? '';
      const typicalHighStr = item.typical_price_range?.[1] ?? item.typical_price_range?.[0] ?? '';
      const price = parseFloat(String(offerPriceStr).replace(/[^0-9.]/g, '')) || 0;
      const originalPrice = parseFloat(String(typicalHighStr).replace(/[^0-9.]/g, '')) || price;

      return {
        id: item.product_id || `rtp-${index}`,
        name: item.product_title || item.title || 'Unknown Product',
        price,
        originalPrice,
        discount: item.offer?.discount || 0,
        rating: parseFloat(item.product_rating) || parseFloat(item.rating) || 0,
        reviews: parseInt(item.product_num_reviews) || 0,
        store: item.offer?.store_name || item.product_source || 'Online Store',
        category: item.product_category || 'General',
        description: item.product_description || item.description || '',
        image: item.product_photos?.[0] || item.product_photo || item.image || '',
        link: item.offer?.offer_page_url || item.product_page_url || '#',
        source: 'Google Shopping',
      };
    });
  } catch (e) {
    console.error('Real-Time Product Search failed:', e);
    return [];
  }
}

// Source 2: Google Shopping via Shopping Search API
async function searchGoogleShopping(query: string, rapidApiKey: string): Promise<any[]> {
  try {
    const url = `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=in&language=en&limit=15&sort_by=BEST_MATCH`;
    const response = await fetchWithTimeout(url, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com',
      },
    }, 6000);

    if (!response.ok) {
      console.error('Google Shopping Search error:', response.status);
      return [];
    }

    const data = await response.json();
    const items = data?.data || [];
    if (!Array.isArray(items)) return [];

    return items.map((item: any, index: number) => {
      const price = parseFloat(String(item.offer?.price || item.price || '0').replace(/[^0-9.]/g, '')) || 0;
      const originalPrice = parseFloat(String(item.offer?.original_price || '0').replace(/[^0-9.]/g, '')) || price;
      const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

      return {
        id: item.product_id || `gs-${index}`,
        name: item.product_title || 'Unknown Product',
        price,
        originalPrice,
        discount,
        rating: parseFloat(item.product_rating) || 0,
        reviews: parseInt(item.product_num_reviews) || 0,
        store: item.offer?.store_name || 'Google Shopping',
        category: item.product_category || 'General',
        description: item.product_description?.substring(0, 300) || '',
        image: item.product_photos?.[0] || item.product_photo || '',
        link: item.offer?.offer_page_url || item.product_page_url || '#',
        source: 'Google',
      };
    });
  } catch (e) {
    console.error('Google Shopping Search failed:', e);
    return [];
  }
}

// Deduplicate products by store+name similarity
function deduplicateProducts(products: any[]): any[] {
  const seen = new Map<string, any>();
  
  for (const product of products) {
    const key = `${product.store.toLowerCase()}-${product.name.toLowerCase().substring(0, 50)}`;
    const existing = seen.get(key);
    
    if (!existing || (product.price > 0 && product.price < (existing.price || Infinity))) {
      seen.set(key, product);
    }
  }
  
  return Array.from(seen.values());
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid query parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedQuery = query.trim().slice(0, 200);
    if (sanitizedQuery.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    if (!rapidApiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const t0 = Date.now();
    console.log('Multi-source search for:', sanitizedQuery, 'by user:', claimsData.claims.sub);

    // Fire two fast sources in parallel (dropped the slow third source which
    // chained two upstream calls). Both have 6s timeouts so total latency stays bounded.
    const [realTimeResults, googleShoppingResults] = await Promise.all([
      searchRealTimeProducts(sanitizedQuery, rapidApiKey),
      searchGoogleShopping(sanitizedQuery, rapidApiKey),
    ]);
    const offerResults: any[] = [];

    console.log(`Results in ${Date.now() - t0}ms: RealTime=${realTimeResults.length}, GoogleShopping=${googleShoppingResults.length}`);

    // Merge and deduplicate
    const allProducts = [...realTimeResults, ...googleShoppingResults];
    const products = deduplicateProducts(allProducts);

    // Filter out zero-price items and sort by relevance
    const validProducts = products
      .filter(p => p.price > 0)
      .sort((a, b) => {
        // Prioritize products with images and ratings
        const scoreA = (a.image ? 2 : 0) + (a.rating > 0 ? 1 : 0) + (a.discount > 0 ? 1 : 0);
        const scoreB = (b.image ? 2 : 0) + (b.rating > 0 ? 1 : 0) + (b.discount > 0 ? 1 : 0);
        return scoreB - scoreA;
      });

    console.log('Final products after dedup:', validProducts.length);

    return new Response(
      JSON.stringify({ 
        products: validProducts,
        sources: {
          realTime: realTimeResults.length,
          googleShopping: googleShoppingResults.length,
          offers: offerResults.length,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in search-products function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
