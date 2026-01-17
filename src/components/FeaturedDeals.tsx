import { DealCard } from "./DealCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const deals = [
  {
    image:
      "https://media.tatacroma.com/Croma%20Assets/Entertainment/Headphones%20and%20Earphones/Images/262566_0_emihyi.png",
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    currentPrice: "₹24,990",
    originalPrice: "₹29,990",
    discount: "17% OFF",
    store: "Amazon India",
    description:
      "Industry-leading noise canceling perfect for Mumbai commutes and Bangalore traffic. Trusted by Arjun from Delhi.",
    rating: 4.8,
    reviewCount: 2847,
    features: ["Noise Cancelling", "30Hr Battery", "Quick Charge"],
    shipping: "Free delivery across India",
    warranty: "2 year warranty",
    availability: "In stock - Delhi warehouse",
  },
  {
    image: "https://m.media-amazon.com/images/I/71RDgtHsREL.jpg",
    title: "Apple MacBook Air M2 (2022)",
    currentPrice: "₹1,04,900",
    originalPrice: "₹1,19,900",
    discount: "13% OFF",
    store: "Croma",
    description:
      "Perfect for IT professionals in Hyderabad and Chennai. Recommended by Priya from Pune for coding and design work.",
    rating: 4.9,
    reviewCount: 5234,
    features: ["M2 Chip", '13.6" Display', "8GB RAM"],
    shipping: "Free delivery + setup",
    warranty: "1 year Apple warranty",
    availability: "Available in Mumbai store",
  },
  {
    image:
      "https://rukminim2.flixcart.com/image/704/844/xif0q/mobile/r/w/j/12r-cph2585-oneplus-original-imah9zk6nddhcbsh.jpeg?q=90&crop=false",
    title: "OnePlus 12R 5G Smartphone",
    currentPrice: "₹39,999",
    originalPrice: "₹45,999",
    discount: "13% OFF",
    store: "Flipkart",
    description:
      "Latest flagship from OnePlus with 120Hz display. Popular choice among students in Delhi and Bangalore colleges.",
    rating: 4.7,
    reviewCount: 3421,
    features: ["5G Ready", "120Hz Display", "100W Charging"],
    shipping: "Same day delivery in metros",
    warranty: "1 year OnePlus warranty",
    availability: "Limited stock - Mumbai",
  },
  {
    image:
      "https://i01.appmifile.com/webfile/globalimg/products/m/mi-tv-4x-65/app_01.jpg",
    title: "Mi 65-inch 4K Android TV",
    currentPrice: "₹54,999",
    originalPrice: "₹79,999",
    discount: "31% OFF",
    store: "Mi Store India",
    description:
      "Smart TV with Dolby Vision, perfect for Indian families. Highly rated by Rajesh from Ahmedabad for cricket viewing.",
    rating: 4.6,
    reviewCount: 1876,
    features: ["4K HDR", "Android TV", "Dolby Audio"],
    shipping: "Free installation",
    warranty: "2 year comprehensive warranty",
    availability: "Available nationwide",
  },
  {
    image: "https://m.media-amazon.com/images/I/61BrDg5QSUL.jpg",
    title: "Prestige Svachh 5L Pressure Cooker",
    currentPrice: "₹2,499",
    originalPrice: "₹3,995",
    discount: "37% OFF",
    store: "Amazon India",
    description:
      "Perfect for Indian cooking - dal, rice, and curries. Recommended by Kavitha from Chennai for large families.",
    rating: 4.5,
    reviewCount: 12450,
    features: ["5 Liter", "Induction Base", "Safety Features"],
    shipping: "Free delivery",
    warranty: "5 year warranty",
    availability: "In stock - Chennai warehouse",
  },
  {
    image: "https://m.media-amazon.com/images/I/61ni3t1ryQL.jpg",
    title: "Logitech MX Master 3S Wireless Mouse",
    currentPrice: "₹7,995",
    originalPrice: "₹9,995",
    discount: "20% OFF",
    store: "Amazon India",
    description:
      "Premium mouse for professionals. Popular among software engineers in Bangalore and designers in Mumbai.",
    rating: 4.8,
    reviewCount: 3215,
    features: ["Wireless", "Precision Scroll", "Multi-Device"],
    shipping: "Next day delivery",
    warranty: "2 year warranty",
    availability: "In stock",
  },
];

export const FeaturedDeals = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 relative z-10">
        <div className="text-center space-y-4 sm:space-y-6 mb-10 sm:mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent animate-glow-pulse" />
            <span className="text-accent font-semibold text-sm sm:text-base">Hot Deals</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display">
            <span className="text-muted-foreground">FEATURED</span>{" "}
            <span className="gradient-text">DEALS</span>
          </h2>

          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the{" "}
            <span className="text-accent font-semibold">best deals</span> across
            multiple platforms with{" "}
            <span className="text-accent font-semibold">real-time price comparisons</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-10 sm:mb-14">
          {deals.map((deal, index) => (
            <div 
              key={index} 
              className="animate-fade-up" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <DealCard {...deal} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/search">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-glow font-semibold px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg group"
            >
              View All Deals
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
