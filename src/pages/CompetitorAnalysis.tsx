import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CompetitorAnalysis = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Competitor Analysis</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze competitor websites and pricing strategies to stay ahead in the market.
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Website Scraper
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our advanced web scraping capabilities allow you to extract product data, 
              pricing information, and market insights from competitor websites.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Features:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Real-time price monitoring</li>
                <li>Product catalog analysis</li>
                <li>Inventory tracking</li>
                <li>Promotional campaign detection</li>
              </ul>
            </div>
            
            <div className="pt-4">
              <Link to="/search">
                <Button className="w-full">
                  Try Product Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CompetitorAnalysis;