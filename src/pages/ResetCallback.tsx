import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CheckCircle, XCircle, Loader2 } from "lucide-react";

const ResetCallback = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleReset = async () => {
      // Wait for Supabase to process the recovery token from the URL
      const { data: { session } } = await supabase.auth.getSession();
      
      // Listen for recovery event
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session?.user?.email) {
          // Call confirm-password-reset edge function
          const { data, error } = await supabase.functions.invoke("confirm-password-reset", {
            body: { email: session.user.email },
          });

          if (error || data?.error) {
            setStatus("error");
            setMessage(data?.error || "Failed to reset password. The link may have expired.");
          } else {
            setStatus("success");
            setMessage("Your password has been updated successfully!");
          }

          // Sign out the recovery session
          await supabase.auth.signOut();
          subscription.unsubscribe();
        }
      });

      // If session already exists with recovery, handle it
      if (session?.user?.email) {
        const { data, error } = await supabase.functions.invoke("confirm-password-reset", {
          body: { email: session.user.email },
        });

        if (error || data?.error) {
          setStatus("error");
          setMessage(data?.error || "Failed to reset password. The link may have expired.");
        } else {
          setStatus("success");
          setMessage("Your password has been updated successfully!");
        }

        await supabase.auth.signOut();
        subscription.unsubscribe();
      }

      // Timeout after 10 seconds
      setTimeout(() => {
        setStatus((prev) => {
          if (prev === "loading") return "error";
          return prev;
        });
        setMessage((prev) => prev || "Reset link verification timed out. Please try again.");
      }, 10000);
    };

    handleReset();
  }, []);

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
          </div>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">Password Reset</CardTitle>
            </CardHeader>
            <CardContent>
              {status === "loading" && (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Verifying and updating your password...</p>
                </div>
              )}

              {status === "success" && (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Password Updated!</h3>
                  <p className="text-muted-foreground text-sm">{message}</p>
                  <Link to="/sign-in" className="block">
                    <Button className="w-full">Sign In Now</Button>
                  </Link>
                </div>
              )}

              {status === "error" && (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Reset Failed</h3>
                  <p className="text-muted-foreground text-sm">{message}</p>
                  <Link to="/forgot-password" className="block">
                    <Button className="w-full">Try Again</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetCallback;
