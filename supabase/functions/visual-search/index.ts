import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await supabaseAuth.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    if (!rapidApiKey) {
      return new Response(
        JSON.stringify({ error: 'Search API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { imageBase64, imageUrl } = await req.json();
    const imageContent = imageBase64 || imageUrl;

    if (!imageContent) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Size & format guards
    if (imageBase64 && typeof imageBase64 === 'string' && imageBase64.length > 5_000_000) {
      return new Response(
        JSON.stringify({ error: 'Image too large (max ~3 MB).' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (imageUrl && (typeof imageUrl !== 'string' || !/^https:\/\//i.test(imageUrl) || imageUrl.length > 2048)) {
      return new Response(
        JSON.stringify({ error: 'Invalid image URL. Must be https and under 2048 characters.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Use Lovable AI (Gemini vision) to identify the product
    console.log('Analyzing image with AI...');

    const userContent: any[] = [
      {
        type: "text",
        text: `Analyze this product image. Return ONLY a JSON object with these fields:
{
  "product_name": "specific product name with brand if visible",
  "category": "product category (e.g. shoes, phone, laptop, clothing)",
  "brand": "brand name or 'Unknown'",
  "color": "primary color",
  "search_query": "optimized search query for finding this product on e-commerce sites (include brand, type, key features)",
  "confidence": 0.0 to 1.0
}
Do not include any other text, just the JSON.`
      }
    ];

    if (imageBase64) {
      // Detect mime type from base64 header or default to jpeg
      let mimeType = 'image/jpeg';
      if (imageBase64.startsWith('data:')) {
        const match = imageBase64.match(/^data:(image\/\w+);base64,/);
        if (match) mimeType = match[1];
        userContent.push({
          type: "image_url",
          image_url: { url: imageBase64 }
        });
      } else {
        userContent.push({
          type: "image_url",
          image_url: { url: `data:${mimeType};base64,${imageBase64}` }
        });
      }
    } else {
      userContent.push({
        type: "image_url",
        image_url: { url: imageUrl }
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: userContent }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errText = await aiResponse.text();
      console.error('AI error:', aiResponse.status, errText);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiText = aiData.choices?.[0]?.message?.content || '';
    console.log('AI response:', aiText);

    // Parse JSON from AI response
    let productInfo;
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      productInfo = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      console.error('Failed to parse AI response as JSON');
      productInfo = null;
    }

    if (!productInfo) {
      return new Response(
        JSON.stringify({ error: 'Could not identify the product in the image. Please try a clearer image.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Search for the product using RapidAPI
    const searchQuery = productInfo.search_query || productInfo.product_name;
    console.log('Searching for:', searchQuery);

    const searchUrl = `https://real-time-product-search.p.rapidapi.com/search-v2?q=${encodeURIComponent(searchQuery)}&country=in&language=en&limit=20`;

    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com',
      },
    });

    let products: any[] = [];

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      const rawItems = searchData?.data?.products || searchData?.data || searchData?.products || [];
      const items = Array.isArray(rawItems) ? rawItems : [];

      products = items.map((item: any, index: number) => {
        const offerPriceStr = item.offer?.price ?? item.price ?? '';
        const typicalHighStr = item.typical_price_range?.[1] ?? item.typical_price_range?.[0] ?? '';
        const price = parseFloat(String(offerPriceStr).replace(/[^0-9.]/g, '')) || 0;
        const originalPrice = parseFloat(String(typicalHighStr).replace(/[^0-9.]/g, '')) || price;

        // Calculate a simple similarity score based on title match
        const titleLower = (item.product_title || item.title || '').toLowerCase();
        const queryLower = searchQuery.toLowerCase();
        const queryWords = queryLower.split(/\s+/);
        const matchedWords = queryWords.filter((w: string) => titleLower.includes(w));
        const similarity = Math.min(0.99, 0.6 + (matchedWords.length / queryWords.length) * 0.35);

        return {
          id: item.product_id || item.id || `product-${index}`,
          name: item.product_title || item.title || item.name || 'Unknown Product',
          price,
          originalPrice,
          discount: item.offer?.discount || item.discount || 0,
          rating: parseFloat(item.product_rating) || parseFloat(item.rating) || 4.0,
          reviews: parseInt(item.product_num_reviews) || parseInt(item.reviews) || 0,
          store: item.offer?.store_name || item.product_source || item.store || 'Online Store',
          category: item.product_category || item.category || productInfo.category || 'General',
          image: item.product_photos?.[0] || item.product_photo || item.image || '',
          link: item.offer?.offer_page_url || item.product_page_url || item.link || '#',
          similarity: Math.round(similarity * 100),
        };
      });

      // Sort by similarity then by price
      products.sort((a: any, b: any) => b.similarity - a.similarity || a.price - b.price);
    } else {
      console.error('Search API error:', searchResponse.status);
    }

    return new Response(
      JSON.stringify({
        productInfo,
        products,
        searchQuery,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Visual search error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
