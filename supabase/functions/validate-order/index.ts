import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Valid discount codes with their logic
const DISCOUNT_CODES: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
  'DEALWISE10': { type: 'percentage', value: 10 },
  'FIRST50': { type: 'fixed', value: 50 },
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image?: string;
  store?: string;
  discount?: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

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

    // Verify JWT token
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

    const userId = claimsData.claims.sub;
    const body = await req.json();
    const { items, discountCode, coinsToUse, shippingAddress, paymentMethod, notes } = body;

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Cart items are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return new Response(
          JSON.stringify({ error: 'Invalid cart item structure' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (item.price < 0 || item.quantity < 1) {
        return new Response(
          JSON.stringify({ error: 'Invalid price or quantity' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate shipping address
    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Shipping address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requiredFields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field] || typeof shippingAddress[field] !== 'string' || !shippingAddress[field].trim()) {
        return new Response(
          JSON.stringify({ error: `${field} is required` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate phone and pincode format
    if (!/^\d{10}$/.test(shippingAddress.phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      return new Response(
        JSON.stringify({ error: 'Invalid pincode format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate text field lengths and characters (prevent unusual input)
    const textFieldLimits: Record<string, number> = {
      fullName: 100,
      addressLine1: 200,
      addressLine2: 200,
      city: 100,
      state: 100,
      landmark: 200,
    };

    for (const [field, maxLength] of Object.entries(textFieldLimits)) {
      if (shippingAddress[field] && shippingAddress[field].length > maxLength) {
        return new Response(
          JSON.stringify({ error: `${field} must be less than ${maxLength} characters` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate payment method
    const validPaymentMethods = ['cod', 'upi', 'card'];
    if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment method' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate totals server-side
    const subtotal = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50;

    // Validate and apply discount server-side
    let discountAmount = 0;
    let validatedDiscountCode: string | null = null;

    if (discountCode && typeof discountCode === 'string') {
      const code = discountCode.toUpperCase().trim();
      const discountConfig = DISCOUNT_CODES[code];
      
      if (discountConfig) {
        if (discountConfig.type === 'percentage') {
          discountAmount = Math.round(subtotal * (discountConfig.value / 100));
        } else {
          discountAmount = discountConfig.value;
        }
        validatedDiscountCode = code;
      }
      // Silently ignore invalid codes - don't apply discount
    }

    // Validate and apply coins
    let coinDiscount = 0;
    if (coinsToUse && typeof coinsToUse === 'number' && coinsToUse > 0) {
      // Verify user has enough coins
      const { data: userCoins } = await supabase
        .from('deal_coins')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (userCoins && userCoins.balance >= coinsToUse) {
        // Cap at subtotal to prevent negative totals
        coinDiscount = Math.min(coinsToUse, subtotal);
      }
    }

    const total = Math.max(0, subtotal + shipping - discountAmount - coinDiscount);

    // Generate order number
    const orderNumber = `DW${Date.now().toString().slice(-8)}`;

    // Create order with server-validated data
    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        items: items.map((item: CartItem) => ({
          id: item.id,
          name: item.name.slice(0, 200), // Limit name length
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          image: item.image,
          store: item.store,
          discount: item.discount || 0,
        })),
        subtotal,
        shipping,
        total,
        shipping_address: {
          fullName: shippingAddress.fullName.trim().slice(0, 100),
          phone: shippingAddress.phone,
          addressLine1: shippingAddress.addressLine1.trim().slice(0, 200),
          addressLine2: shippingAddress.addressLine2?.trim().slice(0, 200) || '',
          city: shippingAddress.city.trim().slice(0, 100),
          state: shippingAddress.state.trim().slice(0, 100),
          pincode: shippingAddress.pincode,
          landmark: shippingAddress.landmark?.trim().slice(0, 200) || '',
        },
        payment_method: paymentMethod,
        notes: notes ? String(notes).slice(0, 500) : null,
        status: 'placed',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating order:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clear user's cart after successful order
    await supabase.from('cart_items').delete().eq('user_id', userId);

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          orderNumber: order.order_number,
          subtotal,
          shipping,
          discount: discountAmount,
          coinDiscount,
          total,
          discountCode: validatedDiscountCode,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-order function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your order' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
