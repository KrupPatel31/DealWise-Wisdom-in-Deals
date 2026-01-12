import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Star, 
  ExternalLink, 
  ShoppingCart, 
  Truck, 
  CreditCard,
  Percent,
  Tag,
  Shield,
  Clock,
  CheckCircle,
  Gift,
  Banknote
} from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface StorePrice {
  store: string;
  price: number;
  originalPrice: number;
  discount: number;
  inStock: boolean;
  deliveryDays: string;
  shipping: string;
  rating: number;
  link: string;
  offers: string[];
  isOriginalStore?: boolean;
  isLowestPrice?: boolean;
}

interface EMIOption {
  bank: string;
  tenure: string;
  monthlyEMI: number;
  interest: string;
  processingFee: string;
}

interface CardOffer {
  bank: string;
  cardType: string;
  discount: string;
  maxDiscount: string;
  minPurchase: string;
  code?: string;
}

// Simulated store prices for comparison
const generateStorePrices = (basePrice: number, productName: string, originalStore: string): StorePrice[] => {
  // Determine product category based on name/store for relevant store filtering
  const productNameLower = productName.toLowerCase();
  const originalStoreLower = originalStore?.trim().toLowerCase() || "";
  
  // Store configurations with category relevance
  const allStores = [
    { name: "Amazon", variation: 0, deliveryDays: "1-2 days", baseRating: 4.5, categories: ["all"] },
    { name: "Flipkart", variation: -5, deliveryDays: "2-3 days", baseRating: 4.3, categories: ["all"] },
    { name: "Croma", variation: 12, deliveryDays: "2-3 days", baseRating: 4.4, categories: ["electronics", "appliances"] },
    { name: "Reliance Digital", variation: 5, deliveryDays: "3-5 days", baseRating: 4.1, categories: ["electronics", "appliances"] },
    { name: "Tata CLiQ", variation: -2, deliveryDays: "2-4 days", baseRating: 4.2, categories: ["all"] },
    { name: "JioMart", variation: -8, deliveryDays: "1-3 days", baseRating: 4.0, categories: ["all"] },
    { name: "Apple Store", variation: 2, deliveryDays: "1-2 days", baseRating: 4.9, categories: ["apple"] },
    { name: "Samsung Store", variation: 3, deliveryDays: "2-3 days", baseRating: 4.8, categories: ["samsung"] },
    { name: "Xiaomi Store", variation: -6, deliveryDays: "2-3 days", baseRating: 4.6, categories: ["xiaomi", "redmi", "mi"] },
    { name: "Myntra", variation: 8, deliveryDays: "3-4 days", baseRating: 4.2, categories: ["fashion", "clothing"] },
    { name: "Ajio", variation: -3, deliveryDays: "4-5 days", baseRating: 4.0, categories: ["fashion", "clothing"] },
    { name: "Nike", variation: 5, deliveryDays: "3-5 days", baseRating: 4.7, categories: ["nike", "shoes", "sportswear"] },
    { name: "Dyson", variation: 0, deliveryDays: "2-4 days", baseRating: 4.8, categories: ["dyson", "appliances"] },
    { name: "Vijay Sales", variation: -4, deliveryDays: "2-3 days", baseRating: 4.3, categories: ["electronics", "appliances"] },
  ];

  // Detect product category
  const isElectronics = /iphone|samsung|galaxy|phone|laptop|macbook|tv|headphone|watch|tablet|ipad/i.test(productName);
  const isFashion = /shoe|sneaker|clothing|shirt|dress|jacket|jeans/i.test(productName);
  const isApple = /iphone|ipad|macbook|apple|airpod/i.test(productName);
  const isSamsung = /samsung|galaxy/i.test(productName);
  const isXiaomi = /xiaomi|redmi|poco|mi /i.test(productName);
  const isNike = /nike/i.test(productName);
  const isDyson = /dyson/i.test(productName);

  // Filter stores based on product category
  let relevantStores = allStores.filter(store => {
    const storeLower = store.name.toLowerCase();
    if (store.categories.includes("all")) return true;
    if (isApple && store.categories.includes("apple")) return true;
    if (isSamsung && store.categories.includes("samsung")) return true;
    if (isXiaomi && store.categories.some(c => ["xiaomi", "redmi", "mi"].includes(c))) return true;
    if (isNike && store.categories.includes("nike")) return true;
    if (isDyson && store.categories.includes("dyson")) return true;
    if (isElectronics && store.categories.includes("electronics")) return true;
    if (isFashion && store.categories.includes("fashion")) return true;
    return false;
  });

  // Ensure original store is included
  const storeExists = relevantStores.some(s => s.name.toLowerCase() === originalStoreLower);
  if (originalStore && !storeExists) {
    relevantStores.push({
      name: originalStore,
      variation: 0,
      deliveryDays: "1-2 days",
      baseRating: 4.7,
      categories: ["all"]
    });
  }

  // Generate prices for each store
  let storePrices = relevantStores.map(store => {
    const isOriginalStore = store.name.toLowerCase() === originalStoreLower;
    const priceVariation = basePrice * (store.variation / 100);
    const storePrice = Math.round(basePrice + priceVariation);
    const originalPrice = Math.round(storePrice * 1.25);
    const discount = Math.round(((originalPrice - storePrice) / originalPrice) * 100);
    
    const offers: string[] = [];
    if (isOriginalStore) {
      offers.push("Official Store - Genuine Product");
      offers.push("Manufacturer Warranty");
    }
    if (Math.random() > 0.5) offers.push("No Cost EMI available");
    if (Math.random() > 0.6) offers.push("Extra 5% off with Bank offers");
    if (Math.random() > 0.7) offers.push("Free extended warranty");
    if (discount > 20) offers.push("Limited time deal");
    
    return {
      store: store.name,
      price: storePrice,
      originalPrice,
      discount,
      inStock: isOriginalStore ? true : Math.random() > 0.2,
      deliveryDays: store.deliveryDays,
      shipping: storePrice > 500 ? "Free Shipping" : "₹50 Shipping",
      rating: store.baseRating,
      link: "#",
      offers: offers.length > 0 ? offers : ["Standard delivery"],
      isOriginalStore,
      isLowestPrice: false
    };
  });

  // Sort by price first to find lowest
  storePrices.sort((a, b) => a.price - b.price);
  
  // Give best rating (5.0) to lowest price store
  if (storePrices.length > 0) {
    storePrices[0].rating = 5.0;
    storePrices[0].isLowestPrice = true;
  }

  return storePrices;
};

