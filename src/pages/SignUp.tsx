import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, ShieldCheck, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw) => /[0-9]/.test(pw) },
  { label: "One special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const widgetKeyRef = useRef(0);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const passwordValid = passwordRules.every((r) => r.test(password));

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

    if (!passwordValid) {
      toast.error("Password does not meet all requirements.");
      return;
    }
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions.");
      return;
    }
    if (!turnstileToken) {
      toast.error("Please complete the security check.");
      return;
    }

    setLoading(true);

    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      resetTurnstile();
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);
    if (error) {
      toast.error(error.message);
      resetTurnstile();
    } else {
      setDone(true);
    }

    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md text-center border-border bg-card/60 backdrop-blur-sm shadow-xl p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Check your email</h2>
            <p className="text-muted-foreground text-sm mb-6">
              We've sent a verification link to <strong>{email}</strong>. Please verify your email before signing in.
            </p>
            <Button variant="outline" onClick={() => navigate("/sign-in")} className="w-full">
              Go to Sign In
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
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground">Create account</h1>
            <p className="text-muted-foreground mt-1 text-sm">Join DealWise and start saving today</p>
          </div>

          <Card className="border-border bg-card/60 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Sign Up</CardTitle>
              <CardDescription>Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                  />
                </div>

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
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
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

                  {/* Password rules */}
                  {password.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {passwordRules.map((rule) => {
                        const passed = rule.test(password);
                        return (
                          <li
                            key={rule.label}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${passed ? "text-green-500" : "text-muted-foreground"
                              }`}
                          >
                            {passed ? (
                              <Check className="w-3 h-3 shrink-0" />
                            ) : (
                              <X className="w-3 h-3 shrink-0" />
                            )}
                            {rule.label}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(v) => setAcceptTerms(Boolean(v))}
                    disabled={loading}
                    className="mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <Link to="/features" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/about" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
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
                  disabled={loading || !turnstileToken || !passwordValid || !acceptTerms}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" /> Create Account
                    </span>
                  )}
                </Button>
              </form>

              {/* Login link */}
              <p className="text-center text-sm text-muted-foreground mt-5">
                Already have an account?{" "}
                <Link to="/sign-in" className="text-primary hover:underline font-medium">
                  Sign in
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