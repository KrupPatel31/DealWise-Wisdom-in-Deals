import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
      {/* Left Column - Text Content */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold">
            <span className="text-primary">SMART</span>
            <br />
            <span className="hero-gradient">DEALS</span>
          </h1>
          <h2 className="text-3xl font-bold text-primary">DEALWISE</h2>
        </div>
        
        <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
          Compare prices across multiple platforms, track promotions, and discover the best deals with{" "}
          <span className="text-primary font-semibold">intelligent analysis</span> and{" "}
          <span className="text-accent font-semibold">real-time insights</span>.
        </p>
        
        <div className="flex gap-4">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Zap className="mr-2 h-5 w-5" />
            Start Comparing Now
          </Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            View Demo →
          </Button>
        </div>
      </div>
      
      {/* Right Column - Feature Card */}
      <div className="relative">
        <div className="absolute top-8 right-8 z-10">
          <Badge className="bg-accent text-accent-foreground text-sm px-3 py-1">
            50% OFF
          </Badge>
        </div>
        
        <Card className="p-8 bg-gradient-to-br from-card via-card to-muted border-deal-border relative overflow-hidden">
          <div className="absolute top-4 left-4">
            <div className="w-4 h-4 bg-accent rounded-full"></div>
          </div>
          
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center glow">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">
                <span className="text-primary">WISDOM</span>{" "}
                <span className="text-accent">IN DEALS</span>
              </h3>
              <p className="text-muted-foreground">Multi-platform comparison engine</p>
            </div>
            
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Best Price
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};