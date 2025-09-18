import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Star, Users, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
      {/* Left Column - Text Content */}
      <div className="space-y-8 animate-fade-up">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full border border-accent/20">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
          <span className="text-sm text-muted-foreground">Trusted by 50K+ shoppers</span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-7xl font-bold font-display leading-tight">
            <span className="text-primary animate-glow-pulse">SMART</span>
            <br />
            <span className="gradient-text animate-float">DEALS</span>
          </h1>
          <h2 className="text-4xl font-bold text-primary font-display">DEALWISE</h2>
        </div>
        
        <p className="text-xl text-muted-foreground leading-relaxed max-w-lg font-medium">
          Compare prices across{" "}
          <span className="text-primary font-bold">multiple platforms</span>, track promotions, and discover the best deals with{" "}
          <span className="text-accent font-bold">intelligent analysis</span> and{" "}
          <span className="text-accent font-bold">real-time insights</span>.
        </p>
        
        {/* Stats */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-accent" />
            <span className="text-muted-foreground">1M+ Products</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            <span className="text-muted-foreground">50K+ Users</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/sign-up">
            <Button size="lg" className="bg-gradient-to-r from-accent to-primary text-white hover:from-accent/90 hover:to-primary/90 shadow-glow font-medium px-8 py-4 text-lg animate-scale-in">
              <Zap className="mr-2 h-5 w-5" />
              Start Comparing Now
            </Button>
          </Link>
          <Link to="/demo">
            <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm font-medium px-8 py-4 text-lg">
              View Live Demo →
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-4 pt-4">
          <span className="text-sm text-muted-foreground">Used by teams at:</span>
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
              <span className="text-xs font-bold">A</span>
            </div>
            <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
              <span className="text-xs font-bold">G</span>
            </div>
            <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
              <span className="text-xs font-bold">M</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Enhanced Feature Card */}
      <div className="relative animate-slide-up" style={{ animationDelay: "200ms" }}>
        {/* Floating elements */}
        <div className="absolute -top-4 -right-4 z-20 animate-float" style={{ animationDelay: "1s" }}>
          <Badge className="bg-gradient-to-r from-accent to-primary text-white text-sm px-4 py-2 shadow-glow">
            50% OFF
          </Badge>
        </div>
        
        <div className="absolute -bottom-8 -left-8 z-20 animate-float" style={{ animationDelay: "2s" }}>
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-accent rounded-full animate-glow-pulse"></div>
              <span className="text-sm font-medium">Live Price Updates</span>
            </div>
          </div>
        </div>
        
        <Card className="p-8 bg-gradient-to-br from-card via-card to-muted/50 border-deal-border relative overflow-hidden backdrop-blur-sm hover-lift">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="absolute top-4 left-4">
              <div className="w-4 h-4 bg-accent rounded-full animate-glow-pulse"></div>
            </div>
            
            <div className="text-center space-y-8">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center shadow-glow-lg animate-glow-pulse">
                <TrendingUp className="h-14 w-14 text-white" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-bold font-display">
                  <span className="text-primary">WISDOM</span>{" "}
                  <span className="text-accent">IN DEALS</span>
                </h3>
                <p className="text-muted-foreground text-lg">AI-powered comparison engine</p>
                
                {/* Feature list */}
                <div className="space-y-2 pt-4">
                  {[
                    "Real-time price tracking",
                    "Smart deal notifications", 
                    "Multi-platform comparison"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Link to="/demo">
                <Button className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-glow font-medium px-6 py-3">
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