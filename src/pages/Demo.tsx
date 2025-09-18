import { Header } from "@/components/Header";
import { DealCard } from "@/components/DealCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star, TrendingUp, Users, Clock, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";

const demoDeals = [
  {
    image: "https://static.wixstatic.com/media/c3da52_74e7d6a15eb34e1a8e94453561a1b02e~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_74e7d6a15eb34e1a8e94453561a1b02e~mv2.png",
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    currentPrice: "₹24,883",
    originalPrice: "₹29,224",
    discount: "15% OFF",
    store: "Amazon",
    description: "Industry-leading noise canceling with Dual Noise Sensor technology. Perfect for travel and work from home.",
    rating: 4.8,
    reviewCount: 2847,
    features: ["Noise Cancelling", "30Hr Battery", "Quick Charge"],
    shipping: "Free 2-day shipping",
    warranty: "2 year warranty",
    availability: "In stock"
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_03fefc6d3d3e4bd5a61675ae4158ca3b~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_03fefc6d3d3e4bd5a61675ae4158ca3b~mv2.png",
    title: "Apple MacBook Air M2 (2022)",
    currentPrice: "₹83,417",
    originalPrice: "₹1,00,117",
    discount: "17% OFF",
    store: "Best Buy",
    description: "Supercharged by M2 chip. Ultra-thin design with stunning 13.6-inch Liquid Retina display.",
    rating: 4.9,
    reviewCount: 5234,
    features: ["M2 Chip", "13.6\" Display", "8GB RAM"],
    shipping: "Free shipping",
    warranty: "1 year Apple warranty",
    availability: "In stock"
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_63a7ad9e8f93492bbf58a26cdce2ae7c~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_63a7ad9e8f93492bbf58a26cdce2ae7c~mv2.png",
    title: "Nintendo Switch OLED Model",
    currentPrice: "₹26,637",
    originalPrice: "₹29,142",
    discount: "9% OFF",
    store: "Walmart",
    description: "Enhanced gaming with vibrant 7-inch OLED screen and improved audio for tabletop gaming.",
    rating: 4.7,
    reviewCount: 3421,
    features: ["OLED Screen", "64GB Storage", "Enhanced Audio"],
    shipping: "Free shipping",
    warranty: "1 year Nintendo warranty",
    availability: "In stock"
  }
];

