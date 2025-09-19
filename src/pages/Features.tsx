import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, TrendingUp, Brain, Bell, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Globe,
    title: "MULTI-PLATFORM COMPARISON",
    description:
      "Compare prices across Amazon, Best Buy, Walmart, Target, and 50+ other platforms in real-time",
    benefits: [
      "Real-time price updates",
      "Cross-platform search",
      "Universal product matching",
    ],
  },
  {
    icon: TrendingUp,
    title: "PRICE TRACKING & ALERTS",
    description:
      "Track price changes and get notified when deals become available or prices drop",
    benefits: [
      "Custom price alerts",
      "Historical price charts",
      "Drop notifications",
    ],
  },
  {
    icon: Brain,
    title: "SMART ANALYSIS ENGINE",
    description:
      "AI-powered analysis of payment options, promotional benefits, and total cost calculations",
    benefits: [
      "Total cost analysis",
      "Payment optimization",
      "Coupon integration",
    ],
  },
  {
    icon: Bell,
    title: "INSTANT NOTIFICATIONS",
    description:
      "Get notified immediately when your watched items go on sale or reach your target price",
    benefits: ["Email alerts", "Push notifications", "SMS updates"],
  },
  {
    icon: Shield,
    title: "VERIFIED DEALS",
    description:
      "All deals are verified and updated in real-time to ensure accuracy and availability",
    benefits: ["Deal verification", "Stock monitoring", "Expiry tracking"],
  },
  {
    icon: Zap,
    title: "LIGHTNING FAST SEARCH",
    description:
      "Find the best deals in seconds with our optimized search and filtering system",
    benefits: ["Instant search", "Smart filters", "Category browsing"],
  },
];

const Features = () => {
  return (
    <div className="min-h-screen dark">
      <Header />

      <main className="container mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-20">
          <Badge className="bg-accent text-accent-foreground text-lg px-6 py-2">
            FEATURES
          </Badge>
          <h1 className="text-5xl font-bold">
            <span className="text-primary">POWERFUL</span>{" "}
            <span className="hero-gradient">FEATURES</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover why millions of shoppers trust DealWise to find the best
            deals across the internet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-deal border-deal-border hover:border-accent/50 transition-all duration-300 group"
            >
              <div className="w-16 h-16 mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-accent"
                  >
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Card className="p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-accent/20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-primary">Ready to save money?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join millions of smart shoppers who use DealWise to find the best
            deals
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/search" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-accent to-primary text-white hover:from-accent/90 hover:to-primary/90 shadow-glow font-medium px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg animate-scale-in"
              >
                <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Start Comparing Now
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Features;