// EMI options for the product
const generateEMIOptions = (price: number): EMIOption[] => {
  const banks = [
    { name: "HDFC Bank", interestRates: [0, 12, 14] },
    { name: "ICICI Bank", interestRates: [0, 13, 15] },
    { name: "SBI Card", interestRates: [0, 12, 13] },
    { name: "Axis Bank", interestRates: [0, 13, 14] },
    { name: "Kotak Bank", interestRates: [0, 14, 15] },
  ];

  const tenures = [
    { months: 3, label: "3 Months" },
    { months: 6, label: "6 Months" },
    { months: 9, label: "9 Months" },
    { months: 12, label: "12 Months" },
  ];

  return banks.flatMap(bank => 
    tenures.map((tenure, index) => {
      const interestRate = index === 0 ? 0 : bank.interestRates[Math.min(index, 2)];
      const totalAmount = price * (1 + interestRate / 100);
      const monthlyEMI = Math.round(totalAmount / tenure.months);
      
      return {
        bank: bank.name,
        tenure: tenure.label,
        monthlyEMI,
        interest: interestRate === 0 ? "No Cost EMI" : `${interestRate}% p.a.`,
        processingFee: interestRate === 0 ? "₹0" : "₹199-499"
      };
    })
  );
};

// Bank and card offers
const cardOffers: CardOffer[] = [
  { bank: "HDFC Bank", cardType: "Credit Card", discount: "10% Instant", maxDiscount: "₹1,500", minPurchase: "₹5,000", code: "HDFC10" },
  { bank: "ICICI Bank", cardType: "Debit/Credit", discount: "5% Cashback", maxDiscount: "₹500", minPurchase: "₹3,000" },
  { bank: "SBI Card", cardType: "Credit Card", discount: "₹750 Off", maxDiscount: "₹750", minPurchase: "₹7,500", code: "SBI750" },
  { bank: "Axis Bank", cardType: "Credit Card", discount: "7.5% Off", maxDiscount: "₹1,000", minPurchase: "₹4,000", code: "AXIS7" },
  { bank: "Kotak Bank", cardType: "Debit Card", discount: "5% Instant", maxDiscount: "₹300", minPurchase: "₹2,000" },
  { bank: "RBL Bank", cardType: "Credit Card", discount: "10% Off", maxDiscount: "₹2,000", minPurchase: "₹10,000", code: "RBL10" },
  { bank: "Yes Bank", cardType: "Credit Card", discount: "₹500 Off", maxDiscount: "₹500", minPurchase: "₹5,000", code: "YES500" },
  { bank: "AMEX", cardType: "Credit Card", discount: "15% Off", maxDiscount: "₹3,000", minPurchase: "₹15,000" },
];

