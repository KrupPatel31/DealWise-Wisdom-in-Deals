import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function secureRandInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function generateSecurePassword(): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*";
  const all = uppercase + lowercase + digits + special;

  const password: string[] = [
    uppercase[secureRandInt(uppercase.length)],
    lowercase[secureRandInt(lowercase.length)],
    digits[secureRandInt(digits.length)],
    special[secureRandInt(special.length)],
  ];

  for (let i = 0; i < 4; i++) {
    password.push(all[secureRandInt(all.length)]);
  }

  // Fisher-Yates shuffle with CSPRNG
  for (let i = password.length - 1; i > 0; i--) {
    const j = secureRandInt(i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
      console.error("Missing required configuration");
      return new Response(
        JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Rate limiting: max 3 attempts per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const normalizedEmail = email.toLowerCase().trim();

    const { data: recentAttempts, error: rateError } = await supabase
      .from("password_reset_attempts")
      .select("id")
      .eq("email", normalizedEmail)
      .gte("attempted_at", oneHourAgo);

    if (rateError) {
      console.error("Rate limit check failed:", rateError);
      return new Response(
        JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (recentAttempts && recentAttempts.length >= 3) {
      return new Response(
        JSON.stringify({ error: "Too many reset attempts. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Record this attempt
    await supabase.from("password_reset_attempts").insert({ email: normalizedEmail });

    // Look up user_id via the profiles table (indexed lookup, no full user-table scan).
    // The previous approach used auth.admin.listUsers({ filter }) which is NOT supported
    // by the admin API — it silently returned only the first page of users, so accounts
    // beyond page 1 never received reset emails.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (profileError) {
      console.error("Failed to query profile:", profileError);
      return new Response(
        JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!profile?.user_id) {
      // Don't reveal if email exists
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists, a new password has been sent." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = profile.user_id as string;

    const newPassword = generateSecurePassword();

    // Send the email FIRST. If delivery fails we never touch the password,
    // so the user is not locked out of their account.
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DealWise <no-reply@dealwise.in>",
        reply_to: "support@dealwise.in",
        to: [email],
        subject: "Your Password Has Been Reset — DealWise",
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="background-color: #111827; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #22c55e; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: 1px;">DealWise</h1>
              <p style="color: #9ca3af; font-size: 13px; margin: 6px 0 0;">Wisdom in Deals</p>
            </div>
            <div style="background-color: #f9fafb; padding: 32px 28px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
              <h2 style="color: #111827; margin: 0 0 16px; font-size: 20px;">Password Reset Successful</h2>
              <p style="color: #4b5563; line-height: 1.7; margin: 0 0 20px; font-size: 15px;">
                Your password has been reset successfully. Here is your new password:
              </p>
              <div style="background-color: #111827; color: #22c55e; font-family: 'Courier New', monospace; font-size: 22px; padding: 16px 24px; border-radius: 8px; text-align: center; letter-spacing: 3px; margin: 0 0 20px;">
                ${newPassword}
              </div>
              <p style="color: #4b5563; line-height: 1.7; font-size: 15px; margin: 0 0 8px;">
                Please log in with this password and change it from your account settings for security. 😊
              </p>
            </div>
            <div style="background-color: #111827; padding: 20px 28px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 6px;">
                If you did not request this reset, contact us immediately at
                <a href="mailto:support@dealwise.in" style="color: #22c55e; text-decoration: none;">support@dealwise.in</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 6px;">
                Need help? Reach out at <a href="mailto:help@dealwise.in" style="color: #22c55e; text-decoration: none;">help@dealwise.in</a>
              </p>
              <p style="color: #6b7280; font-size: 11px; margin: 8px 0 0;">
                &copy; ${new Date().getFullYear()} DealWise. All rights reserved.
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errBody = await emailResponse.text();
      console.error("Failed to send email:", errBody);
      return new Response(
        JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Email delivered — now safe to update the password.
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (updateError) {
      console.error("Failed to update password after email sent:", updateError);
      return new Response(
        JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "If an account exists, a new password has been sent." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
