import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, newPassword, origin } = await req.json();

    if (!email || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Email and new password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting: max 3 reset requests per email per hour
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentResets } = await supabaseAdmin
      .from("pending_password_resets")
      .select("*", { count: "exact", head: true })
      .eq("email", email.toLowerCase())
      .gte("created_at", oneHourAgo);

    if (recentResets !== null && recentResets >= 3) {
      return new Response(
        JSON.stringify({ error: "Too many reset requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (newPassword.length < 8) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 8 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // supabaseAdmin already created above for rate limiting

    // Check if user exists
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      return new Response(
        JSON.stringify({ error: "Unable to process request" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const user = users.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      // Don't reveal if user exists
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists, a verification email has been sent." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete any existing pending resets for this email
    await supabaseAdmin
      .from("pending_password_resets")
      .delete()
      .eq("email", email.toLowerCase());

    // Store pending password reset
    const { error: insertError } = await supabaseAdmin
      .from("pending_password_resets")
      .insert({
        email: email.toLowerCase(),
        new_password: newPassword,
      });

    if (insertError) {
      return new Response(
        JSON.stringify({ error: "Unable to process request" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send recovery email via Supabase Auth - user must click this to verify
    const redirectTo = origin ? `${origin}/reset-callback` : undefined;
    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(
      email,
      { redirectTo }
    );

    if (resetError) {
      return new Response(
        JSON.stringify({ error: "Unable to send verification email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Verification email sent." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
