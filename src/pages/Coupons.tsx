import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Copy, Check, Tag, Clock, Percent, Gift, ExternalLink, Ticket } from "lucide-react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  store: string;
  description: string;
  discount: string;
  category: string;
  minPurchase?: string;
  maxDiscount?: string;
  expiresAt: string;
  verified: boolean;
  usedCount: number;
  type: "percentage" | "flat" | "cashback" | "freeShipping";
}

const generateCoupons = (): Coupon[] => {
  const now = new Date();
  const future = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  return [
    { id: "1", code: "SAVE10", store: "Amazon", description: "10% off on Electronics", discount: "10% Off", category: "Electronics", minPurchase: "₹2,000", maxDiscount: "₹500", expiresAt: future(5), verified: true, usedCount: 4523, type: "percentage" },
    { id: "2", code: "FLIP200", store: "Flipkart", description: "Flat ₹200 off on Fashion", discount: "₹200 Off", category: "Fashion", minPurchase: "₹999", expiresAt: future(3), verified: true, usedCount: 2891, type: "flat" },
    { id: "3", code: "CROMA15", store: "Croma", description: "15% cashback on Appliances", discount: "15% Cashback", category: "Appliances", minPurchase: "₹5,000", maxDiscount: "₹2,000", expiresAt: future(7), verified: true, usedCount: 1205, type: "cashback" },
    { id: "4", code: "FREESHIP", store: "Myntra", description: "Free shipping on all orders", discount: "Free Shipping", category: "Fashion", expiresAt: future(10), verified: true, usedCount: 8765, type: "freeShipping" },
    { id: "5", code: "JIO500", store: "JioMart", description: "₹500 off on Groceries above ₹2,000", discount: "₹500 Off", category: "Groceries", minPurchase: "₹2,000", expiresAt: future(2), verified: true, usedCount: 3456, type: "flat" },
    { id: "6", code: "AJIO40", store: "Ajio", description: "40% off on select brands", discount: "40% Off", category: "Fashion", maxDiscount: "₹1,500", expiresAt: future(4), verified: true, usedCount: 1678, type: "percentage" },
    { id: "7", code: "TCLIQ25", store: "Tata CLiQ", description: "25% off on Premium brands", discount: "25% Off", category: "Electronics", minPurchase: "₹3,000", maxDiscount: "₹3,000", expiresAt: future(6), verified: false, usedCount: 890, type: "percentage" },
    { id: "8", code: "RD1000", store: "Reliance Digital", description: "₹1,000 off on Laptops", discount: "₹1,000 Off", category: "Electronics", minPurchase: "₹30,000", expiresAt: future(8), verified: true, usedCount: 567, type: "flat" },
    { id: "9", code: "NIKE20", store: "Nike", description: "20% off on new arrivals", discount: "20% Off", category: "Sportswear", maxDiscount: "₹2,000", expiresAt: future(12), verified: true, usedCount: 2345, type: "percentage" },
    { id: "10", code: "VSALES", store: "Vijay Sales", description: "Extra 5% off + No Cost EMI", discount: "5% Off + EMI", category: "Electronics", minPurchase: "₹10,000", expiresAt: future(9), verified: true, usedCount: 432, type: "percentage" },
    { id: "11", code: "SAMSUNG10", store: "Samsung Store", description: "10% off on Galaxy series", discount: "10% Off", category: "Electronics", maxDiscount: "₹5,000", expiresAt: future(15), verified: true, usedCount: 1890, type: "percentage" },
    { id: "12", code: "FIRST50", store: "Amazon", description: "₹50 cashback for new users", discount: "₹50 Cashback", category: "All", expiresAt: future(30), verified: true, usedCount: 12456, type: "cashback" },
    { id: "13", code: "MEGASALE", store: "Flipkart", description: "Up to 70% off on Big Billion Days", discount: "Up to 70% Off", category: "All", expiresAt: future(1), verified: false, usedCount: 45678, type: "percentage" },
    { id: "14", code: "DYSON5K", store: "Dyson", description: "₹5,000 off on Air Purifiers", discount: "₹5,000 Off", category: "Appliances", minPurchase: "₹25,000", expiresAt: future(20), verified: true, usedCount: 234, type: "flat" },
    { id: "15", code: "APPLE2K", store: "Apple Store", description: "₹2,000 off with HDFC Card", discount: "₹2,000 Off", category: "Electronics", minPurchase: "₹50,000", expiresAt: future(14), verified: true, usedCount: 1567, type: "flat" },
  ];
};

const getTypeIcon = (type: Coupon["type"]) => {
  switch (type) {
    case "percentage": return <Percent className="h-4 w-4" />;
    case "flat": return <Tag className="h-4 w-4" />;
    case "cashback": return <Gift className="h-4 w-4" />;
    case "freeShipping": return <ExternalLink className="h-4 w-4" />;
  }
};

const getTypeColor = (type: Coupon["type"]) => {
  switch (type) {
    case "percentage": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "flat": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "cashback": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "freeShipping": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  }
};

const getDaysRemaining = (expiresAt: string) => {
  const now = new Date();
  const exp = new Date(expiresAt);
  const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

const Coupons = () => {
  const [coupons] = useState<Coupon[]>(generateCoupons());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stores = [...new Set(coupons.map(c => c.store))];
  const categories = [...new Set(coupons.map(c => c.category))];

  const filtered = coupons.filter(c => {
    const matchSearch = !searchQuery || c.store.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStore = selectedStore === "all" || c.store === selectedStore;
    const matchCategory = selectedCategory === "all" || c.category === selectedCategory;
    return matchSearch && matchStore && matchCategory;
  });

  const handleCopy = (coupon: Coupon) => {
    navigator.clipboard.writeText(coupon.code);
    setCopiedId(coupon.id);
    toast.success(`Copied "${coupon.code}" to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2">
            <Ticket className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Coupon & Promo Codes</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Save more with verified coupon codes from top stores
          </p>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search coupons, stores..."
                className="pl-10"
              />
            </div>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filtered.length} coupon{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(coupon => {
            const daysLeft = getDaysRemaining(coupon.expiresAt);
            const isExpiringSoon = daysLeft <= 2;
            const isCopied = copiedId === coupon.id;

            return (
              <Card key={coupon.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                {/* Dashed border coupon effect */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-lg" />
                
                <CardContent className="p-4 pl-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-foreground">{coupon.store}</span>
                        {coupon.verified && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-500/20 text-green-400 border-green-500/30">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{coupon.description}</p>
                    </div>
                    <Badge className={`shrink-0 ${getTypeColor(coupon.type)}`}>
                      {getTypeIcon(coupon.type)}
                      <span className="ml-1">{coupon.discount}</span>
                    </Badge>
                  </div>

                  {/* Code + Copy */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 border border-dashed border-primary/50 rounded-md px-3 py-2 bg-primary/5 font-mono text-sm font-bold text-primary tracking-wider text-center">
                      {coupon.code}
                    </div>
                    <Button
                      size="sm"
                      variant={isCopied ? "default" : "outline"}
                      onClick={() => handleCopy(coupon)}
                      className="shrink-0"
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span className="ml-1 hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
                    </Button>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      {coupon.minPurchase && (
                        <span>Min: {coupon.minPurchase}</span>
                      )}
                      {coupon.maxDiscount && (
                        <span>Max: {coupon.maxDiscount}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className={isExpiringSoon ? "text-red-400 font-medium" : ""}>
                        {daysLeft <= 0 ? "Expired" : `${daysLeft}d left`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    Used {coupon.usedCount.toLocaleString()} times
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No coupons found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Coupons;
