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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Fast local JWT validation via getClaims (no remote /user round-trip)
    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const user = { id: claimsData.claims.sub as string };

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { action, ...payload } = await req.json();

    switch (action) {
      case 'daily_login': return await handleDailyLogin(adminClient, user.id);
      case 'claim_referral_code': return await handleClaimReferralCode(adminClient, user.id);
      case 'use_referral': return await handleUseReferral(adminClient, user.id, payload.code);
      case 'submit_review': return await handleSubmitReview(adminClient, user.id, payload);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function awardCoins(adminClient: any, userId: string, amount: number, description: string, type: string = 'earned') {
  // Atomic upsert via database function — prevents race conditions
  await adminClient.rpc('award_coins', {
    p_user_id: userId,
    p_amount: amount,
  });

  // Record transaction
  await adminClient.from('deal_coins_transactions').insert({
    user_id: userId,
    amount,
    type,
    description,
  });
}

async function handleDailyLogin(adminClient: any, userId: string) {
  const today = new Date().toISOString().split('T')[0];

  // Check if already claimed today
  const { data: existing } = await adminClient
    .from('daily_login_claims')
    .select('id')
    .eq('user_id', userId)
    .eq('claimed_date', today)
    .maybeSingle();

  if (existing) {
    return new Response(JSON.stringify({ success: false, message: 'Already claimed today', already_claimed: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Insert claim
  const { error } = await adminClient.from('daily_login_claims').insert({
    user_id: userId,
    claimed_date: today,
    coins_awarded: 10,
  });

  if (error) {
    // Unique constraint = already claimed
    if (error.code === '23505') {
      return new Response(JSON.stringify({ success: false, message: 'Already claimed today', already_claimed: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    throw error;
  }

  await awardCoins(adminClient, userId, 10, 'Daily Login Reward');

  return new Response(JSON.stringify({ success: true, coins_awarded: 10, message: 'Daily login reward claimed!' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleClaimReferralCode(adminClient: any, userId: string) {
  // Check if user already has a code
  const { data: existing } = await adminClient
    .from('referral_codes')
    .select('code')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    return new Response(JSON.stringify({ success: true, code: existing.code }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Generate unique code
  const code = 'DW' + userId.substring(0, 4).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

  const { error } = await adminClient.from('referral_codes').insert({
    user_id: userId,
    code,
  });

  if (error) throw error;

  return new Response(JSON.stringify({ success: true, code }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleUseReferral(adminClient: any, userId: string, code: string) {
  if (!code || typeof code !== 'string') {
    return new Response(JSON.stringify({ error: 'Referral code required' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Check if user already used a referral
  const { data: existingRef } = await adminClient
    .from('referrals')
    .select('id')
    .eq('referred_id', userId)
    .maybeSingle();

  if (existingRef) {
    return new Response(JSON.stringify({ success: false, message: 'You have already used a referral code' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Find referrer
  const { data: refCode } = await adminClient
    .from('referral_codes')
    .select('user_id, code')
    .eq('code', code.toUpperCase())
    .maybeSingle();

  if (!refCode) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid referral code' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (refCode.user_id === userId) {
    return new Response(JSON.stringify({ success: false, message: 'Cannot use your own referral code' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Create referral record
  const { error } = await adminClient.from('referrals').insert({
    referrer_id: refCode.user_id,
    referred_id: userId,
    referral_code: code.toUpperCase(),
    coins_awarded: 50,
  });

  if (error) {
    if (error.code === '23505') {
      return new Response(JSON.stringify({ success: false, message: 'You have already used a referral code' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    throw error;
  }

  // Award coins to both referrer and referred user
  await awardCoins(adminClient, refCode.user_id, 50, `Referral bonus: new user joined`);
  await awardCoins(adminClient, userId, 25, 'Welcome bonus: used referral code');

  return new Response(JSON.stringify({ success: true, coins_awarded: 25, message: 'Referral applied! You earned 25 coins!' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleSubmitReview(adminClient: any, userId: string, payload: any) {
  const { product_id, product_name, rating, review_text } = payload;

  if (!product_id || !product_name || !rating || rating < 1 || rating > 5) {
    return new Response(JSON.stringify({ error: 'Valid product_id, product_name, and rating (1-5) required' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const safeProductId = String(product_id).slice(0, 100);
  const safeProductName = String(product_name).slice(0, 200);

  // Check if already reviewed
  const { data: existing } = await adminClient
    .from('product_reviews')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', safeProductId)
    .maybeSingle();

  if (existing) {
    return new Response(JSON.stringify({ success: false, message: 'You have already reviewed this product' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Verify user has ordered this product
  const { data: orders } = await adminClient
    .from('orders')
    .select('items')
    .eq('user_id', userId);

  const hasOrdered = orders?.some((order: any) => {
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    return Array.isArray(items) && items.some((item: any) => item.product_id === safeProductId || item.id === safeProductId);
  });

  if (!hasOrdered) {
    return new Response(JSON.stringify({ success: false, message: 'You can only review products you have purchased' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { error } = await adminClient.from('product_reviews').insert({
    user_id: userId,
    product_id: safeProductId,
    product_name: safeProductName,
    rating: Math.min(5, Math.max(1, Math.floor(rating))),
    review_text: review_text?.substring(0, 1000) || null,
    coins_awarded: 20,
  });

  if (error) {
    if (error.code === '23505') {
      return new Response(JSON.stringify({ success: false, message: 'Already reviewed this product' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    throw error;
  }

  await awardCoins(adminClient, userId, 20, `Review reward: ${safeProductName}`);

  return new Response(JSON.stringify({ success: true, coins_awarded: 20, message: 'Review submitted! You earned 20 coins!' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
