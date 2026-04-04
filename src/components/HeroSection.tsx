import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 lg:py-20 grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center min-h-[60vh] sm:min-h-[80vh]">
      {/* Left Column - Text Content */}
      <div className="space-y-8 animate-fade-up">
        {/* Trust Badge */}

        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-tight">
            <span className="text-primary animate-glow-pulse">SMART</span>
            <br />
            <span className="gradient-text animate-float">DEALS</span>
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary font-display">
            DEALWISE
          </h2>
        </div>

        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg font-medium">
          Compare prices across{" "}
          <span className="text-primary font-bold">multiple platforms</span>,
          track promotions, and discover the best deals with{" "}
          <span className="text-accent font-bold">intelligent analysis</span>{" "}
          and <span className="text-accent font-bold">real-time insights</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/sign-up" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-accent to-primary text-white hover:from-accent/90 hover:to-primary/90 shadow-glow font-medium px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg animate-scale-in"
            >
              <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Start Comparing Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Column - Feature Card */}
      <div className="relative animate-slide-up hidden sm:block" style={{ animationDelay: "200ms" }}>
        <div className="absolute -bottom-6 -left-6 z-20 animate-float hidden lg:block" style={{ animationDelay: "2s" }}>
          <div className="glass p-3 sm:p-4 rounded-xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-accent rounded-full animate-glow-pulse"></div>
              <span className="text-xs sm:text-sm font-medium">Live Price Updates</span>
            </div>
          </div>
        </div>

        <Card className="p-6 sm:p-8 bg-gradient-to-br from-card via-card to-muted/50 border-deal-border relative overflow-hidden backdrop-blur-sm hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-accent rounded-full animate-glow-pulse"></div>
            </div>

            <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 mx-auto bg-gradient-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center shadow-glow-lg animate-glow-pulse">
                <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14 text-white" />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display">
                  <span className="text-primary">WISDOM</span>{" "}
                  <span className="text-accent">IN DEALS</span>
                </h3>
              </div>

              <Link to="/search">
                <Button className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-glow font-medium px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                  Discover Best Prices
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
