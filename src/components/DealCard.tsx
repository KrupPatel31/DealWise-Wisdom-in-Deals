import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Truck, Shield, Award, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SuccessOverlay } from "@/components/SuccessOverlay";
import { ShareDeal } from "@/components/ShareDeal";
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
  const [showDealOverlay, setShowDealOverlay] = useState(false);
  const navigate = useNavigate();
  const dealUrl = `/compare-prices?name=${encodeURIComponent(title)}&price=${parseInt(currentPrice.replace(/[₹,]/g, ""))}&image=${encodeURIComponent(image)}&store=${encodeURIComponent(store)}`;

  return <><Card className="bg-deal border-deal-border overflow-hidden hover-lift hover-glow group animate-fade-up h-full flex flex-col">
      <div className="relative overflow-hidden flex-shrink-0">
        <img src={image} alt={title} className="w-full h-40 sm:h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-500" />

        {/* Discount Badge */}
        

        {/* Store Badge */}
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
          <Badge variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white text-xs sm:text-sm">
            {store}
          </Badge>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({
              length: 5
            }).map((_, i) => <Star key={i} className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {rating} ({reviewCount.toLocaleString()})
            </span>
          </div>

          {availability === "In stock" && <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10 text-xs">
              <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
              In Stock
            </Badge>}
        </div>

        <div className="flex items-start justify-between gap-2 mt-3 sm:mt-4">
          <h3 className="font-display font-semibold text-base sm:text-lg text-foreground line-clamp-2 leading-snug h-12 sm:h-14 flex-shrink-0">
            {title}
          </h3>
          <ShareDeal
            title={title}
            price={currentPrice}
            store={store}
            variant="icon"
          />
        </div>

        {/* Key Features - Fixed height */}
        <div className="flex flex-wrap gap-1 mt-2 sm:mt-3 h-8 sm:h-9 flex-shrink-0 overflow-hidden">
          {features.slice(0, 3).map((feature, index) => <Badge key={index} variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted/50 text-muted-foreground h-fit">
              {feature}
            </Badge>)}
        </div>

        {/* Pricing */}
        <div className="mt-3 sm:mt-4 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-price-current font-display">
              {currentPrice}
            </span>
            <span className="text-sm sm:text-lg text-price-original line-through">
              {originalPrice}
            </span>
          </div>

          <div className="text-xs sm:text-sm text-accent font-medium mt-1">
            You save: ₹{(parseInt(originalPrice.replace(/[₹,]/g, "")) - parseInt(currentPrice.replace(/[₹,]/g, ""))).toLocaleString()}
          </div>
        </div>

        {/* Shipping & Warranty Info - Fixed height */}
        <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground h-12 sm:h-14 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
            <span className="truncate">{shipping}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
            <span className="truncate">{warranty}</span>
          </div>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1 min-h-2"></div>

        {/* Action Button - Always at bottom */}
        <div className="mt-auto pt-3 sm:pt-4 flex-shrink-0">
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm sm:text-base py-2 sm:py-2.5"
            onClick={() => setShowDealOverlay(true)}
          >
            <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Compare Prices
          </Button>
        </div>
      </div>
    </Card>
    <SuccessOverlay
      show={showDealOverlay}
      onClose={() => {
        setShowDealOverlay(false);
        navigate(dealUrl);
      }}
      variant="deal"
    />
  </>;
};