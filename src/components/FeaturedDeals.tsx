import { useState, useEffect } from "react";
import { DealCard } from "./DealCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Deal {
  image: string;
  title: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  store: string;
  description: string;
  rating: number;
  reviewCount: number;
  features: string[];
  shipping: string;
  warranty: string;
  availability: string;
}

const fallbackDeals: Deal[] = [
  {
    image: "https://m.media-amazon.com/images/I/71RDgtHsREL.jpg",
    title: "Apple MacBook Air M2",
    currentPrice: "₹1,04,900",
    originalPrice: "₹1,19,900",
    discount: "13% OFF",
    store: "Amazon India",
    description: "Perfect for professionals with M2 chip performance.",
    rating: 4.9,
    reviewCount: 5234,
    features: ["M2 Chip", '13.6" Display', "8GB RAM"],
    shipping: "Free delivery",
    warranty: "1 year warranty",
    availability: "In stock",
  },
  {
    image: "https://rukminim2.flixcart.com/image/704/844/xif0q/mobile/r/w/j/12r-cph2585-oneplus-original-imah9zk6nddhcbsh.jpeg?q=90&crop=false",
    title: "OnePlus 12R 5G",
    currentPrice: "₹39,999",
    originalPrice: "₹45,999",
    discount: "13% OFF",
    store: "Flipkart",
    description: "Flagship with 120Hz display and 100W charging.",
    rating: 4.7,
    reviewCount: 3421,
    features: ["5G Ready", "120Hz Display", "100W Charging"],
    shipping: "Same day delivery",
    warranty: "1 year warranty",
    availability: "Limited stock",
  },
];

const searchTerms = [
  "laptop", "smartphone", "headphones", "tablet", "smartwatch", 
  "camera", "speaker", "earbuds", "monitor", "keyboard",
  "mouse", "gaming", "fitness", "electronics", "gadgets"
];

export const FeaturedDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveDeals = async () => {
      setIsLoading(true);
      try {
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        
        const { data, error } = await supabase.functions.invoke('search-products', {
          body: { query: randomTerm }
        });

        if (error || !data?.products?.length) {
          setDeals(fallbackDeals);
          return;
        }

        const liveDeals: Deal[] = data.products.slice(0, 6).map((p: any) => ({
          image: p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
          title: p.name || "Product",
          currentPrice: `₹${p.price?.toLocaleString('en-IN') || 0}`,
          originalPrice: `₹${(p.originalPrice || p.price * 1.2)?.toLocaleString('en-IN') || 0}`,
          discount: p.discount ? `${p.discount}% OFF` : `${Math.floor(Math.random() * 20 + 10)}% OFF`,
          store: p.store || "Online Store",
          description: p.description?.slice(0, 100) || "Great deal on this product!",
          rating: p.rating || (Math.random() * 1 + 4).toFixed(1),
          reviewCount: p.reviews || Math.floor(Math.random() * 5000 + 100),
          features: ["Quality Product", "Fast Delivery", "Best Price"],
          shipping: "Free delivery across India",
          warranty: "Standard warranty",
          availability: "In stock",
        }));

        setDeals(liveDeals);
      } catch (error) {
        console.error("Error fetching deals:", error);
        setDeals(fallbackDeals);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveDeals();
  }, []);

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
          <span className="text-accent font-semibold">best deals</span> across
          multiple platforms with{" "}
          <span className="text-accent font-semibold">
            real-time price comparisons
          </span>{" "}
          and detailed product insights.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading live deals...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {deals.map((deal, index) => (
            <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
              <DealCard {...deal} />
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <Link to="/search">
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
