import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDealCoins } from "@/hooks/useDealCoins";
import { Skeleton } from "@/components/ui/skeleton";

interface DealCoinsDisplayProps {
  showTooltip?: boolean;
  className?: string;
}

export const DealCoinsDisplay = ({
  showTooltip = true,
  className = "",
}: DealCoinsDisplayProps) => {
  const { coins, isLoading } = useDealCoins();

  if (isLoading) {
    return <Skeleton className="h-6 w-16" />;
  }

  const content = (
    <Badge
      variant="secondary"
      className={`flex items-center gap-1.5 bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30 cursor-pointer ${className}`}
    >
      <Coins className="h-3.5 w-3.5" />
      <span className="font-semibold">{coins.balance}</span>
    </Badge>
  );

  if (!showTooltip) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">Deal Coins: {coins.balance}</p>
            <p className="text-muted-foreground text-xs">
              1 coin = ₹1 discount
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
