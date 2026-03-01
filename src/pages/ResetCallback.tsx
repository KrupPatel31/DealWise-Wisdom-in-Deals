import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword, getPasswordStrength } from "@/utils/passwordValidation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, CheckCircle, XCircle, Loader2, Eye, EyeOff, Check, X, Lock } from "lucide-react";

const ResetCallback = () => {
  const [status, setStatus] = useState<"verifying" | "ready" | "updating" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const verifiedRef = useRef(false);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the email link
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session && !verifiedRef.current) {
          verifiedRef.current = true;
          setStatus("ready");
        }
      }
    );

    // Also check if we already have a recovery session (event may have fired before mount)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const isRecovery = hashParams.get("type") === "recovery";

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && isRecovery && !verifiedRef.current) {
        verifiedRef.current = true;
        setStatus("ready");
      }
    });

    // Timeout: if no recovery session detected after 10s, show error
    const timeout = setTimeout(() => {
      if (!verifiedRef.current) {
        setStatus("error");
        setMessage("Invalid or expired reset link. Please request a new one.");
      }
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      setMessage(validation.errors[0]);
      return;
    }

    setStatus("updating");
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setStatus("ready");
        setMessage(error.message || "Failed to update password. Please try again.");
      } else {
        // Sign out to invalidate all sessions, forcing login with new password
        await supabase.auth.signOut();
        setStatus("success");
        setMessage("Your password has been updated successfully! You can now sign in with your new password.");
      }
    } catch {
      setStatus("ready");
      setMessage("Something went wrong. Please try again.");
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
          </div>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">
                {status === "success" ? "Password Updated!" : "Set New Password"}
              </CardTitle>
              {(status === "ready" || status === "updating") && (
                <CardDescription>
                  Enter your new password below
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {/* Verifying the reset token */}
              {status === "verifying" && (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Verifying your reset link...</p>
                </div>
              )}

              {/* Token verified - show password form */}
              {(status === "ready" || status === "updating") && (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-input border-border focus:border-primary pr-10"
                        required
                        disabled={status === "updating"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className="space-y-3">
                        {(() => {
                          const { strength, label, color } = getPasswordStrength(password);
                          const validation = validatePassword(password);
                          return (
                            <>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-muted rounded-full h-2">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      strength <= 1 ? 'bg-red-500' :
                                      strength === 2 ? 'bg-orange-500' :
                                      strength === 3 ? 'bg-yellow-500' :
                                      strength === 4 ? 'bg-blue-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${(strength / 5) * 100}%` }}
                                  />
                                </div>
                                <span className={`text-sm font-medium ${color}`}>{label}</span>
                              </div>
                              <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                                <p className="text-sm font-medium text-foreground">Password Requirements:</p>
                                <div className="grid grid-cols-1 gap-1">
                                  {validation.criteria.map((criterion, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                      {criterion.met ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <X className="h-4 w-4 text-red-500" />
                                      )}
                                      <span className={criterion.met ? 'text-green-600' : 'text-muted-foreground'}>
                                        {criterion.label}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-input border-border focus:border-primary pr-10"
                        required
                        disabled={status === "updating"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-sm text-destructive">Passwords do not match</p>
                    )}
                  </div>

                  {message && (
                    <p className="text-sm text-destructive">{message}</p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={status === "updating" || password !== confirmPassword}
                  >
                    {status === "updating" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Success */}
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
                    <Button className="w-full">Sign In with New Password</Button>
                  </Link>
                </div>
              )}

              {/* Error */}
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
                    <Button className="w-full">Request New Reset Link</Button>
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
