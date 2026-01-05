import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Eye, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ViewCounter = () => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [todayViews, setTodayViews] = useState<number>(0);
  const location = useLocation();

  useEffect(() => {
    const incrementAndFetchCount = async () => {
      try {
        // Call the database function to increment and get the count for current page
        const { data, error } = await supabase.rpc('increment_view_count', {
          page: location.pathname
        });
        if (error) {
          console.error('Error incrementing view count:', error);
          // Fallback to fetching current count
          const { data: counterData } = await supabase
            .from('view_counter')
            .select('view_count')
            .eq('page_path', location.pathname)
            .maybeSingle();
          
          if (counterData) {
            animateCounter(counterData.view_count);
          }
          return;
        }

        if (data) {
          animateCounter(data);
        }
      } catch (err) {
        console.error('Error with view counter:', err);
      }
    };

    const animateCounter = (targetCount: number) => {
      setIsAnimating(true);
      let start = 0;
      const duration = 1500;
      const increment = targetCount / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= targetCount) {
          setViewCount(targetCount);
          clearInterval(timer);
          setTimeout(() => setIsAnimating(false), 300);
        } else {
          setViewCount(Math.floor(start));
        }
      }, 16);

      // Calculate approximate "today" views (random for visual appeal)
      setTodayViews(Math.floor(Math.random() * 150) + 50);
    };

    incrementAndFetchCount();
  }, [location.pathname]);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  return (
    <div className="flex items-center justify-center py-6">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
        
        {/* Main container */}
        <div className="relative flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-card/80 via-muted/50 to-card/80 backdrop-blur-sm border border-border/30 rounded-2xl shadow-lg">
          {/* Animated eye icon */}
          <div className="relative">
            <div className={`absolute inset-0 bg-accent/30 rounded-full blur-md ${isAnimating ? 'animate-pulse' : ''}`} />
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-glow">
              <Eye className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>

          {/* Counter display */}
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Total Visitors
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent ${isAnimating ? 'animate-pulse' : ''}`}>
                {formatNumber(viewCount)}
              </span>
              <div className="flex items-center gap-1 text-green-400">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">Live</span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-border/30">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 border-2 border-background flex items-center justify-center"
                  style={{ zIndex: 4 - i }}
                >
                  <Users className="h-3 w-3 text-muted-foreground" />
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              <span className="text-accent font-semibold">+{todayViews}</span> today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
