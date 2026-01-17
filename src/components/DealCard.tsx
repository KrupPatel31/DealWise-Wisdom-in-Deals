import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Truck, Shield, Award, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
interface DealCardProps {
  image: string;
  title: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  store: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  shipping?: string;
  warranty?: string;
  availability?: string;
}
export const DealCard = ({
  image,
  title,
  currentPrice,
  originalPrice,
  discount,
  store,
  description,
  rating = 4.5,
  reviewCount = 1250,
  features = [],
  shipping = "Free shipping",
  warranty = "1 year warranty",
  availability = "In stock"
}: DealCardProps) => {
  return (
    <Card className="bg-deal border-deal-border overflow-hidden hover-lift hover-glow group animate-fade-up h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-44 sm:h-52 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-500" 
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Discount Badge */}
        <Badge className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-gradient-to-r from-discount-bg to-primary text-discount-text font-bold text-xs sm:text-sm px-2.5 sm:px-3 py-1 shadow-lg">
          {discount}
        </Badge>

        {/* Store Badge */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
          <Badge variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white text-xs sm:text-sm shadow-lg">
            {store}
          </Badge>
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 flex-1 flex flex-col">
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
                    i < Math.floor(rating) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-500"
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              {rating} ({reviewCount.toLocaleString()})
            </span>
          </div>

          {availability.includes("In stock") && (
            <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10 text-xs font-medium">
              <Award className="h-3 w-3 mr-1" />
              In Stock
            </Badge>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-display font-semibold text-base sm:text-lg text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Key Features */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {features.slice(0, 3).map((feature, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
              >
                {feature}
              </Badge>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold text-price-current font-display">
              {currentPrice}
            </span>
            <span className="text-sm sm:text-base text-price-original line-through">
              {originalPrice}
            </span>
          </div>

          <div className="text-xs sm:text-sm text-accent font-semibold">
            You save: ₹{(parseInt(originalPrice.replace(/[₹,]/g, "")) - parseInt(currentPrice.replace(/[₹,]/g, ""))).toLocaleString()}
          </div>
        </div>

        {/* Shipping & Warranty Info */}
        <div className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
            <span className="truncate">{shipping}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
            <span className="truncate">{warranty}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 mt-auto">
          <Link 
            to={`/compare-prices?name=${encodeURIComponent(title)}&price=${parseInt(currentPrice.replace(/[₹,]/g, ""))}&image=${encodeURIComponent(image)}&store=${encodeURIComponent(store)}`} 
            className="block"
          >
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary font-semibold text-sm sm:text-base py-2.5 sm:py-3 group/btn transition-all">
              <BarChart3 className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Compare Prices
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};