const Demo = () => {
  return (
    <div className="min-h-screen dark">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full border border-accent/20">
            <TrendingUp className="h-5 w-5 text-accent animate-float" />
            <span className="text-accent font-semibold text-lg">LIVE DEMO</span>
          </div>
          
          <h1 className="text-6xl font-bold font-display">
            <span className="text-primary">EXPERIENCE</span>{" "}
            <span className="gradient-text">DEALWISE</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Try our platform with real-time price comparison, detailed product analysis, and intelligent deal discovery
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">1M+</div>
              <div className="text-sm text-muted-foreground">Products Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">24/7</div>
              <div className="text-sm text-muted-foreground">Price Monitoring</div>
            </div>
          </div>
        </div>

        {/* Demo Search Section */}
        <Card className="p-8 bg-gradient-to-br from-card/50 to-muted/30 border-deal-border mb-16 backdrop-blur-sm animate-fade-up">
          <h2 className="text-3xl font-bold text-center mb-8 font-display">
            <span className="gradient-text">Search for any product</span>
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Search for products... (e.g., iPhone 15 Pro, AirPods Pro, Gaming Laptop)"
                  className="pl-12 h-14 bg-background/50 border-border text-lg backdrop-blur-sm"
                />
              </div>
              <Button className="bg-gradient-to-r from-accent to-primary text-white hover:from-accent/90 hover:to-primary/90 h-14 px-8 font-medium">
                Search Deals
              </Button>
            </div>
            
            <div className="flex gap-3 flex-wrap justify-center">
              {[
                "Electronics", "Gaming", "Home & Kitchen", "Fashion", "Books", "Sports", "Beauty", "Automotive"
              ].map((category) => (
                <Badge 
                  key={category}
                  variant="outline" 
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors px-4 py-2 text-sm"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Demo Results */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold font-display">
                <span className="text-muted-foreground">DEMO</span>{" "}
                <span className="gradient-text">RESULTS</span>
              </h2>
              <p className="text-muted-foreground">Showing 3 of 1,247 products found</p>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter & Sort
              </Button>
              <select className="bg-background/50 border border-border rounded-md px-4 py-2 text-sm backdrop-blur-sm">
                <option>Best Deal First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Discount</option>
                <option>Best Rated</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoDeals.map((deal, index) => (
              <div key={index} style={{ animationDelay: `${index * 150}ms` }}>
                <DealCard {...deal} />
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Price Comparison */}
        <Card className="p-8 bg-gradient-to-br from-card/50 to-muted/30 border-deal-border mb-16 backdrop-blur-sm animate-fade-up">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4 font-display">
              <span className="gradient-text">Detailed Price Comparison</span>
            </h3>
            <p className="text-lg text-muted-foreground">Sony WH-1000XM5 - All Available Options</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold">Store</th>
                  <th className="text-left py-4 px-4 font-semibold">Price</th>
                  <th className="text-left py-4 px-4 font-semibold">Shipping</th>
                  <th className="text-left py-4 px-4 font-semibold">Total</th>
                  <th className="text-left py-4 px-4 font-semibold">Rating</th>
                  <th className="text-left py-4 px-4 font-semibold">Delivery</th>
                  <th className="text-left py-4 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 bg-accent/5 hover:bg-accent/10 transition-colors">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                      <div>
                        <div className="font-semibold">Amazon</div>
                        <div className="text-xs text-muted-foreground">Prime eligible</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-accent">₹24,883</div>
                      <div className="text-sm text-muted-foreground line-through">₹29,224</div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <Badge className="bg-accent/20 text-accent border-accent/30">Free</Badge>
                  </td>
                  <td className="py-5 px-4">
                    <div className="text-xl font-bold text-accent">₹24,883</div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.8</span>
                      </div>
                      <span className="text-sm text-muted-foreground">(2.8K)</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent" />
                      <span className="text-sm">2 days</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-accent text-accent-foreground font-medium">
                        <Award className="h-3 w-3 mr-1" />
                        Best Deal
                      </Button>
                    </div>
                  </td>
                </tr>
                
                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-bold">B</span>
                      </div>
                      <div>
                        <div className="font-semibold">Best Buy</div>
                        <div className="text-xs text-muted-foreground">Student discount</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="space-y-1">
                      <div className="text-xl font-semibold">₹26,450</div>
                      <div className="text-sm text-muted-foreground line-through">₹30,500</div>
                    </div>
                  </td>
                  <td className="py-5 px-4">₹500</td>
                  <td className="py-5 px-4">
                    <div className="text-lg font-semibold">₹26,950</div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.6</span>
                      </div>
                      <span className="text-sm text-muted-foreground">(1.2K)</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">3-5 days</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <Button size="sm" variant="outline">
                      View Deal
                    </Button>
                  </td>
                </tr>
                
                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-bold">W</span>
                      </div>
                      <div>
                        <div className="font-semibold">Walmart</div>
                        <div className="text-xs text-muted-foreground">Pickup available</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="space-y-1">
                      <div className="text-xl font-semibold">₹27,200</div>
                      <div className="text-sm text-muted-foreground line-through">₹29,500</div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <Badge className="bg-accent/20 text-accent border-accent/30">Free</Badge>
                  </td>
                  <td className="py-5 px-4">
                    <div className="text-lg font-semibold">₹27,200</div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.4</span>
                      </div>
                      <span className="text-sm text-muted-foreground">(892)</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">4-7 days</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <Button size="sm" variant="outline">
                      View Deal
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h4 className="font-semibold text-accent mb-1">Smart Recommendation</h4>
                <p className="text-sm text-muted-foreground">
                  Amazon offers the best value with free Prime shipping and highest rating. 
                  You'll save ₹2,067 compared to Walmart and get faster delivery.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Features showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 text-center glass hover-lift">
            <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Real-time Tracking</h3>
            <p className="text-sm text-muted-foreground">Monitor price changes across all major platforms automatically</p>
          </Card>
          
          <Card className="p-6 text-center glass hover-lift">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Community Reviews</h3>
            <p className="text-sm text-muted-foreground">Access verified reviews and ratings from real customers</p>
          </Card>
          
          <Card className="p-6 text-center glass hover-lift">
            <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Smart Alerts</h3>
            <p className="text-sm text-muted-foreground">Get notified when prices drop or better deals become available</p>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="p-12 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-accent/20 text-center backdrop-blur-sm">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold font-display">
              <span className="gradient-text">Ready to start saving?</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join thousands of smart shoppers who save money with DealWise every day. 
              Start comparing prices and finding the best deals in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/sign-up">
                <Button className="bg-gradient-to-r from-accent to-primary text-white px-8 py-4 text-lg hover:from-accent/90 hover:to-primary/90 shadow-glow font-medium">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Demo;