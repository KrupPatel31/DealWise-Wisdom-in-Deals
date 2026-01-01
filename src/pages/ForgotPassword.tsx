import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TrendingUp, ArrowLeft, Mail, CheckCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        toast({
          title: "Check your email",
          description: "If an account exists, you'll receive a password reset link.",
        });
      } else {
        toast({
          title: "Request failed",
          description: data.error || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter your email to receive a password reset link
            </p>
          </div>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">Forgot Password</CardTitle>
              <CardDescription>
                We'll send you instructions to reset your password
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {emailSent ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Check your inbox</h3>
                    <p className="text-muted-foreground text-sm">
                      If an account with <span className="font-medium text-foreground">{email}</span> exists, 
                      you'll receive a password reset link shortly.
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

                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
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