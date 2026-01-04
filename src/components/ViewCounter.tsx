import { useEffect, useState } from "react";
import { Eye, Users, TrendingUp } from "lucide-react";

export const ViewCounter = () => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Get current count from localStorage
    const storedCount = localStorage.getItem("dealwise_view_count");
    const currentCount = storedCount ? parseInt(storedCount, 10) : 12847;
    
    // Increment and store
    const newCount = currentCount + 1;
    localStorage.setItem("dealwise_view_count", newCount.toString());
    
    // Animate the counter
    setIsAnimating(true);
    let start = 0;
    const end = newCount;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setViewCount(end);
        clearInterval(timer);
        setTimeout(() => setIsAnimating(false), 300);
      } else {
        setViewCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

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
                <span className="text-xs font-medium">+2.4%</span>
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
              <span className="text-accent font-semibold">+127</span> today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
