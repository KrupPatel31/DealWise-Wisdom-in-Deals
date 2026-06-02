import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Eye,
  ShoppingCart,
  TrendingUp,
  Camera,
  ScanBarcode,
  Coins,
  Tag,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "SEARCH",
    description: "Search by product name or paste a URL from any retailer",
    details:
      "Our AI-powered engine matches products across thousands of online stores instantly",
  },
  {
    number: "02",
    icon: Camera,
    title: "VISUAL SEARCH",
    description: "Upload a product image and let AI find it for you",
    details:
      "Snap a photo or drag-and-drop an image — our Gemini-powered engine identifies products and finds the best prices",
  },
  {
    number: "03",
    icon: ScanBarcode,
    title: "SCAN BARCODE",
    description: "Use your camera to scan any product barcode instantly",
    details:
      "Point your phone at a barcode and get real-time price comparisons from multiple stores",
  },
  {
    number: "04",
    icon: Eye,
    title: "COMPARE",
    description: "View real-time prices from multiple platforms side by side",
    details:
      "See current prices, shipping costs, taxes, and total costs with historical price charts",
  },
  {
    number: "05",
    icon: Tag,
    title: "APPLY COUPONS",
    description: "Browse verified coupon codes and apply them at checkout",
    details:
      "Access hundreds of verified discount codes across categories — automatically applied to maximize savings",
  },
  {
    number: "06",
    icon: Coins,
    title: "EARN DEAL COINS",
    description: "Earn rewards on every purchase, daily login, and referral",
    details:
      "Collect Deal Coins (1 coin = ₹1) through purchases (2% cashback), daily logins, referrals, and product reviews",
  },
  {
    number: "07",
    icon: ShoppingCart,
    title: "SAVE & BUY",
    description:
      "Redeem coins, checkout at the best price, and track your orders",
    details:
      "Use Deal Coins as discounts, get order confirmation with downloadable invoices, and track delivery status",
  },
];

const highlights = [
  { label: "Stores Compared", value: "50+" },
  { label: "Average Savings", value: "Up to 50%" },
  { label: "Coin Cashback", value: "2%" },
  { label: "Verified Coupons", value: "500+" },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen dark">
      <SEO
        title="How It Works — Search, Compare, Save | DealWise"
        description="Learn how DealWise helps you search, compare prices, scan barcodes, apply coupons, and earn Deal Coins rewards in 7 simple steps."
        path="/how-it-works"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to save money shopping with DealWise",
          description:
            "Search, compare prices, scan barcodes, apply coupons and earn Deal Coins to maximize savings on every purchase.",
          step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: `${s.description}. ${s.details}`,
          })),
        }}
      />
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20">
        <div className="text-center space-y-4 sm:space-y-6 mb-10 sm:mb-16 lg:mb-20">
          <Badge className="bg-accent text-accent-foreground text-sm sm:text-lg px-4 sm:px-6 py-1.5 sm:py-2">
            HOW IT WORKS
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="text-primary">SMART SHOPPING</span>{" "}
            <span className="hero-gradient">MADE SIMPLE</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Search, compare, earn rewards, and save — all in one platform
          </p>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 sm:mb-16 lg:mb-20">
          {highlights.map((item, i) => (
            <Card
              key={i}
              className="p-4 sm:p-6 bg-deal border-deal-border text-center"
            >
              <p className="text-2xl sm:text-3xl font-bold hero-gradient">
                {item.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {item.label}
              </p>
            </Card>
          ))}
        </div>

        {/* Steps */}
        <h2 className="sr-only">Steps to save with DealWise</h2>
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 mb-10 sm:mb-16 lg:mb-20">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="p-4 sm:p-6 lg:p-8 bg-deal border-deal-border hover:border-accent/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent">
                      {step.number}
                    </span>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-2 sm:mb-3">
                    {step.description}
                  </p>
                  <p className="text-xs sm:text-sm text-accent">
                    {step.details}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-accent/20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            <span className="text-primary">Try it now — it's free!</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8">
            Start saving money today with intelligent price comparison, visual
            search, and Deal Coins rewards
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

      <Footer />
    </div>
  );
};

export default HowItWorks;
