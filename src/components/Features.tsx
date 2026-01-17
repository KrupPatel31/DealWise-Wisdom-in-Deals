import { Card } from "@/components/ui/card";
import { Globe, TrendingUp, Brain, Shield, Zap, Bell } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "MULTI-PLATFORM",
    description: "Compare prices across 50+ e-commerce platforms in real-time",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "PRICE TRACKING",
    description: "Track price changes and get notified when deals become available",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Brain,
    title: "SMART ANALYSIS",
    description: "AI-powered analysis of payment options and promotional benefits",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "SECURE SHOPPING",
    description: "Verified sellers and secure payment recommendations",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    title: "INSTANT ALERTS",
    description: "Get real-time notifications for price drops on your wishlist",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Bell,
    title: "DEAL NOTIFICATIONS",
    description: "Never miss a deal with personalized alerts and recommendations",
    gradient: "from-indigo-500 to-purple-500",
  },
];

export const Features = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
      {/* Section Header */}
      <div className="text-center space-y-4 sm:space-y-6 mb-10 sm:mb-16 animate-fade-up">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display">
          <span className="text-muted-foreground">WHY CHOOSE</span>{" "}
          <span className="gradient-text">DEALWISE</span>
        </h2>
        <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Powerful features designed to help you save money and shop smarter
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="p-6 sm:p-8 text-center bg-deal border-deal-border hover:border-accent/50 transition-all duration-300 group hover-lift animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
              <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3 font-display">
              {feature.title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};