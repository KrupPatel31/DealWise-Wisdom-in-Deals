import { DealCard } from "./DealCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const deals = [
  {
    image: "https://static.wixstatic.com/media/c3da52_74e7d6a15eb34e1a8e94453561a1b02e~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_74e7d6a15eb34e1a8e94453561a1b02e~mv2.png",
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    currentPrice: "₹24,883",
    originalPrice: "₹29,224",
    discount: "15% OFF",
    store: "Amazon",
    description: "Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI for restored sound quality.",
    rating: 4.8,
    reviewCount: 2847,
    features: ["Noise Cancelling", "30Hr Battery", "Quick Charge"],
    shipping: "Free 2-day shipping",
    warranty: "2 year warranty",
    availability: "In stock"
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_03fefc6d3d3e4bd5a61675ae4158ca3b~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_03fefc6d3d3e4bd5a61675ae4158ca3b~mv2.png",
    title: "Apple MacBook Air M2 (2022)",
    currentPrice: "₹83,417",
    originalPrice: "₹1,00,117",
    discount: "17% OFF",
    store: "Best Buy",
    description: "Supercharged by M2 chip. Ultra-thin design with liquid retina display. All-day battery life up to 18 hours.",
    rating: 4.9,
    reviewCount: 5234,
    features: ["M2 Chip", "13.6\" Display", "8GB RAM"],
    shipping: "Free shipping",
    warranty: "1 year Apple warranty",
    availability: "In stock"
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_63a7ad9e8f93492bbf58a26cdce2ae7c~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_63a7ad9e8f93492bbf58a26cdce2ae7c~mv2.png",
    title: "Nintendo Switch OLED Model",
    currentPrice: "₹26,637",
    originalPrice: "₹29,142",
    discount: "9% OFF",
    store: "Walmart",
    description: "Enhanced gaming experience with vibrant 7-inch OLED screen and improved dock with wired LAN port.",
    rating: 4.7,
    reviewCount: 3421,
    features: ["OLED Screen", "64GB Storage", "Enhanced Audio"],
    shipping: "Free shipping",
    warranty: "1 year Nintendo warranty",
    availability: "In stock"
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_9132cbb00669421c92e1b58e92e7cf7d~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_9132cbb00669421c92e1b58e92e7cf7d~mv2.png",
    title: "Samsung 65-inch QLED 4K Smart TV",
    currentPrice: "₹75,149",
    originalPrice: "₹1,00,199",
    discount: "25% OFF",
    store: "Target",
    description: "Quantum Dot technology delivers brilliant colors. Smart TV powered by Tizen OS with voice control and gaming features.",
    rating: 4.6,
    reviewCount: 1876,
    features: ["QLED 4K", "Smart TV", "Gaming Mode"],
    shipping: "Free installation",
    warranty: "2 year Samsung warranty",
    availability: "In stock"
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_59f0a005039646df821fed384c6fcddc~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_59f0a005039646df821fed384c6fcddc~mv2.png",
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    currentPrice: "₹6,679",
    originalPrice: "₹10,854",
    discount: "38% OFF",
    store: "Macy's",
    description: "7 appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.",
    rating: 4.5,
    reviewCount: 12450,
    features: ["7-in-1 Functions", "6 Quart", "Safety Features"],
    shipping: "Free shipping",
    warranty: "1 year warranty",
    availability: "In stock"
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_4310eb49615f449999c192fdf719695d~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_4310eb49615f449999c192fdf719695d~mv2.png",
    title: "Logitech MX Master 3S Wireless Mouse",
    currentPrice: "₹7,514",
    originalPrice: "₹8,349",
    discount: "10% OFF",
    store: "B&H Photo Video",
    description: "Advanced wireless mouse with ultra-precise scrolling, customizable buttons, and cross-computer control.",
    rating: 4.8,
    reviewCount: 3215,
    features: ["Wireless", "Precision Scroll", "Multi-Device"],
    shipping: "Free shipping",
    warranty: "2 year warranty",
    availability: "In stock"
  }
];

export const FeaturedDeals = () => {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="text-center space-y-6 mb-16 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="text-accent font-medium">Hot Deals</span>
        </div>
        
        <h2 className="text-5xl font-bold font-display">
          <span className="text-muted-foreground">FEATURED</span>{" "}
          <span className="gradient-text">DEALS</span>
        </h2>
        
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover the{" "}
          <span className="text-accent font-semibold">best deals</span>{" "}
          across multiple platforms with{" "}
          <span className="text-accent font-semibold">real-time price comparisons</span>{" "}
          and detailed product insights.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {deals.map((deal, index) => (
          <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
            <DealCard {...deal} />
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Link to="/demo">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-glow font-medium px-8 py-3"
          >
            View All Deals
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};