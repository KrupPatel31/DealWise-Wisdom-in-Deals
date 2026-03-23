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

    // Find user by email
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("Failed to query users:", listError);
      return new Response(
        JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const user = usersData.users.find(
      (u: any) => u.email?.toLowerCase() === normalizedEmail
    );

    if (!user) {
      // Don't reveal if email exists
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists, a new password has been sent." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newPassword = generateSecurePassword();

    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) {
      console.error("Failed to update password:", updateError);
      return new Response(
        JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DealWise - Wisdom in Deals <onboarding@resend.dev>",
        to: [email],
        subject: "Your Password Has Been Reset - DealWise - Wisdom in Deals",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; font-size: 24px;">DealWise - Wisdom in Deals</h1>
            </div>
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
              <h2 style="color: #111827; margin-top: 0;">Password Reset Successful</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Your password has been reset successfully. Your new password is:
              </p>
              <div style="background-color: #111827; color: #22c55e; font-family: monospace; font-size: 20px; padding: 15px 20px; border-radius: 6px; text-align: center; letter-spacing: 2px; margin: 20px 0;">
                ${newPassword}
              </div>
              <p style="color: #4b5563; line-height: 1.6;">
                You can now log in using this new password.😊
              </p>
            </div>
            <div style="text-align: center; color: #9ca3af; font-size: 12px;">
              <p>If you did not request this password reset, please contact support immediately.</p>
              <p>&copy; ${new Date().getFullYear()} DealWise Wisdom in Deals. All rights reserved.</p>
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
