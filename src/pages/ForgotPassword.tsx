import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ShieldCheck, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const widgetKeyRef = useRef(0);

  const resetTurnstile = () => {
    setTurnstileToken(null);
    setTurnstileError(false);
    widgetKeyRef.current += 1;
  };

  const verifyTurnstileToken = async (token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-turnstile", {
        body: { token },
      });
      if (error || !data?.success) {
        toast.error(data?.error ?? "Security check failed. Please try again.");
        return false;
      }
      return true;
    } catch {
      toast.error("Security verification failed. Please try again.");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      toast.error("Please complete the security check.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      resetTurnstile();
      setLoading(false);
      return;
    }

    const { error } = await supabase.functions.invoke("reset-password", {
      body: { email: email.trim().toLowerCase() },
    });

    if (error) {
      toast.error("Something went wrong. Please try again.");
      resetTurnstile();
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md text-center border-border bg-card/60 backdrop-blur-sm shadow-xl p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Check your inbox</h2>
            <p className="text-muted-foreground text-sm mb-6">
              If an account exists for <strong>{email}</strong>, a new password has been sent to that address.
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link to="/sign-in">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
              </Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
              <KeyRound className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground">Reset password</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Enter your email and we'll send you a new password
            </p>
          </div>

          <Card className="border-border bg-card/60 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Forgot Password</CardTitle>
              <CardDescription>
                We'll email you a temporary password you can use to sign in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Cloudflare Turnstile */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span>Security verification</span>
                  </div>
                  <div
                    className={`rounded-lg border transition-colors ${turnstileError
                      ? "border-destructive/60 bg-destructive/5"
                      : turnstileToken
                        ? "border-green-500/40 bg-green-500/5"
                        : "border-border bg-muted/20"
                      }`}
                  >
                    <TurnstileWidget
                      key={widgetKeyRef.current}
                      onSuccess={(token) => {
                        setTurnstileToken(token);
                        setTurnstileError(false);
                      }}
                      onError={() => {
                        setTurnstileError(true);
                        setTurnstileToken(null);
                        toast.error("Security check failed. Please refresh and try again.");
                      }}
                      onExpire={() => {
                        setTurnstileToken(null);
                        toast.warning("Security check expired. Please verify again.");
                      }}
                      theme="dark"
                    />
                  </div>
                  {turnstileToken && (
                    <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-3 h-3" /> Verification complete
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !turnstileToken}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Send Reset Email
                    </span>
                  )}
                </Button>
              </form>

              {/* Back link */}
              <p className="text-center text-sm text-muted-foreground mt-5">
                <Link
                  to="/sign-in"
                  className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}