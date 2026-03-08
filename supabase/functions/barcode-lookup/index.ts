import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function lookupWithRapidAPI(barcode: string, rapidApiKey: string): Promise<any | null> {
  try {
    const response = await fetch(
      `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(barcode)}&country=in&language=en`,
      {
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      console.error(`RapidAPI returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (data?.data?.length > 0) {
      const products = data.data.slice(0, 10).map((p: any, i: number) => {
        const price = p.offer?.price ? parseFloat(p.offer.price.replace(/[^0-9.]/g, '')) : 0;
        const originalPrice = p.offer?.original_price ? parseFloat(p.offer.original_price.replace(/[^0-9.]/g, '')) : price;
        const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

        return {
          id: `barcode-rapid-${barcode}-${i}`,
          name: p.product_title || `Product ${barcode}`,
          price,
          originalPrice,
          discount,
          rating: p.product_rating || null,
          store: p.offer?.store_name || 'Unknown',
          category: p.product_category || 'General',
          description: p.product_description?.substring(0, 200) || '',
          image: p.product_photos?.[0] || null,
          link: p.product_page_url || null,
          source: 'rapidapi',
        };
      });
      return { products, barcode, productName: products[0]?.name };
    }
    return null;
  } catch (error) {
    console.error('RapidAPI lookup error:', error);
    return null;
  }
}

async function lookupWithOpenFoodFacts(barcode: string): Promise<any | null> {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.status === 1 && data.product) {
      const p = data.product;
      return {
        products: [{
          id: `barcode-off-${barcode}`,
          name: p.product_name || p.generic_name || `Product ${barcode}`,
          price: 0,
          originalPrice: 0,
          discount: 0,
          rating: null,
          store: p.stores || 'Unknown',
          category: p.categories?.split(',')[0]?.trim() || 'Food & Grocery',
          description: p.ingredients_text?.substring(0, 200) || '',
          image: p.image_url || p.image_front_url || null,
          link: `https://world.openfoodfacts.org/product/${barcode}`,
          source: 'openfoodfacts',
          brand: p.brands || null,
          quantity: p.quantity || null,
        }],
        barcode,
        productName: p.product_name || p.generic_name || `Product ${barcode}`,
      };
    }
    return null;
  } catch (error) {
    console.error('Open Food Facts lookup error:', error);
    return null;
  }
}

async function lookupWithUPCItemDB(barcode: string): Promise<any | null> {
  try {
    const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        products: [{
          id: `barcode-upc-${barcode}`,
          name: item.title || `Product ${barcode}`,
          price: item.lowest_recorded_price || 0,
          originalPrice: item.highest_recorded_price || 0,
          discount: 0,
          rating: null,
          store: item.brand || 'Unknown',
          category: item.category || 'General',
          description: item.description?.substring(0, 200) || '',
          image: item.images?.[0] || null,
          link: null,
          source: 'upcitemdb',
          brand: item.brand || null,
        }],
        barcode,
        productName: item.title || `Product ${barcode}`,
      };
    }
    return null;
  } catch (error) {
    console.error('UPCItemDB lookup error:', error);
    return null;
  }
}

// Source 4: Open Beauty Facts (free, cosmetics/personal care)
async function lookupWithOpenBeautyFacts(barcode: string): Promise<any | null> {
  try {
    const response = await fetch(`https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.status === 1 && data.product) {
      const p = data.product;
      return {
        products: [{
          id: `barcode-obf-${barcode}`,
          name: p.product_name || p.generic_name || `Product ${barcode}`,
          price: 0,
          originalPrice: 0,
          discount: 0,
          rating: null,
          store: p.stores || p.brands || 'Unknown',
          category: p.categories?.split(',')[0]?.trim() || 'Beauty & Personal Care',
          description: (p.ingredients_text || '').substring(0, 200),
          image: p.image_url || p.image_front_url || null,
          link: `https://world.openbeautyfacts.org/product/${barcode}`,
          source: 'openbeautyfacts',
          brand: p.brands || null,
        }],
        barcode,
        productName: p.product_name || p.generic_name || `Product ${barcode}`,
      };
    }
    return null;
  } catch (error) {
    console.error('Open Beauty Facts lookup error:', error);
    return null;
  }
}

// Source 5: Open Pet Food Facts (free, pet products)
async function lookupWithOpenPetFoodFacts(barcode: string): Promise<any | null> {
  try {
    const response = await fetch(`https://world.openpetfoodfacts.org/api/v0/product/${barcode}.json`);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.status === 1 && data.product) {
      const p = data.product;
      return {
        products: [{
          id: `barcode-opf-${barcode}`,
          name: p.product_name || p.generic_name || `Product ${barcode}`,
          price: 0,
          originalPrice: 0,
          discount: 0,
          rating: null,
          store: p.stores || p.brands || 'Unknown',
          category: p.categories?.split(',')[0]?.trim() || 'Pet Supplies',
          description: (p.ingredients_text || '').substring(0, 200),
          image: p.image_url || p.image_front_url || null,
          link: `https://world.openpetfoodfacts.org/product/${barcode}`,
          source: 'openpetfoodfacts',
          brand: p.brands || null,
        }],
        barcode,
        productName: p.product_name || p.generic_name || `Product ${barcode}`,
      };
    }
    return null;
  } catch (error) {
    console.error('Open Pet Food Facts lookup error:', error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { barcode } = await req.json();
    if (!barcode || typeof barcode !== 'string') {
      return new Response(JSON.stringify({ error: 'Barcode is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const cleanBarcode = barcode.replace(/[^0-9a-zA-Z]/g, '');
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');

    // Fire ALL sources in parallel for maximum speed
    const [rapidResult, offResult, upcResult, beautyResult, petResult] = await Promise.all([
      rapidApiKey ? lookupWithRapidAPI(cleanBarcode, rapidApiKey) : Promise.resolve(null),
      lookupWithOpenFoodFacts(cleanBarcode),
      lookupWithUPCItemDB(cleanBarcode),
      lookupWithOpenBeautyFacts(cleanBarcode),
      lookupWithOpenPetFoodFacts(cleanBarcode),
    ]);

    // Pick the best result (first non-null with products)
    const result = rapidResult || offResult || upcResult || beautyResult || petResult;

    // If RapidAPI found results but free DBs also found product info, merge product name
    if (result && !rapidResult && result.products?.[0]?.price === 0) {
      // For free DB results with no price, try to search RapidAPI by product name
      if (rapidApiKey && result.productName) {
        const searchResult = await lookupWithRapidAPI(result.productName, rapidApiKey);
        if (searchResult) {
          // Merge: use RapidAPI products but keep free DB metadata
          return new Response(JSON.stringify({
            ...searchResult,
            barcode: cleanBarcode,
            productName: result.productName,
          }), { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }
      }
    }

    if (!result) {
      return new Response(JSON.stringify({ 
        error: 'Product not found', 
        barcode: cleanBarcode,
        message: 'No product found for this barcode. Try searching manually.' 
      }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify(result), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Barcode lookup error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
