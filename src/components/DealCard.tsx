import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DealCardProps {
  image: string;
  title: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  store: string;
  description: string;
}

export const DealCard = ({ 
  image, 
  title, 
  currentPrice, 
  originalPrice, 
  discount, 
  store, 
  description 
}: DealCardProps) => {
  return (
    <Card className="bg-deal border-deal-border overflow-hidden hover:border-accent/50 transition-all duration-300 group">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-discount-bg text-discount-text">
          {discount}
        </Badge>
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-lg text-foreground line-clamp-2">
          {title}
        </h3>
        
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-price-current">
            {currentPrice}
          </span>
          <span className="text-lg text-price-original line-through">
            {originalPrice}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-accent font-medium">{store}</span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </Card>
  );
};