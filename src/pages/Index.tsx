import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DealOfTheDay } from "@/components/DealOfTheDay";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen dark">
      <SEO
        title="DealWise — Smart Deals & Price Comparison in India"
        description="Compare prices across Amazon, Flipkart, Myntra and more. Track deals, scan barcodes, and earn Deal Coins rewards on every purchase."
        path="/"
      />
      <Header />
      <HeroSection />
      <DealOfTheDay />
      <FeaturedDeals />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
