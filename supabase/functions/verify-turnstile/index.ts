import { serve } from "https://deno.land/std/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, remoteip } = await req.json();

    if (!token || typeof token !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Missing Turnstile token" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const secretKey = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (!secretKey) {
      console.error("TURNSTILE_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteip) formData.append("remoteip", remoteip);

    const cfResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData }
    );

    if (!cfResponse.ok) {
      console.error("Cloudflare siteverify HTTP error:", cfResponse.status);
      return new Response(
        JSON.stringify({ success: false, error: "Verification service unavailable" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = await cfResponse.json();
    console.log("Turnstile verification result:", JSON.stringify(result));

    if (result.success) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const errorCodes: Record<string, string> = {
      "missing-input-secret": "Server configuration error",
      "invalid-input-secret": "Server configuration error",
      "missing-input-response": "Please complete the security check",
      "invalid-input-response": "Security check failed, please try again",
      "invalid-widget-id": "Server configuration error",
      "invalid-action": "Server configuration error",
      "invalid-cdata": "Server configuration error",
      "bad-request": "Invalid request",
      "timeout-or-duplicate": "Security check expired, please try again",
      "internal-error": "Verification service error, please try again",
    };

    const firstError = result["error-codes"]?.[0] ?? "unknown";
    const message = errorCodes[firstError] ?? "Security verification failed";

    return new Response(
      JSON.stringify({
        success: false,
        error: message,
        codes: result["error-codes"],
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("verify-turnstile error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});