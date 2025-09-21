import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, ShoppingCart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "SEARCH",
    description:
      "Enter the product name or paste a product URL from any major retailer",
    details:
      "Our AI-powered search engine instantly recognizes products across thousands of online stores",
  },
  {
    number: "02",
    icon: Eye,
    title: "COMPARE",
    description: "View real-time prices from multiple platforms side by side",
    details:
      "See current prices, shipping costs, taxes, and total costs from all major retailers",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "ANALYZE",
    description:
      "Get intelligent insights on price trends and best buying opportunities",
    details:
      "Historical data, price predictions, and seasonal trends help you make smart decisions",
  },
  {
    number: "04",
    icon: ShoppingCart,
    title: "SAVE",
    description:
      "Buy from the best deal or set price alerts for future purchases",
    details:
      "Direct links to stores, coupon codes, and cashback opportunities maximize your savings",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen dark">
      <Header />

      <main className="container mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-20">
          <Badge className="bg-accent text-accent-foreground text-lg px-6 py-2">
            HOW IT WORKS
          </Badge>
          <h1 className="text-5xl font-bold">
            <span className="text-primary">SMART SHOPPING</span>{" "}
            <span className="hero-gradient">MADE SIMPLE</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Save money in 4 easy steps with our intelligent price comparison
            platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="p-8 bg-deal border-deal-border hover:border-accent/50 transition-all duration-300 group"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-3xl font-bold text-accent">
                        {step.number}
                      </span>
                      <h3 className="text-2xl font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-lg text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    <p className="text-sm text-accent">{step.details}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-card via-card to-muted border-deal-border">
              <div className="text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center glow">
                  <TrendingUp className="h-16 w-16 text-white" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">
                    <span className="text-primary">SAVE UP TO</span>
                    <br />
                    <span className="hero-gradient text-4xl">50%</span>
                  </h3>
                  <p className="text-muted-foreground">
                    Average savings across all categories
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-accent/20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-primary">Try it now - it's free!</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start saving money today with intelligent price comparison
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

export default HowItWorks;
