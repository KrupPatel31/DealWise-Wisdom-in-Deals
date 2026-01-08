import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPInput } from "@/components/OTPInput";
import { TrendingUp, ArrowLeft, CheckCircle, RefreshCw } from "lucide-react";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const type = location.state?.type || "signup"; // 'signup' or 'recovery'
  const fullName = location.state?.fullName || "";

  useEffect(() => {
    if (!email) {
      navigate(type === "recovery" ? "/forgot-password" : "/sign-up");
    }
  }, [email, navigate, type]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (type === "signup") {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: "signup",
        });

        if (error) throw error;

        setVerified(true);
        toast({
          title: "Email verified!",
          description: "Your account has been created successfully.",
        });

        // Auto-login happens via verifyOtp, redirect after short delay
        setTimeout(() => navigate("/"), 1500);
      } else {
        // Recovery flow - verify OTP and navigate to reset password
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: "recovery",
        });

        if (error) throw error;

        setVerified(true);
        toast({
          title: "OTP verified!",
          description: "You can now reset your password.",
        });

        setTimeout(() => navigate("/reset-password"), 1500);
      }
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);

    try {
      if (type === "signup") {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
      }

      setCountdown(60);
      toast({
        title: "OTP sent!",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen dark">
      <Header />

      <main className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-xl sm:text-2xl font-bold text-primary">DEALWISE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {type === "signup" ? "Verify Your Email" : "Enter Verification Code"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter the 6-digit code sent to {email}
            </p>
          </div>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">
                {verified ? "Verified!" : "Enter OTP"}
              </CardTitle>
              <CardDescription>
                {verified
                  ? type === "signup"
                    ? "Redirecting you to homepage..."
                    : "Redirecting to password reset..."
                  : "Check your email for the verification code"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {verified ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {type === "signup"
                      ? "Your account is ready!"
                      : "You can now set a new password."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <OTPInput value={otp} onChange={setOtp} disabled={loading} />
                  </div>

                  <Button
                    onClick={handleVerify}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code?
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleResend}
                      disabled={resending || countdown > 0}
                      className="w-full"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${resending ? "animate-spin" : ""}`} />
                      {countdown > 0
                        ? `Resend in ${countdown}s`
                        : resending
                        ? "Sending..."
                        : "Resend OTP"}
                    </Button>
                  </div>

                  <Link to={type === "signup" ? "/sign-up" : "/forgot-password"} className="block">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go Back
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyOTP;
