import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');

    if (!rapidApiKey) {
      console.error('RAPIDAPI_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Searching for products:', query);

    // Using Real-Time Product Search API from RapidAPI
    // NOTE: API uses versioned endpoints (v2)
    const url = `https://real-time-product-search.p.rapidapi.com/search-v2?q=${encodeURIComponent(query)}&country=in&language=en&limit=30`;

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
          message: `RapidAPI error ${response.status}: ${errorText}`,
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
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
