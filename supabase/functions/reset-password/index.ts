import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateSecurePassword(): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*";
  const all = uppercase + lowercase + digits + special;

  // Ensure at least one of each required type
  const password: string[] = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    digits[Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  // Fill remaining 4 characters randomly
  for (let i = 0; i < 4; i++) {
    password.push(all[Math.floor(Math.random() * all.length)]);
  }

  // Shuffle the array
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase configuration missing");
    }
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Find user by email using admin API
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      throw new Error(`Failed to query users: ${listError.message}`);
    }

    const user = usersData.users.find(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      // Return success even if user not found (security: don't reveal if email exists)
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists, a new password has been sent." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate secure password
    const newPassword = generateSecurePassword();

    // Update user's password via admin API (Supabase handles hashing internally)
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) {
      throw new Error(`Failed to update password: ${updateError.message}`);
    }

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DealWise Wisdom in Deals <onboarding@resend.dev>",
        to: [email],
        subject: "Your Password Has Been Reset - DealWise Wisdom in Deals",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; font-size: 24px;">DealWise Wisdom in Deals</h1>
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
      throw new Error(`Failed to send email [${emailResponse.status}]: ${errBody}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "If an account exists, a new password has been sent." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
