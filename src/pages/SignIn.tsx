import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TrendingUp, Eye, EyeOff, WifiOff, Loader2 } from "lucide-react";
import { SuccessOverlay } from "@/components/SuccessOverlay";
import { friendlyAuthError } from "@/utils/authRetry";
import { SEO } from "@/components/SEO";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { signIn, user, online } = useAuth();
  const navigate = useNavigate();
  const lastSubmitRef = useRef<number>(0);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = emailValid && password.length >= 1 && !loading;

  // Clear stale state on mount (defensive against partial sessions)
  useEffect(() => {
    setShowSuccess(false);
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debounce double-submits within 600ms
    const now = Date.now();
    if (now - lastSubmitRef.current < 600) {
      return;
    }
    lastSubmitRef.current = now;

    if (!emailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);
    const t0 = performance.now();
    console.info(`[signIn] submit @ ${new Date().toISOString()}`);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.warn(
          `[signIn] failed in ${Math.round(performance.now() - t0)}ms:`,
          error?.message || error,
        );
        toast.error(friendlyAuthError(error));
      } else {
        console.info(
          `[signIn] success in ${Math.round(performance.now() - t0)}ms`,
        );
        setShowSuccess(true);
      }
    } catch (err) {
      console.error(
        `[signIn] threw in ${Math.round(performance.now() - t0)}ms:`,
        err,
      );
      toast.error(friendlyAuthError(err));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen dark">
      <SEO
        title="Sign In — DealWise"
        description="Sign in to your DealWise account to track deals, save favorites, manage orders, and redeem Deal Coins rewards."
        path="/sign-in"
      />
      <Header />

      <main className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-xl sm:text-2xl font-bold text-primary">
                DEALWISE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sign in to your account to continue comparing deals
            </p>
          </div>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {!online && (
                <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  <WifiOff className="h-4 w-4" />
                  You're offline. We'll queue your sign-in and retry
                  automatically.
                </div>
              )}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border focus:border-primary"
                    required
                    autoComplete="email"
                  />
                  {email.length > 0 && !emailValid && (
                    <p className="text-xs text-destructive">
                      Please enter a valid email address.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-input border-border focus:border-primary pr-10"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!canSubmit}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <SuccessOverlay
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        variant="login"
      />
    </div>
  );
};

export default SignIn;
