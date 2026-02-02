import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Flame, ArrowRight, Tag, Star, ShoppingBag, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
interface DailyDeal {
  id: string;
  title: string;
  description: string | null;
  original_price: number;
  deal_price: number;
  discount_percent: number;
  image_url: string | null;
  store: string;
  product_link: string | null;
  category: string | null;
  ends_at: string;
}
interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}
const CountdownTimer = ({
  endTime
}: {
  endTime: string;
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor(difference / (1000 * 60 * 60) % 24),
          minutes: Math.floor(difference / 1000 / 60 % 60),
          seconds: Math.floor(difference / 1000 % 60)
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime]);
  return <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-destructive animate-pulse" />
      <div className="flex gap-1">
        <div className="bg-destructive/20 text-destructive font-bold px-2 py-1 rounded text-sm min-w-[2.5rem] text-center">
          {String(timeLeft.hours).padStart(2, '0')}h
        </div>
        <span className="text-destructive font-bold">:</span>
        <div className="bg-destructive/20 text-destructive font-bold px-2 py-1 rounded text-sm min-w-[2.5rem] text-center">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </div>
        <span className="text-destructive font-bold">:</span>
        <div className="bg-destructive/20 text-destructive font-bold px-2 py-1 rounded text-sm min-w-[2.5rem] text-center">
          {String(timeLeft.seconds).padStart(2, '0')}s
        </div>
      </div>
    </div>;
};

// Mock deals for demonstration
const mockDeals: DailyDeal[] = [{
  id: "1",
  title: "Sony WH-1000XM5 Wireless Headphones",
  description: "Industry-leading noise cancellation with premium sound quality",
  original_price: 34990,
  deal_price: 24990,
  discount_percent: 29,
  image_url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
  store: "Amazon",
  product_link: null,
  category: "Electronics",
  ends_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
}, {
  id: "2",
  title: "Samsung Galaxy Watch 6 Classic",
  description: "Premium smartwatch with rotating bezel and health tracking",
  original_price: 39999,
  deal_price: 27999,
  discount_percent: 30,
  image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
  store: "Flipkart",
  product_link: null,
  category: "Wearables",
  ends_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
}, {
  id: "3",
  title: "Apple MacBook Air M3",
  description: "Supercharged by M3 chip for unbelievable performance",
  original_price: 119900,
  deal_price: 104900,
  discount_percent: 13,
  image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
  store: "Apple Store",
  product_link: null,
  category: "Laptops",
  ends_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
}];
export const DealOfTheDay = () => {
  const [deals, setDeals] = useState<DailyDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('daily_deals').select('*').eq('is_active', true).gt('ends_at', new Date().toISOString()).order('discount_percent', {
          ascending: false
        }).limit(3);
        if (error) throw error;
        if (data && data.length > 0) {
          setDeals(data);
        } else {
          // Use mock deals if no real deals exist
          setDeals(mockDeals);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        setDeals(mockDeals);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, []);
  if (isLoading) {
    return <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-1/2" />
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>;
  }
  return <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Flame className="h-6 w-6 text-destructive animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Deal of the Day
              </h2>
              <p className="text-muted-foreground text-sm">
                Limited time offers • Don't miss out!
              </p>
            </div>
          </div>
          <Link to="/search">
            <Button variant="outline" className="group">
              View All Deals
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, index) => <Card key={deal.id} className={`group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 ${index === 0 ? 'md:col-span-2 lg:col-span-1 ring-2 ring-destructive/20' : ''}`}>
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img src={deal.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400";
            }} />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <Badge className="bg-destructive text-destructive-foreground font-bold">
                    <Zap className="h-3 w-3 mr-1" />
                    {deal.discount_percent}% OFF
                  </Badge>
                  {index === 0 && <Badge className="bg-amber-500 text-white">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Top Deal
                    </Badge>}
                </div>

                {/* Store Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="backdrop-blur-sm bg-transparent">
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    {deal.store}
                  </Badge>
                </div>

                {/* Countdown Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <CountdownTimer endTime={deal.ends_at} />
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4 space-y-3">
                {/* Category */}
                {deal.category && <Badge variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {deal.category}
                  </Badge>}

                {/* Title */}
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {deal.title}
                </h3>

                {/* Description */}
                {deal.description && <p className="text-sm text-muted-foreground line-clamp-2">
                    {deal.description}
                  </p>}

                {/* Price */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-2xl font-bold text-primary">
                    ₹{deal.deal_price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base text-muted-foreground line-through">
                    ₹{deal.original_price.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Savings */}
                <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  You save ₹{(deal.original_price - deal.deal_price).toLocaleString('en-IN')}
                </div>

                {/* CTA */}
                <Link to={`/compare-prices?name=${encodeURIComponent(deal.title)}&price=${deal.deal_price}&image=${encodeURIComponent(deal.image_url || '')}&store=${encodeURIComponent(deal.store)}`} className="block pt-2">
                  <Button className="w-full group/btn">
                    Compare Prices
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};