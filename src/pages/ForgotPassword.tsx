import { useState, useRef } from "react";
import { Link } from "react-router-dom";
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
import {
  TrendingUp,
  ArrowLeft,
  Mail,
  CheckCircle,
  WifiOff,
  Loader2,
} from "lucide-react";
import { runAuthWithRetry, friendlyAuthError } from "@/utils/authRetry";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const online = useOnlineStatus();
  const lastSubmitRef = useRef<number>(0);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitRef.current < 600) return;
    lastSubmitRef.current = now;

    if (!emailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!online) {
      toast.error("You're offline. Please reconnect and try again.");
      return;
    }

    setLoading(true);
    const t0 = performance.now();
    console.info(`[forgotPassword] submit @ ${new Date().toISOString()}`);

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await runAuthWithRetry(
        () =>
          fetch(
            `https://${projectId}.supabase.co/functions/v1/reset-password`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            },
          ).then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              const err: any = new Error(
                data?.error || `Request failed (${res.status})`,
              );
              err.status = res.status;
              return { data: null, error: err };
            }
            return { data, error: null };
          }),
        { label: "forgotPassword" },
      );

      if (response.error) throw response.error;

      console.info(
        `[forgotPassword] success in ${Math.round(performance.now() - t0)}ms`,
      );
      setEmailSent(true);
      toast.success(
        "If an account exists, you'll receive a new password shortly.",
      );
    } catch (error: any) {
      console.warn(
        `[forgotPassword] failed in ${Math.round(performance.now() - t0)}ms:`,
        error?.message || error,
      );
      toast.error(friendlyAuthError(error));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen dark">
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
              Reset Password
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter your email to receive a new password
            </p>
          </div>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">
                Forgot Password
              </CardTitle>
              <CardDescription>
                We'll generate a new password and send it to your email
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {!online && (
                <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  <WifiOff className="h-4 w-4" />
                  You're offline. Please reconnect to request a password reset.
                </div>
              )}
              {emailSent ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Check your inbox
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      If an account with{" "}
                      <span className="font-medium text-foreground">
                        {email}
                      </span>{" "}
                      exists, you'll receive your new password shortly.
                    </p>
                  </div>
                  <div className="pt-4 space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setEmailSent(false)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Try a different email
                    </Button>
                    <Link to="/sign-in" className="block">
                      <Button variant="ghost" className="w-full">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email Address
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

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={loading || !emailValid}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>

                  <Link to="/sign-in" className="block">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Sign In
                    </Button>
                  </Link>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
