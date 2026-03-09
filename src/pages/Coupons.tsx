import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
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
import { supabase } from "@/integrations/supabase/client";

interface Coupon {
  id: string;
  code: string;
  store: string;
  description: string;
  category: string;
  min_purchase: number;
  max_discount: number | null;
  expires_at: string;
  verified: boolean;
  used_count: number;
  coupon_type: "percentage" | "flat" | "cashback" | "freeShipping";
  discount_type: "percentage" | "fixed" | "none";
  discount_value: number;
}

const getTypeIcon = (type: Coupon["coupon_type"]) => {
  switch (type) {
    case "percentage":
      return <Percent className="h-4 w-4" />;
    case "flat":
      return <Tag className="h-4 w-4" />;
    case "cashback":
      return <Gift className="h-4 w-4" />;
    case "freeShipping":
      return <ExternalLink className="h-4 w-4" />;
  }
};

const getTypeColor = (type: Coupon["coupon_type"]) => {
  switch (type) {
    case "percentage":
      return "bg-secondary text-secondary-foreground border-border";
    case "flat":
      return "bg-secondary text-secondary-foreground border-border";
    case "cashback":
      return "bg-secondary text-secondary-foreground border-border";
    case "freeShipping":
      return "bg-secondary text-secondary-foreground border-border";
  }
};

const getDaysRemaining = (expiresAt: string) => {
  const now = new Date();
  const exp = new Date(expiresAt);
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const getDiscountLabel = (coupon: Coupon) => {
  if (coupon.coupon_type === "freeShipping") return "Free Shipping";
  if (coupon.discount_type === "percentage") return `${coupon.discount_value}% Off`;
  if (coupon.discount_type === "fixed") return `₹${coupon.discount_value.toLocaleString()} Off`;
  return "Offer";
};

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadCoupons = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("coupons" as any)
        .select("*")
        .order("expires_at", { ascending: true });

      if (error) {
        toast.error("Failed to load coupons");
      } else {
        setCoupons((data || []) as Coupon[]);
      }
      setIsLoading(false);
    };

    loadCoupons();
  }, []);

  const stores = useMemo(() => [...new Set(coupons.map((c) => c.store))], [coupons]);
  const categories = useMemo(() => [...new Set(coupons.map((c) => c.category))], [coupons]);

  const filtered = coupons.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.store.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
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
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2">
            <Ticket className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Coupon & Promo Codes</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">All coupons listed here are now valid at checkout</p>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search coupons, stores..." className="pl-10" />
            </div>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <p className="text-sm text-muted-foreground mb-4">Showing {filtered.length} coupon{filtered.length !== 1 ? "s" : ""}</p>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading coupons...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((coupon) => {
              const daysLeft = getDaysRemaining(coupon.expires_at);
              const isExpiringSoon = daysLeft <= 2;
              const isCopied = copiedId === coupon.id;

              return (
                <Card key={coupon.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-lg" />

                  <CardContent className="p-4 pl-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-foreground">{coupon.store}</span>
                          {coupon.verified && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{coupon.description}</p>
                      </div>
                      <Badge className={`shrink-0 ${getTypeColor(coupon.coupon_type)}`}>
                        {getTypeIcon(coupon.coupon_type)}
                        <span className="ml-1">{getDiscountLabel(coupon)}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 border border-dashed border-primary/50 rounded-md px-3 py-2 bg-primary/5 font-mono text-sm font-bold text-primary tracking-wider text-center">
                        {coupon.code}
                      </div>
                      <Button size="sm" variant={isCopied ? "default" : "outline"} onClick={() => handleCopy(coupon)} className="shrink-0">
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="ml-1 hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
                      </Button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        {coupon.min_purchase > 0 && <span>Min: ₹{coupon.min_purchase.toLocaleString()}</span>}
                        {coupon.max_discount !== null && <span>Max: ₹{coupon.max_discount.toLocaleString()}</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className={isExpiringSoon ? "text-destructive font-medium" : ""}>
                          {daysLeft <= 0 ? "Expired" : `${daysLeft}d left`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">Used {coupon.used_count.toLocaleString()} times</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
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
