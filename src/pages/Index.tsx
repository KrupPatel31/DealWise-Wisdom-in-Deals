import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { Features } from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen dark">
      <Header />
      <HeroSection />
      <FeaturedDeals />
      <Features />
    </div>
  );
};

export default Index;
