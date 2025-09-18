import { Header } from "@/components/Header";
import { DealCard } from "@/components/DealCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star } from "lucide-react";

const demoDeals = [
  {
    image: "https://static.wixstatic.com/media/c3da52_74e7d6a15eb34e1a8e94453561a1b02e~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_74e7d6a15eb34e1a8e94453561a1b02e~mv2.png",
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    currentPrice: "₹24,883",
    originalPrice: "₹29,224",
    discount: "15% OFF",
    store: "Amazon",
    description: "Limited-time offer: 15% off + free 2-day shipping for Prime members."
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_03fefc6d3d3e4bd5a61675ae4158ca3b~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_03fefc6d3d3e4bd5a61675ae4158ca3b~mv2.png",
    title: "Apple MacBook Air M2 (2022)",
    currentPrice: "₹83,417",
    originalPrice: "₹1,00,117",
    discount: "17% OFF",
    store: "Best Buy",
    description: "Save $200 instantly. Student discount available."
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_63a7ad9e8f93492bbf58a26cdce2ae7c~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_63a7ad9e8f93492bbf58a26cdce2ae7c~mv2.png",
    title: "Nintendo Switch OLED Model",
    currentPrice: "₹26,637",
    originalPrice: "₹29,142",
    discount: "9% OFF",
    store: "Walmart",
    description: "Bundle deal: Includes Mario Kart 8 Deluxe (digital code)."
  }
];

const Demo = () => {
  return (
    <div className="min-h-screen dark">
      <Header />
      
      <main className="container mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-20">
          <Badge className="bg-accent text-accent-foreground text-lg px-6 py-2">
            LIVE DEMO
          </Badge>
          <h1 className="text-5xl font-bold">
            <span className="text-primary">EXPERIENCE</span>{" "}
            <span className="hero-gradient">DEALWISE</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Try our platform with real-time price comparison and deal discovery
          </p>
        </div>

        {/* Demo Search Section */}
        <Card className="p-8 bg-deal border-deal-border mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            <span className="text-primary">Search for any product</span>
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Search for products... (e.g., iPhone 15, AirPods Pro)"
                  className="pl-10 h-12 bg-background border-border"
                />
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8">
                Search
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                Electronics
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                Gaming
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                Home & Kitchen
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                Fashion
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                Books
              </Badge>
            </div>
          </div>
        </Card>

        {/* Demo Results */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              <span className="text-muted-foreground">DEMO</span>{" "}
              <span className="text-primary">RESULTS</span>
            </h2>
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <select className="bg-background border border-border rounded-md px-3 py-2 text-sm">
                <option>Sort by: Best Deal</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Discount %</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoDeals.map((deal, index) => (
              <DealCard key={index} {...deal} />
            ))}
          </div>
        </div>

        {/* Price Comparison Table */}
        <Card className="p-8 bg-deal border-deal-border mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">
            <span className="text-primary">Price Comparison</span>{" "}
            <span className="text-muted-foreground">- Sony WH-1000XM5</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Store</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Shipping</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Rating</th>
                  <th className="text-left py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 bg-accent/5">
                  <td className="py-4 px-4 font-medium">Amazon</td>
                  <td className="py-4 px-4 text-accent font-bold">₹24,883</td>
                  <td className="py-4 px-4 text-accent">Free</td>
                  <td className="py-4 px-4 text-accent font-bold">₹24,883</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.5</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Button size="sm" className="bg-accent text-accent-foreground">
                      Best Deal
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 font-medium">Best Buy</td>
                  <td className="py-4 px-4">₹26,450</td>
                  <td className="py-4 px-4">₹500</td>
                  <td className="py-4 px-4 font-bold">₹26,950</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.3</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Button size="sm" variant="outline">
                      View Deal
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 font-medium">Walmart</td>
                  <td className="py-4 px-4">₹27,200</td>
                  <td className="py-4 px-4 text-accent">Free</td>
                  <td className="py-4 px-4 font-bold">₹27,200</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.1</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Button size="sm" variant="outline">
                      View Deal
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-accent/20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-primary">Ready to start saving?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of smart shoppers who save money with DealWise every day
          </p>
          <Button className="bg-accent text-accent-foreground px-8 py-3 text-lg hover:bg-accent/90">
            Create Free Account
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default Demo;