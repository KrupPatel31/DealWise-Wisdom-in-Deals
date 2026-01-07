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
    const url = `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=in&language=en&limit=30`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('RapidAPI error:', response.status, errorText);
      
      // Return empty products so frontend can fall back to local data
      return new Response(
        JSON.stringify({ products: [], fallback: true, message: 'API not subscribed - using local data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Products fetched successfully:', data.data?.length || 0, 'items');

    // Transform the data to match our product structure
    const products = (data.data || []).map((item: any, index: number) => ({
      id: item.product_id || `product-${index}`,
      name: item.product_title || 'Unknown Product',
      price: parseFloat(item.offer?.price?.replace(/[^0-9.]/g, '')) || 0,
      originalPrice: parseFloat(item.typical_price_range?.[1]?.replace(/[^0-9.]/g, '')) || parseFloat(item.offer?.price?.replace(/[^0-9.]/g, '')) || 0,
      discount: item.offer?.discount || 0,
      rating: parseFloat(item.product_rating) || 4.0,
      reviews: parseInt(item.product_num_reviews) || 0,
      store: item.offer?.store_name || item.product_source || 'Online Store',
      category: item.product_category || 'General',
      description: item.product_description || '',
      image: item.product_photos?.[0] || item.product_photo || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      link: item.offer?.offer_page_url || item.product_page_url || '#'
    }));

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
