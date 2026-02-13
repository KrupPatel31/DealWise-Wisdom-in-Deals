import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { validatePassword, getPasswordStrength } from "@/utils/passwordValidation";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TrendingUp, ArrowLeft, Eye, EyeOff, Check, X, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      toast({
        title: "Invalid password",
        description: validation.errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.functions.invoke("reset-password", {
      body: { email, newPassword: password, origin: window.location.origin },
    });

    if (error) {
      toast({
        title: "Reset failed",
        description: "Unable to reset password. Please try again.",
        variant: "destructive",
      });
    } else {
      setResetSuccess(true);
      toast({
        title: "Verification email sent",
        description: "Please check your email and click the link to complete the password reset.",
      });
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
              <span className="text-xl sm:text-2xl font-bold text-primary">DEALWISE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter your email and choose a new password
            </p>
          </div>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">Forgot Password</CardTitle>
              <CardDescription>
                Enter your email and new password to reset
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {resetSuccess ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Verification Email Sent!</h3>
                    <p className="text-muted-foreground text-sm">
                      If an account with <span className="font-medium text-foreground">{email}</span> exists, 
                      a verification email has been sent. Please click the link in the email to complete your password reset.
                    </p>
                  </div>
                  <Link to="/sign-in" className="block">
                    <Button className="w-full">Back to Sign In</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-input border-border focus:border-primary"
                      required
                    />
                  </div>

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
                                      {criterion.icon === 'check' ? (
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

                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={loading || password !== confirmPassword}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
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
