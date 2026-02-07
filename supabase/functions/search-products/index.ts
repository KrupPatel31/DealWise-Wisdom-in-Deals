import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};


serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify JWT token using getClaims
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
    
    // Validate query input
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid query parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Limit query length to prevent abuse
    const sanitizedQuery = query.trim().slice(0, 200);
    if (sanitizedQuery.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');

    if (!rapidApiKey) {
      console.error('RAPIDAPI_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Searching for products:', sanitizedQuery, 'by user:', claimsData.claims.sub);

    // Using Real-Time Product Search API from RapidAPI
    // NOTE: API uses versioned endpoints (v2)
    const url = `https://real-time-product-search.p.rapidapi.com/search-v2?q=${encodeURIComponent(sanitizedQuery)}&country=in&language=en&limit=30`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('RapidAPI error:', response.status, errorText);

      // Return empty products so frontend can fall back to local data
      return new Response(
        JSON.stringify({
          products: [],
          fallback: true,
          message: `RapidAPI error ${response.status}`,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    const rawItems =
      data?.data?.products || // search-v2 typical shape
      data?.data ||
      data?.products ||
      [];

    const items = Array.isArray(rawItems) ? rawItems : [];
    console.log('Products fetched successfully:', items.length, 'items');

    // Transform the data to match our product structure
    const products = items.map((item: any, index: number) => {
      const offerPriceStr = item.offer?.price ?? item.price ?? '';
      const typicalHighStr = item.typical_price_range?.[1] ?? item.typical_price_range?.[0] ?? '';

      const price = parseFloat(String(offerPriceStr).replace(/[^0-9.]/g, '')) || 0;
      const originalPrice =
        parseFloat(String(typicalHighStr).replace(/[^0-9.]/g, '')) || price;

      return {
        id: item.product_id || item.id || `product-${index}`,
        name: item.product_title || item.title || item.name || 'Unknown Product',
        price,
        originalPrice,
        discount: item.offer?.discount || item.discount || 0,
        rating: parseFloat(item.product_rating) || parseFloat(item.rating) || 4.0,
        reviews: parseInt(item.product_num_reviews) || parseInt(item.reviews) || 0,
        store: item.offer?.store_name || item.product_source || item.store || 'Online Store',
        category: item.product_category || item.category || 'General',
        description: item.product_description || item.description || '',
        image:
          item.product_photos?.[0] ||
          item.product_photo ||
          item.image ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        link: item.offer?.offer_page_url || item.product_page_url || item.link || '#',
      };
    });

    return new Response(
      JSON.stringify({ products }),
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
