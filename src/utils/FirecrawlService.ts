import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export interface ProductData {
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image?: string;
  url?: string;
  store?: string;
  rating?: string;
  description?: string;
}

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      // A simple test scrape to verify the API key
      const testResponse = await this.firecrawlApp.scrape('https://example.com');
      return testResponse && testResponse.markdown !== undefined;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async scrapeCompetitorSite(url: string): Promise<{ success: boolean; error?: string; products?: ProductData[] }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      console.log('Scraping competitor site:', url);
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const scrapeResponse = await this.firecrawlApp.scrape(url, {
        formats: ['markdown', 'html'],
        onlyMainContent: true,
      });

      if (!scrapeResponse || !scrapeResponse.markdown) {
        console.error('Scrape failed: No content returned');
        return { 
          success: false, 
          error: 'Failed to scrape website - no content returned' 
        };
      }

      // Extract product data from scraped content
      const products = this.extractProductData([scrapeResponse]);
      
      console.log('Scraping successful, extracted products:', products.length);
      return { 
        success: true,
        products
      };
    } catch (error) {
      console.error('Error during scraping:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }

  private static extractProductData(crawlData: any[]): ProductData[] {
    const products: ProductData[] = [];
    
    crawlData.forEach((page) => {
      if (page.markdown) {
        // Extract product information from markdown content
        const lines = page.markdown.split('\n');
        let currentProduct: Partial<ProductData> = {};
        
        lines.forEach((line: string) => {
          // Look for product titles (usually in headings)
          if (line.match(/^#+\s+/)) {
            if (currentProduct.title) {
              products.push(currentProduct as ProductData);
              currentProduct = {};
            }
            currentProduct.title = line.replace(/^#+\s+/, '').trim();
          }
          
          // Look for prices (₹ symbol or price patterns)
          const priceMatch = line.match(/₹[\d,]+|INR\s*[\d,]+|\$[\d,]+|USD\s*[\d,]+/i);
          if (priceMatch) {
            currentProduct.price = priceMatch[0];
          }
          
          // Look for discounts
          const discountMatch = line.match(/(\d+)%\s*off|save\s*(\d+)%/i);
          if (discountMatch) {
            currentProduct.discount = discountMatch[1] || discountMatch[2] + '% off';
          }
          
          // Look for ratings
          const ratingMatch = line.match(/(\d+\.?\d*)\s*\/\s*5|(\d+\.?\d*)\s*stars/i);
          if (ratingMatch) {
            currentProduct.rating = ratingMatch[1] || ratingMatch[2];
          }
        });
        
        // Add the last product if exists
        if (currentProduct.title) {
          products.push(currentProduct as ProductData);
        }
      }
    });
    
    return products.filter(p => p.title && p.price);
  }

  static searchProducts(products: ProductData[], query: string): ProductData[] {
    if (!query.trim()) return products;
    
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.title?.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery) ||
      product.store?.toLowerCase().includes(lowercaseQuery)
    );
  }
}