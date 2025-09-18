import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompetitorScraper } from "@/components/CompetitorScraper";

const CompetitorAnalysis = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Competitor Analysis</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scrape competitor price comparison websites to analyze their products, 
            pricing strategies, and update your own product database.
          </p>
        </div>
        <CompetitorScraper />
      </main>
      <Footer />
    </div>
  );
};

export default CompetitorAnalysis;