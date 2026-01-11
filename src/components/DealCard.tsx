import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, Truck, Shield, Award, BarChart3 } from "lucide-react";
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
  return <Card className="bg-deal border-deal-border overflow-hidden hover-lift hover-glow group animate-fade-up">
      <div className="relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />

        {/* Discount Badge */}
        <Badge className="absolute top-4 left-4 bg-discount-bg text-discount-text font-bold text-sm px-3 py-1 animate-glow-pulse">
          {discount}
        </Badge>

        {/* Wishlist Button */}
        

        {/* Store Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            {store}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({
              length: 5
            }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating} ({reviewCount.toLocaleString()})
            </span>
          </div>

          {availability === "In stock" && <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10">
              <Award className="h-3 w-3 mr-1" />
              In Stock
            </Badge>}
        </div>

        {/* Product Title */}
        <h3 className="font-display font-semibold text-lg text-foreground line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Key Features */}
        {features.length > 0 && <div className="flex flex-wrap gap-1">
            {features.slice(0, 3).map((feature, index) => <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground">
                {feature}
              </Badge>)}
          </div>}

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-price-current font-display">
              {currentPrice}
            </span>
            <span className="text-lg text-price-original line-through">
              {originalPrice}
            </span>
          </div>

          {/* Savings */}
          <div className="text-sm text-accent font-medium">
            You save: ₹
            {(parseInt(originalPrice.replace(/[₹,]/g, "")) - parseInt(currentPrice.replace(/[₹,]/g, ""))).toLocaleString()}
          </div>
        </div>

        {/* Shipping & Warranty Info */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-accent" />
            <span>{shipping}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent" />
            <span>{warranty}</span>
          </div>
        </div>

        {/* Description */}
        

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link to={`/compare-prices?name=${encodeURIComponent(title)}&price=${parseInt(currentPrice.replace(/[₹,]/g, ""))}&image=${encodeURIComponent(image)}&store=${encodeURIComponent(store)}`} className="flex-1">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
              <BarChart3 className="h-4 w-4 mr-2" />
              Compare Prices
            </Button>
          </Link>
          
        </div>
      </div>
    </Card>;
};