import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SuccessOverlay } from "@/components/SuccessOverlay";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const widgetKeyRef = useRef(0); // increment to remount widget

  const { signIn } = useAuth();
  const navigate = useNavigate();

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

    setLoading(true);

    // Verify Turnstile server-side first
    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      resetTurnstile();
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
      resetTurnstile();
    } else {
      setShowSuccess(true);
    }

    setLoading(false);
  };

  if (showSuccess) {
    return (
      <SuccessOverlay
        variant="login"
        show={showSuccess}
        onClose={() => navigate("/")}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
              <LogIn className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-1 text-sm">Sign in to your DealWise account</p>
          </div>

          <Card className="border-border bg-card/60 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
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

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                      Signing in…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" /> Sign In
                    </span>
                  )}
                </Button>
              </form>

              {/* Register link */}
              <p className="text-center text-sm text-muted-foreground mt-5">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-primary hover:underline font-medium">
                  Create one
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