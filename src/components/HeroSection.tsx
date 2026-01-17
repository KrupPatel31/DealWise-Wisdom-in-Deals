import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Zap, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
export const HeroSection = () => {
  const benefits = ["Compare prices across 50+ stores", "Save up to 40% on every purchase", "Real-time price tracking"];
  return <section className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{
        animationDelay: "3s"
      }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh]">
          {/* Left Column - Text Content */}
          <div className="space-y-6 sm:space-y-8 animate-fade-up order-2 lg:order-1">
            {/* Trust Badge */}
            

            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1]">
                <span className="text-primary text-glow">SMART</span>
                <br />
                <span className="gradient-text">DEALS</span>
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary/80 font-display">
                DEALWISE
              </h2>
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg">
              Compare prices across{" "}
              <span className="text-primary font-semibold">multiple platforms</span>,
              track promotions, and discover the best deals with{" "}
              <span className="text-accent font-semibold">intelligent analysis</span>.
            </p>

            {/* Benefits list */}
            

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link to="/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-accent to-primary text-white hover:from-accent/90 hover:to-primary/90 shadow-glow font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg group">
                  <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-glow-pulse" />
                  Start Comparing Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/how-it-works" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-border/50 hover:bg-muted/50 font-medium px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Feature Card */}
          <div className="relative animate-slide-up order-1 lg:order-2" style={{
          animationDelay: "200ms"
        }}>
            {/* Floating badges */}
            <div className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 z-20 animate-float hidden sm:block" style={{
            animationDelay: "2s"
          }}>
              <div className="glass p-3 sm:p-4 rounded-xl shadow-glow">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-accent rounded-full animate-glow-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Live Price Updates</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 sm:-top-6 -right-2 sm:-right-6 z-20 animate-float hidden md:block" style={{
            animationDelay: "1s"
          }}>
              <div className="glass p-3 sm:p-4 rounded-xl shadow-glow">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Sparkles className="h-4 w-4 text-primary animate-glow-pulse" />
                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Best Price Finder</span>
                </div>
              </div>
            </div>

            <Card className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-card via-card to-muted/50 border-deal-border relative overflow-hidden backdrop-blur-sm hover-lift gradient-border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
              <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-accent rounded-full animate-glow-pulse"></div>
                </div>

                <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto bg-gradient-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center shadow-glow-lg animate-glow-pulse">
                    <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-white" />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display">
                      <span className="text-primary">WISDOM</span>{" "}
                      <span className="text-accent">IN DEALS</span>
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-xs mx-auto">
                      Find the best prices across all major platforms instantly
                    </p>
                  </div>

                  <Link to="/search">
                    <Button className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-glow font-semibold px-5 sm:px-8 py-4 sm:py-5 text-sm sm:text-base group">
                      Discover Best Prices
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};