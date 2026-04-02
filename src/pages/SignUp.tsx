import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { validatePassword, getPasswordStrength } from "@/utils/passwordValidation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, Eye, EyeOff, Check, X } from "lucide-react";
import { SuccessOverlay } from "@/components/SuccessOverlay";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.errors.join(', '));
      return;
    }

    if (!turnstileToken) {
      toast.error("Please wait for security verification to complete.");
      return;
    }

    setLoading(true);

    try {
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-turnstile', {
        body: { token: turnstileToken },
      });

      if (verifyError || !verifyData?.success) {
        toast.error("Security verification failed. Please try again.");
        resetTurnstile();
        setLoading(false);
        return;
      }

      const { error } = await signUp(formData.email, formData.password, formData.name);
      
      if (error) {
        toast.error(error.message);
        resetTurnstile();
      } else {
        setShowSuccess(true);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      resetTurnstile();
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Join DealWise to start finding the best deals</p>
          </div>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">Sign Up</CardTitle>
              <CardDescription>
                Create your account to get started
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-input border-border focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-input border-border focus:border-primary"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
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
                  {formData.password && (
                    <div className="space-y-3">
                      {(() => {
                        const { strength, label, color } = getPasswordStrength(formData.password);
                        const validation = validatePassword(formData.password);
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
                  {!formData.password && (
                    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                      <p className="text-sm font-medium text-foreground">Password Requirements:</p>
                      <div className="grid grid-cols-1 gap-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4" />
                          <span>At least 8 characters</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4" />
                          <span>One lowercase letter (a-z)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4" />
                          <span>One uppercase letter (A-Z)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4" />
                          <span>One number (0-9)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4" />
                          <span>One special character (!@#$%^&*)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:text-primary/80">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:text-primary/80">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div ref={containerRef} />
                {turnstileError && <p className="text-xs text-destructive">{turnstileError}</p>}

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!formData.agreeToTerms || loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  to="/sign-in" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      <SuccessOverlay show={showSuccess} onClose={() => setShowSuccess(false)} variant="signup" />
    </div>
  );
};

export default SignUp;
