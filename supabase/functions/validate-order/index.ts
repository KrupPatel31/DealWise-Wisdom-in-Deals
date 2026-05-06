import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create user-scoped client for auth verification
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } =
      await supabaseUser.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const userId = claimsData.claims.sub;

    // Service role client for privileged operations (coin mutations)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const body = await req.json();
    const { discountCode, coinsToUse, shippingAddress, paymentMethod, notes } =
      body;

    // Read cart items from the database (server-side truth, not client-supplied)
    const { data: dbCartItems, error: cartError } = await supabaseAdmin
      .from("cart_items")
      .select("*")
      .eq("user_id", userId);

    if (cartError) {
      console.error("Error reading cart:", cartError);
      return new Response(
        JSON.stringify({ error: "Failed to read cart items" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!dbCartItems || dbCartItems.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === SERVER-SIDE PRICE VERIFICATION ===
    // Fetch authoritative prices from FakeStore API to prevent price manipulation
    const fakeStoreItems = dbCartItems.filter((row) =>
      row.product_id.startsWith("fakestore-"),
    );
    const otherItems = dbCartItems.filter(
      (row) => !row.product_id.startsWith("fakestore-"),
    );

    const trustedPrices: Record<string, number> = {};

    // Fault-tolerant external price verification.
    // If FakeStore is slow / unavailable, fall back to the DB-stored price
    // (the client cannot tamper with it because cart_items RLS blocks
    // price/original_price/discount updates on UPDATE — see RLS policies).
    if (fakeStoreItems.length > 0) {
      const FAKESTORE_TIMEOUT_MS = 4000;
      const FAKESTORE_RETRIES = 2;
      let fetched = false;
      for (
        let attempt = 1;
        attempt <= FAKESTORE_RETRIES && !fetched;
        attempt++
      ) {
        const controller = new AbortController();
        const timer = setTimeout(
          () => controller.abort(),
          FAKESTORE_TIMEOUT_MS,
        );
        try {
          const apiRes = await fetch("https://fakestoreapi.com/products", {
            signal: controller.signal,
          });
          clearTimeout(timer);
          if (!apiRes.ok) {
            console.warn(
              `FakeStore API returned ${apiRes.status} (attempt ${attempt})`,
            );
            continue;
          }
          const apiProducts: Array<{ id: number; price: number }> =
            await apiRes.json();
          for (const p of apiProducts) {
            trustedPrices[`fakestore-${p.id}`] = Math.round(p.price * 83);
          }
          fetched = true;
        } catch (fetchErr) {
          clearTimeout(timer);
          console.warn(`FakeStore fetch attempt ${attempt} failed:`, fetchErr);
        }
      }
      if (!fetched) {
        console.warn(
          "FakeStore price verification unavailable; falling back to DB-stored prices (RLS-protected).",
        );
      }
    }

    // Build items with server-verified prices
    const items: CartItem[] = dbCartItems.map((row) => {
      const verifiedPrice = trustedPrices[row.product_id];
      // Use verified price for fakestore products; fall back to DB price for others
      const price =
        verifiedPrice !== undefined ? verifiedPrice : Number(row.price);
      return {
        id: row.product_id,
        name: row.name,
        price,
        originalPrice:
          verifiedPrice !== undefined
            ? Math.round(price * 1.15)
            : Number(row.original_price),
        quantity: row.quantity,
        image: row.image || undefined,
        store: row.store || undefined,
        discount: Number(row.discount) || 0,
      };
    });

    // Validate items have sane values
    for (const item of items) {
      if (item.price < 0 || item.quantity < 1) {
        return new Response(
          JSON.stringify({ error: "Invalid price or quantity in cart" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Validate shipping address
    if (!shippingAddress || typeof shippingAddress !== "object") {
      return new Response(
        JSON.stringify({ error: "Shipping address is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const requiredFields = [
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "state",
      "pincode",
    ];
    for (const field of requiredFields) {
      if (
        !shippingAddress[field] ||
        typeof shippingAddress[field] !== "string" ||
        !shippingAddress[field].trim()
      ) {
        return new Response(JSON.stringify({ error: `${field} is required` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (!/^\d{10}$/.test(shippingAddress.phone)) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      return new Response(JSON.stringify({ error: "Invalid pincode format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
          JSON.stringify({
            error: `${field} must be less than ${maxLength} characters`,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Accept all payment methods exposed in the checkout UI.
    const validPaymentMethods = [
      "cod",
      "upi",
      "card",
      "netbanking",
      "emi",
      "wallet",
    ];
    if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
      return new Response(
        JSON.stringify({
          error: `Invalid payment method. Choose one of: ${validPaymentMethods.join(", ")}.`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Calculate totals server-side with price guards
    const MAX_ITEM_PRICE = 500000; // ₹5,00,000 max per item
    const MAX_COINS_PER_ORDER = 500; // Cap earned coins per order

    for (const item of items) {
      if (item.price > MAX_ITEM_PRICE) {
        return new Response(
          JSON.stringify({ error: "Item price exceeds maximum allowed value" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    const subtotal = items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0,
    );
    const shipping = subtotal > 500 ? 0 : 50;

    // Validate and apply discount — fetch coupon from DB
    let discountAmount = 0;
    let validatedDiscountCode: string | null = null;
    if (discountCode && typeof discountCode === "string") {
      const code = discountCode.toUpperCase().trim();
      const { data: couponRow } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .eq("code", code)
        .maybeSingle();

      if (couponRow) {
        // Enforce min purchase server-side
        if (
          Number(couponRow.min_purchase) > 0 &&
          subtotal < Number(couponRow.min_purchase)
        ) {
          return new Response(
            JSON.stringify({
              error: `Minimum purchase of ₹${Number(couponRow.min_purchase).toLocaleString()} required for coupon ${code}`,
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        if (couponRow.coupon_type === "freeShipping") {
          discountAmount = shipping;
        } else if (couponRow.discount_type === "percentage") {
          discountAmount = Math.round(
            subtotal * (Number(couponRow.discount_value) / 100),
          );
          if (couponRow.max_discount !== null) {
            discountAmount = Math.min(
              discountAmount,
              Number(couponRow.max_discount),
            );
          }
        } else if (couponRow.discount_type === "fixed") {
          discountAmount = Number(couponRow.discount_value);
          if (couponRow.max_discount !== null) {
            discountAmount = Math.min(
              discountAmount,
              Number(couponRow.max_discount),
            );
          }
        }

        discountAmount = Math.min(discountAmount, subtotal);
        validatedDiscountCode = code;
      }
      // If coupon not found, silently ignore (no discount)
    }

    // Validate coins availability (read only - actual spend is atomic below)
    let coinDiscount = 0;
    if (coinsToUse && typeof coinsToUse === "number" && coinsToUse > 0) {
      const { data: userCoins } = await supabaseAdmin
        .from("deal_coins")
        .select("balance")
        .eq("user_id", userId)
        .single();

      if (userCoins && userCoins.balance >= coinsToUse) {
        coinDiscount = Math.min(coinsToUse, subtotal);
      }
    }

    const total = Math.max(
      0,
      subtotal + shipping - discountAmount - coinDiscount,
    );
    const orderNumber = `DW${Date.now().toString().slice(-8)}`;

    // Create order using admin client
    const { data: order, error: insertError } = await supabaseAdmin
      .from("orders")
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
          addressLine2:
            shippingAddress.addressLine2?.trim().slice(0, 200) || "",
          city: shippingAddress.city.trim().slice(0, 100),
          state: shippingAddress.state.trim().slice(0, 100),
          pincode: shippingAddress.pincode,
          landmark: shippingAddress.landmark?.trim().slice(0, 200) || "",
        },
        payment_method: paymentMethod,
        notes: notes ? String(notes).slice(0, 500) : null,
        status: "placed",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating order:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === COIN MUTATIONS (atomic, server-side only) ===

    // Spend coins if applicable — atomic to prevent double-spend
    if (coinDiscount > 0) {
      const { data: spendResult, error: spendError } = await supabaseAdmin.rpc(
        "spend_coins",
        {
          p_user_id: userId,
          p_amount: coinDiscount,
        },
      );

      if (spendError || spendResult === -1) {
        // Insufficient balance (race condition caught) — remove coin discount
        console.warn(
          "Atomic spend_coins failed, proceeding without coin discount",
        );
        coinDiscount = 0;
        // Update order total without coin discount
        const correctedTotal = Math.max(
          0,
          subtotal + shipping - discountAmount,
        );
        await supabaseAdmin
          .from("orders")
          .update({ total: correctedTotal })
          .eq("id", order.id);
      } else {
        await supabaseAdmin.from("deal_coins_transactions").insert({
          user_id: userId,
          amount: -coinDiscount,
          type: "spent",
          description: "Used at checkout",
          order_id: order.id,
        });
      }
    }

    // Earn coins from order total — atomic upsert
    const coinsEarned = Math.min(
      Math.floor(total * COIN_EARN_RATE),
      MAX_COINS_PER_ORDER,
    );
    if (coinsEarned > 0) {
      await supabaseAdmin.rpc("award_coins", {
        p_user_id: userId,
        p_amount: coinsEarned,
      });

      await supabaseAdmin.from("deal_coins_transactions").insert({
        user_id: userId,
        amount: coinsEarned,
        type: "earned",
        description: "Earned from order",
        order_id: order.id,
      });
    }

    // Clear user's cart
    await supabaseAdmin.from("cart_items").delete().eq("user_id", userId);

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
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in validate-order function:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your order",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