const ComparePrices = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const productName = searchParams.get("name") || "Product";
  const productPrice = parseInt(searchParams.get("price") || "10000");
  const productImage = searchParams.get("image") || "";
  const productStore = searchParams.get("store") || "";
  
  const [storePrices, setStorePrices] = useState<StorePrice[]>([]);
  const [emiOptions, setEMIOptions] = useState<EMIOption[]>([]);
  const [selectedEMIBank, setSelectedEMIBank] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch prices from different stores
    setIsLoading(true);
    const timer = setTimeout(() => {
      setStorePrices(generateStorePrices(productPrice, productName, productStore));
      setEMIOptions(generateEMIOptions(productPrice));
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [productPrice, productName, productStore]);

  const lowestPrice = storePrices.length > 0 ? storePrices[0] : null;
  const savings = lowestPrice ? lowestPrice.originalPrice - lowestPrice.price : 0;

  const filteredEMI = selectedEMIBank === "all" 
    ? emiOptions.slice(0, 12) 
    : emiOptions.filter(emi => emi.bank === selectedEMIBank);

  const uniqueBanks = [...new Set(emiOptions.map(emi => emi.bank))];

  const handleAddToCart = (storePrice: StorePrice) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/sign-in");
      return;
    }

    addToCart({
      id: `${productName}-${storePrice.store}`.replace(/\s+/g, '-').toLowerCase(),
      name: productName,
      price: storePrice.price,
      originalPrice: storePrice.originalPrice,
      image: productImage,
      store: storePrice.store,
      discount: storePrice.discount
    });
    
    toast.success(`Added to cart from ${storePrice.store}`);
  };

  return (
    <div className="min-h-screen dark">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Link>
        </div>

        {/* Product Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {productImage && (
            <div className="w-full md:w-48 h-48 flex-shrink-0">
              <img 
                src={productImage} 
                alt={productName} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {productName}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.2 (2,456 reviews)</span>
            </div>
            {lowestPrice && (
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  ₹{lowestPrice.price.toLocaleString()}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ₹{lowestPrice.originalPrice.toLocaleString()}
                </span>
                <Badge className="bg-green-500 text-white">
                  {lowestPrice.discount}% OFF
                </Badge>
              </div>
            )}
            {savings > 0 && (
              <p className="text-green-500 mt-2">
                You save ₹{savings.toLocaleString()} with the best deal!
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Store Prices */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Comparison Table */}
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Price Comparison from {storePrices.length} Stores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {storePrices.map((storePrice, index) => (
                    <div 
                      key={storePrice.store}
                      className={`p-4 rounded-lg border ${
                        storePrice.isLowestPrice 
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30" 
                          : storePrice.isOriginalStore 
                            ? "border-green-500 bg-green-500/10" 
                            : "border-border bg-background/50"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{storePrice.store}</h3>
                            {storePrice.isLowestPrice && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                🏆 Lowest Price
                              </Badge>
                            )}
                            {storePrice.isLowestPrice && (
                              <Badge className="bg-yellow-500 text-white text-xs">
                                ⭐ Best Rating (5.0)
                              </Badge>
                            )}
                            {storePrice.isOriginalStore && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Official Store
                              </Badge>
                            )}
                            {!storePrice.inStock && (
                              <Badge variant="destructive" className="text-xs">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {storePrice.rating}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              {storePrice.deliveryDays}
                            </div>
                            <span>•</span>
                            <span className={storePrice.shipping === "Free Shipping" ? "text-green-500" : ""}>
                              {storePrice.shipping}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {storePrice.offers.map((offer, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                <Gift className="h-3 w-3 mr-1" />
                                {offer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-foreground">
                              ₹{storePrice.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground line-through">
                              ₹{storePrice.originalPrice.toLocaleString()}
                            </div>
                            <Badge className="bg-red-500 text-white text-xs mt-1">
                              {storePrice.discount}% OFF
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button 
                              size="sm"
                              disabled={!storePrice.inStock}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                              onClick={() => handleAddToCart(storePrice)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add to Cart
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Visit Store
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* EMI Options */}
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    EMI Options
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      size="sm"
                      variant={selectedEMIBank === "all" ? "default" : "outline"}
                      onClick={() => setSelectedEMIBank("all")}
                    >
                      All Banks
                    </Button>
                    {uniqueBanks.map(bank => (
                      <Button
                        key={bank}
                        size="sm"
                        variant={selectedEMIBank === bank ? "default" : "outline"}
                        onClick={() => setSelectedEMIBank(bank)}
                      >
                        {bank}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEMI.map((emi, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{emi.bank}</span>
                          {emi.interest === "No Cost EMI" && (
                            <Badge className="bg-green-500 text-white text-xs">
                              No Cost
                            </Badge>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-primary mb-1">
                          ₹{emi.monthlyEMI.toLocaleString()}/mo
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {emi.tenure}
                          </div>
                          <div className="flex items-center gap-1">
                            <Percent className="h-3 w-3" />
                            {emi.interest}
                          </div>
                          <div className="flex items-center gap-1">
                            <Banknote className="h-3 w-3" />
                            Processing: {emi.processingFee}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Bank Offers */}
            <div className="space-y-6">
              {/* Bank & Card Offers */}
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Bank & Card Offers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cardOffers.map((offer, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg border border-border bg-background/50"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <span className="font-medium text-sm">{offer.bank}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {offer.cardType}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-500 mb-1">
                        {offer.discount}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div>Max discount: {offer.maxDiscount}</div>
                        <div>Min purchase: {offer.minPurchase}</div>
                        {offer.code && (
                          <div className="flex items-center gap-1 mt-1">
                            <Tag className="h-3 w-3" />
                            Code: <span className="font-mono bg-muted px-1 rounded">{offer.code}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Why Compare */}
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    Why Compare with DealWise?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Real-time prices from 50+ stores</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Verified seller ratings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>All bank offers at one place</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>No Cost EMI calculator</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Price history tracking</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ComparePrices;
