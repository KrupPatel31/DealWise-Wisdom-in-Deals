import { Card } from "@/components/ui/card";
import { Globe, TrendingUp, Brain } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "MULTI-PLATFORM",
    description: "Compare prices across multiple e-commerce platforms in real-time"
  },
  {
    icon: TrendingUp,
    title: "PRICE TRACKING",
    description: "Track price changes and get notified when deals become available"
  },
  {
    icon: Brain,
    title: "SMART ANALYSIS",
    description: "Analyze payment options and promotional benefits automatically"
  }
];

export const Features = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 sm:p-8 text-center bg-deal border-deal-border hover:border-accent/50 transition-all duration-300 group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">
              {feature.title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};