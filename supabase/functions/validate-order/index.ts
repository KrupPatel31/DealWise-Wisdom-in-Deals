import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Valid discount codes with their logic
const DISCOUNT_CODES: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
  'DEALWISE10': { type: 'percentage', value: 10 },
  'FIRST50': { type: 'fixed', value: 50 },
};

// Earn rate: 2% of order total as coins (1 coin = 1 rupee)
const COIN_EARN_RATE = 0.02;

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

serve(async (req) => {
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

    // Create user-scoped client for auth verification
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await supabaseUser.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    // Service role client for privileged operations (coin mutations)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const { items, discountCode, coinsToUse, shippingAddress, paymentMethod, notes } = body;

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Cart items are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    const textFieldLimits: Record<string, number> = {
      fullName: 100, addressLine1: 200, addressLine2: 200,
      city: 100, state: 100, landmark: 200,
    };
    for (const [field, maxLength] of Object.entries(textFieldLimits)) {
      if (shippingAddress[field] && shippingAddress[field].length > maxLength) {
        return new Response(
          JSON.stringify({ error: `${field} must be less than ${maxLength} characters` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

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

    // Validate and apply discount
    let discountAmount = 0;
    let validatedDiscountCode: string | null = null;
    if (discountCode && typeof discountCode === 'string') {
      const code = discountCode.toUpperCase().trim();
      const discountConfig = DISCOUNT_CODES[code];
      if (discountConfig) {
        discountAmount = discountConfig.type === 'percentage'
          ? Math.round(subtotal * (discountConfig.value / 100))
          : discountConfig.value;
        validatedDiscountCode = code;
      }
    }

    // Validate and apply coins server-side
    let coinDiscount = 0;
    if (coinsToUse && typeof coinsToUse === 'number' && coinsToUse > 0) {
      const { data: userCoins } = await supabaseAdmin
        .from('deal_coins')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (userCoins && userCoins.balance >= coinsToUse) {
        coinDiscount = Math.min(coinsToUse, subtotal);
      }
    }

    const total = Math.max(0, subtotal + shipping - discountAmount - coinDiscount);
    const orderNumber = `DW${Date.now().toString().slice(-8)}`;

    // Create order using admin client
    const { data: order, error: insertError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        items: items.map((item: CartItem) => ({
          id: item.id,
          name: item.name.slice(0, 200),
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

    // === COIN MUTATIONS (server-side only, using admin client) ===

    // Spend coins if applicable
    if (coinDiscount > 0) {
      const { data: currentCoins } = await supabaseAdmin
        .from('deal_coins')
        .select('balance, total_spent')
        .eq('user_id', userId)
        .single();

      if (currentCoins) {
        await supabaseAdmin
          .from('deal_coins')
          .update({
            balance: currentCoins.balance - coinDiscount,
            total_spent: currentCoins.total_spent + coinDiscount,
          })
          .eq('user_id', userId);

        await supabaseAdmin.from('deal_coins_transactions').insert({
          user_id: userId,
          amount: -coinDiscount,
          type: 'spent',
          description: 'Used at checkout',
          order_id: order.id,
        });
      }
    }

    // Earn coins from order total
    const coinsEarned = Math.floor(total * COIN_EARN_RATE);
    if (coinsEarned > 0) {
      const { data: existingCoins } = await supabaseAdmin
        .from('deal_coins')
        .select('balance, total_earned')
        .eq('user_id', userId)
        .single();

      if (existingCoins) {
        await supabaseAdmin
          .from('deal_coins')
          .update({
            balance: existingCoins.balance + coinsEarned,
            total_earned: existingCoins.total_earned + coinsEarned,
          })
          .eq('user_id', userId);
      } else {
        await supabaseAdmin
          .from('deal_coins')
          .insert({
            user_id: userId,
            balance: coinsEarned,
            total_earned: coinsEarned,
            total_spent: 0,
          });
      }

      await supabaseAdmin.from('deal_coins_transactions').insert({
        user_id: userId,
        amount: coinsEarned,
        type: 'earned',
        description: 'Earned from order',
        order_id: order.id,
      });
    }

    // Clear user's cart
    await supabaseAdmin.from('cart_items').delete().eq('user_id', userId);

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
          coinsEarned,
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
