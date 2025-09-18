import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService, ProductData } from '@/utils/FirecrawlService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, Star, ShoppingCart } from "lucide-react";
import { Label } from "@/components/ui/label";

export const CompetitorScraper = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(FirecrawlService.getApiKey() || '');
  const [url, setUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);

  const handleSaveApiKey = async () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter your Firecrawl API key",
        variant: "destructive",
      });
      return;
    }

    const isValid = await FirecrawlService.testApiKey(apiKey);
    if (isValid) {
      FirecrawlService.saveApiKey(apiKey);
      toast({
        title: "Success",
        description: "API key saved and verified successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid API key. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setProducts([]);
    setFilteredProducts([]);
    
    try {
      const apiKeyToUse = FirecrawlService.getApiKey();
      if (!apiKeyToUse) {
        toast({
          title: "Error",
          description: "Please set your API key first",
          variant: "destructive",
        });
        return;
      }

      console.log('Starting scrape for competitor site:', url);
      setProgress(50);
      
      const result = await FirecrawlService.scrapeCompetitorSite(url);
      setProgress(100);
      
      if (result.success && result.products) {
        toast({
          title: "Success",
          description: `Scraped ${result.products.length} products successfully`,
        });
        setProducts(result.products);
        setFilteredProducts(result.products);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to scrape website",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error scraping website:', error);
      toast({
        title: "Error",
        description: "Failed to scrape website",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = FirecrawlService.searchProducts(products, query);
    setFilteredProducts(filtered);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* API Key Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Competitor Website Scraper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Firecrawl API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Firecrawl API key"
                className="flex-1"
              />
              <Button onClick={handleSaveApiKey}>
                Save Key
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Get your API key from <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">firecrawl.dev</a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* URL Scraping Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleScrape} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Competitor Website URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://competitor-site.com"
                required
              />
            </div>
            {isLoading && (
              <Progress value={progress} className="w-full" />
            )}
            <Button
              type="submit"
              disabled={isLoading || !FirecrawlService.getApiKey()}
              className="w-full"
            >
              {isLoading ? "Scraping Products..." : "Scrape Competitor Site"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search and Results */}
      {products.length > 0 && (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search scraped products..."
                  className="pl-10"
                />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold line-clamp-2 text-sm">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>

                    {product.discount && (
                      <Badge variant="secondary" className="text-xs">
                        {product.discount}
                      </Badge>
                    )}

                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    )}

                    {product.store && (
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{product.store}</span>
                      </div>
                    )}

                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};