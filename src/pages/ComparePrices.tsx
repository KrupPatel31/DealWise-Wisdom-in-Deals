import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ExternalLink,
  Truck,
  Shield,
  CreditCard,
  Percent,
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Clock,
  Award,
  CheckCircle2,
  TrendingDown,
  Building2,
  Wallet,
  Calculator
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface StorePrice {
  store: string;
  price: number;
  originalPrice: number;
  discount: number;
  shipping: string;
  shippingCost: number;
  deliveryDays: string;
  inStock: boolean;
  rating: number;
  link: string;
  highlights: string[];
}

interface EMIOption {
  bank: string;
  tenure: string;
  emiAmount: number;
  interestRate: number;
  processingFee: number;
}

interface CardOffer {
  bank: string;
  cardType: string;
  discount: string;
  maxDiscount: number;
  minPurchase: number;
  code?: string;
}

const ComparePrices = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems, updateQuantity } = useCart();

  const productId = searchParams.get("id") || "";
  const productName = searchParams.get("name") || "Product";
  const productImage = searchParams.get("image") || "";
  const productPrice = parseFloat(searchParams.get("price") || "0");
  const productStore = searchParams.get("store") || "Online Store";

  // Generate store prices (simulated comparison from multiple stores)
  const [storePrices, setStorePrices] = useState<StorePrice[]>([]);
  const [emiOptions, setEmiOptions] = useState<EMIOption[]>([]);
  const [cardOffers, setCardOffers] = useState<CardOffer[]>([]);

  useEffect(() => {
    // Generate comparison data based on product price
    const basePrice = productPrice || 15000;
    
    const stores: StorePrice[] = [
      {
        store: productStore || "Amazon",
        price: basePrice,
        originalPrice: Math.round(basePrice * 1.25),
        discount: 20,
        shipping: "Free Delivery",
        shippingCost: 0,
        deliveryDays: "2-3 days",
        inStock: true,
        rating: 4.5,
        link: "#",
        highlights: ["Prime Delivery", "Easy Returns", "Genuine Product"]
      },
      {
        store: "Flipkart",
        price: Math.round(basePrice * 0.98),
        originalPrice: Math.round(basePrice * 1.3),
        discount: 24,
        shipping: "Free Delivery",
        shippingCost: 0,
        deliveryDays: "2-4 days",
        inStock: true,
        rating: 4.3,
        link: "#",
        highlights: ["SuperCoin Rewards", "No Cost EMI", "Flipkart Assured"]
      },
      {
        store: "Croma",
        price: Math.round(basePrice * 1.02),
        originalPrice: Math.round(basePrice * 1.2),
        discount: 15,
        shipping: "₹99 Delivery",
        shippingCost: 99,
        deliveryDays: "3-5 days",
        inStock: true,
        rating: 4.2,
        link: "#",
        highlights: ["Extended Warranty", "Installation Support", "Exchange Offer"]
      },
      {
        store: "Reliance Digital",
        price: Math.round(basePrice * 1.05),
        originalPrice: Math.round(basePrice * 1.28),
        discount: 18,
        shipping: "Free Delivery",
        shippingCost: 0,
        deliveryDays: "4-6 days",
        inStock: true,
        rating: 4.1,
        link: "#",
        highlights: ["ResQ Extended Warranty", "Store Pickup", "Demo Available"]
      },
      {
        store: "Vijay Sales",
        price: Math.round(basePrice * 1.01),
        originalPrice: Math.round(basePrice * 1.22),
        discount: 17,
        shipping: "₹149 Delivery",
        shippingCost: 149,
        deliveryDays: "3-5 days",
        inStock: false,
        rating: 4.0,
        link: "#",
        highlights: ["Price Match Guarantee", "EMI Options", "Old Product Exchange"]
      },
      {
        store: "Tata CLiQ",
        price: Math.round(basePrice * 0.99),
        originalPrice: Math.round(basePrice * 1.25),
        discount: 21,
        shipping: "Free Delivery",
        shippingCost: 0,
        deliveryDays: "3-4 days",
        inStock: true,
        rating: 4.4,
        link: "#",
        highlights: ["CLiQ Cash", "Genuine Products", "Easy EMI"]
      }
    ];

    // Sort by effective price (price + shipping)
    stores.sort((a, b) => (a.price + a.shippingCost) - (b.price + b.shippingCost));
    setStorePrices(stores);

    // EMI Options
    const emi: EMIOption[] = [
      { bank: "HDFC Bank", tenure: "3 months", emiAmount: Math.round(basePrice / 3), interestRate: 0, processingFee: 0 },
      { bank: "ICICI Bank", tenure: "6 months", emiAmount: Math.round(basePrice / 6), interestRate: 0, processingFee: 199 },
      { bank: "SBI Card", tenure: "9 months", emiAmount: Math.round(basePrice / 9 * 1.02), interestRate: 12, processingFee: 0 },
      { bank: "Axis Bank", tenure: "12 months", emiAmount: Math.round(basePrice / 12 * 1.03), interestRate: 13, processingFee: 299 },
      { bank: "Kotak Bank", tenure: "18 months", emiAmount: Math.round(basePrice / 18 * 1.05), interestRate: 14, processingFee: 0 },
      { bank: "Bajaj Finserv", tenure: "24 months", emiAmount: Math.round(basePrice / 24 * 1.06), interestRate: 15, processingFee: 499 },
    ];
    setEmiOptions(emi);

    // Card Offers
    const offers: CardOffer[] = [
      { bank: "HDFC Bank", cardType: "Credit Card", discount: "10% Instant Discount", maxDiscount: 1500, minPurchase: 5000, code: "HDFC10" },
      { bank: "ICICI Bank", cardType: "Credit/Debit Card", discount: "₹500 Cashback", maxDiscount: 500, minPurchase: 7000 },
      { bank: "SBI Card", cardType: "Credit Card", discount: "5% Cashback", maxDiscount: 750, minPurchase: 3000 },
      { bank: "Axis Bank", cardType: "Credit Card", discount: "10% Off", maxDiscount: 2000, minPurchase: 10000, code: "AXIS10" },
      { bank: "Kotak Bank", cardType: "Debit Card", discount: "₹300 Instant Discount", maxDiscount: 300, minPurchase: 4000 },
      { bank: "Amazon Pay", cardType: "ICICI Credit Card", discount: "5% Cashback", maxDiscount: 1000, minPurchase: 0 },
      { bank: "Flipkart Axis", cardType: "Credit Card", discount: "5% Unlimited Cashback", maxDiscount: 9999, minPurchase: 0 },
      { bank: "RuPay", cardType: "Credit Card", discount: "₹200 Off", maxDiscount: 200, minPurchase: 2000, code: "RUPAY200" },
    ];
    setCardOffers(offers);
  }, [productPrice, productStore]);

  const getCartItemQuantity = (): number => {
    const item = cartItems.find((i) => i.id === productId);
    return item?.quantity || 0;
  };

  const handleAddToCart = (store: StorePrice) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/sign-in");
      return;
    }

    const cartItem = {
      id: productId || `${store.store}-${Date.now()}`,
      name: productName,
      price: store.price,
      originalPrice: store.originalPrice,
      image: productImage,
      store: store.store,
      discount: store.discount,
    };

    addToCart(cartItem);
    toast.success(`Added to cart from ${store.store}!`);
  };

  const handleIncrement = () => {
    if (!user) {
      toast.error("Please sign in first");
      navigate("/sign-in");
      return;
    }
    const currentQty = getCartItemQuantity();
    if (currentQty === 0 && storePrices.length > 0) {
      handleAddToCart(storePrices[0]);
    } else {
      updateQuantity(productId, currentQty + 1);
    }
  };

  const handleDecrement = () => {
    const currentQty = getCartItemQuantity();
    if (currentQty > 0) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  const lowestPrice = storePrices.length > 0 ? Math.min(...storePrices.map(s => s.price + s.shippingCost)) : 0;
  const quantity = getCartItemQuantity();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        {/* Product Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {productImage && (
                <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground line-clamp-2">
                  {productName}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge className="bg-green-100 text-green-700 text-lg px-4 py-1">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Lowest: ₹{lowestPrice.toLocaleString("en-IN")}
                  </Badge>
                  <Badge variant="outline" className="text-lg px-4 py-1">
                    {storePrices.length} Stores Compared
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Compare prices from {storePrices.length} different stores and save up to ₹{(storePrices.length > 0 ? Math.max(...storePrices.map(s => s.originalPrice)) - lowestPrice : 0).toLocaleString("en-IN")}!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price Comparison Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Price Comparison Across Stores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {storePrices.map((store, index) => (
                  <div
                    key={store.store}
                    className={`p-4 rounded-lg border transition-all ${
                      index === 0
                        ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                        : "bg-card hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{store.store}</h3>
                          {index === 0 && (
                            <Badge className="bg-green-500 text-white">
                              <Award className="h-3 w-3 mr-1" />
                              Best Price
                            </Badge>
                          )}
                          {!store.inStock && (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{store.rating}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {store.highlights.map((highlight, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {highlight}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            {store.shipping}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {store.deliveryDays}
                          </span>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-2xl font-bold text-primary">
                            ₹{store.price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{store.originalPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <Badge className="bg-red-100 text-red-700">
                          {store.discount}% OFF
                        </Badge>
                        <p className="text-sm text-green-600 font-medium">
                          Save ₹{(store.originalPrice - store.price).toLocaleString("en-IN")}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            disabled={!store.inStock}
                            onClick={() => handleAddToCart(store)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={store.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Visit Store
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* EMI Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  EMI Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold">Bank</th>
                        <th className="text-left py-3 px-2 font-semibold">Tenure</th>
                        <th className="text-right py-3 px-2 font-semibold">EMI/Month</th>
                        <th className="text-right py-3 px-2 font-semibold">Interest</th>
                        <th className="text-right py-3 px-2 font-semibold">Processing Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emiOptions.map((emi, index) => (
                        <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-2 font-medium">{emi.bank}</td>
                          <td className="py-3 px-2">{emi.tenure}</td>
                          <td className="py-3 px-2 text-right font-semibold text-primary">
                            ₹{emi.emiAmount.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-2 text-right">
                            {emi.interestRate === 0 ? (
                              <Badge className="bg-green-100 text-green-700">No Cost</Badge>
                            ) : (
                              `${emi.interestRate}%`
                            )}
                          </td>
                          <td className="py-3 px-2 text-right">
                            {emi.processingFee === 0 ? "Free" : `₹${emi.processingFee}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card Offers Section */}
          <div className="space-y-6">
            {/* Quick Add to Cart */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Quick Purchase
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Best Price Available</p>
                  <p className="text-3xl font-bold text-primary">
                    ₹{lowestPrice.toLocaleString("en-IN")}
                  </p>
                  {storePrices.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      from {storePrices[0].store}
                    </p>
                  )}
                </div>
                
                <Separator />
                
                {quantity === 0 ? (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => storePrices.length > 0 && handleAddToCart(storePrices[0])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-4 bg-muted rounded-lg p-2">
                    <Button size="icon" variant="outline" onClick={handleDecrement}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-bold min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <Button size="icon" variant="outline" onClick={handleIncrement}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/cart")}
                >
                  View Cart
                </Button>
              </CardContent>
            </Card>

            {/* Bank & Card Offers */}
            <Card>
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
                    className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Wallet className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{offer.bank}</span>
                        </div>
                        <p className="text-sm text-green-600 font-medium">
                          {offer.discount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {offer.cardType} • Max ₹{offer.maxDiscount}
                        </p>
                        {offer.minPurchase > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Min. purchase ₹{offer.minPurchase.toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                      {offer.code && (
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {offer.code}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">100% Genuine Products</p>
                    <p className="text-xs text-muted-foreground">All products are verified</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Fast Delivery</p>
                    <p className="text-xs text-muted-foreground">Delivered within 2-5 days</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Percent className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-sm">Best Price Guarantee</p>
                    <p className="text-xs text-muted-foreground">We compare all major stores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComparePrices;
