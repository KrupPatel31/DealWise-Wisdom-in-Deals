import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  CreditCard, 
  Truck, 
  Tag, 
  ShoppingBag,
  CheckCircle,
  ArrowLeft,
  FileText,
  PartyPopper,
  Smartphone,
  Wallet,
  Building2,
  Clock,
  X,
  Shield,
  Lock,
  Coins
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useDealCoins, COIN_EARN_RATE } from "@/hooks/useDealCoins";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { downloadBill } from "@/utils/billGenerator";

// Text field validation: allow alphanumeric, spaces, and common punctuation
const validateTextField = (value: string, maxLength: number): boolean => {
  if (value.length > maxLength) return false;
  // Allow letters, numbers, spaces, and common punctuation for addresses
  const validPattern = /^[a-zA-Z0-9\s,.\-/'#()]+$/;
  return value.length === 0 || validPattern.test(value);
};

interface CheckoutCoupon {
  id: string;
  code: string;
  coupon_type: "percentage" | "flat" | "cashback" | "freeShipping";
  discount_type: "percentage" | "fixed" | "none";
  discount_value: number;
  min_purchase: number;
  max_discount: number | null;
}

const calculateCouponDiscount = (coupon: CheckoutCoupon, subtotal: number, shipping: number) => {
  if (coupon.coupon_type === "freeShipping") {
    return shipping;
  }

  let discount =
    coupon.discount_type === "percentage"
      ? Math.round(subtotal * (Number(coupon.discount_value) / 100))
      : Number(coupon.discount_value);

  if (coupon.max_discount !== null) {
    discount = Math.min(discount, Number(coupon.max_discount));
  }

  return Math.min(discount, subtotal);
};

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { coins, refetchCoins } = useDealCoins();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<CheckoutCoupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [coinsToUse, setCoinsToUse] = useState(0);
  const [useCoins, setUseCoins] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderNotes, setOrderNotes] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const coinDiscount = useCoins ? Math.min(coinsToUse, coins.balance, subtotal) : 0;
  const total = Math.max(0, subtotal + shipping - discountAmount - coinDiscount);
  const potentialCoinsEarned = Math.floor(total * COIN_EARN_RATE);

  // Handle applying/removing coins
  const handleToggleCoins = () => {
    if (useCoins) {
      setUseCoins(false);
      setCoinsToUse(0);
    } else {
      setUseCoins(true);
      // Default to using all available coins up to subtotal
      setCoinsToUse(Math.min(coins.balance, subtotal));
    }
  };

  const handleCoinsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    // Cap at either user's balance or subtotal
    const maxCoins = Math.min(coins.balance, subtotal);
    setCoinsToUse(Math.min(Math.max(0, numValue), maxCoins));
  };

  // Client-side preview of discount (actual validation happens server-side)
  const handleApplyDiscount = () => {
    const code = discountCode.toUpperCase().trim();
    if (code === "DEALWISE10") {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setDiscountApplied(true);
      toast.success(`Discount applied! You'll save ₹${discount.toLocaleString()}`);
    } else if (code === "FIRST50") {
      setDiscountAmount(50);
      setDiscountApplied(true);
      toast.success("Discount applied! You'll save ₹50");
    } else {
      toast.error("Invalid discount code");
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setDiscountApplied(false);
    setDiscountAmount(0);
    toast.info("Discount code removed");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Field-specific max lengths
    const maxLengths: Record<string, number> = {
      fullName: 100,
      phone: 10,
      addressLine1: 200,
      addressLine2: 200,
      city: 100,
      state: 100,
      pincode: 6,
      landmark: 200,
    };
    
    // For phone and pincode, only allow digits
    if (name === 'phone' || name === 'pincode') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= maxLengths[name]) {
        setShippingAddress(prev => ({ ...prev, [name]: numericValue }));
      }
      return;
    }
    
    // For text fields, validate characters
    if (value.length <= (maxLengths[name] || 200) && validateTextField(value, maxLengths[name] || 200)) {
      setShippingAddress(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const required = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
    for (const field of required) {
      if (!shippingAddress[field as keyof typeof shippingAddress].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Validate field lengths
    if (shippingAddress.fullName.length > 100) {
      toast.error("Name must be less than 100 characters");
      return false;
    }
    if (shippingAddress.addressLine1.length > 200) {
      toast.error("Address must be less than 200 characters");
      return false;
    }
    
    if (!/^\d{10}$/.test(shippingAddress.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    if (!validateForm()) return;

    setIsProcessing(true);
    
    try {
      // Call server-side order validation function
      // Server reads cart items directly from DB for price integrity
      const { data, error } = await supabase.functions.invoke('validate-order', {
        body: {
          discountCode: discountApplied ? discountCode : null,
          coinsToUse: useCoins ? coinDiscount : 0,
          shippingAddress,
          paymentMethod,
          notes: orderNotes,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to place order');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to place order');
      }

      // Coins are handled server-side in the edge function
      setEarnedCoins(data.order.coinsEarned || 0);

      // Store completed order data for invoice
      const orderData = {
        order_number: data.order.orderNumber,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          image: item.image,
          store: item.store,
          discount: item.discount
        })),
        subtotal: data.order.subtotal,
        shipping: data.order.shipping,
        total: data.order.total,
        discount: data.order.discount,
        coinDiscount: data.order.coinDiscount || 0,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        status: 'placed',
        notes: orderNotes,
        created_at: new Date().toISOString()
      };

      setCompletedOrder(orderData);
      await clearCart();
      await refetchCoins();
      setOrderSuccess(true);
      toast.success("Order placed successfully!");
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen dark">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Sign in to checkout
            </h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to complete your purchase.
            </p>
            <Link to="/sign-in">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Order Success Screen
  if (orderSuccess && completedOrder) {
    return (
      <div className="min-h-screen dark">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PartyPopper className="h-10 w-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-muted-foreground">
                Thank you for your order. Your order number is
              </p>
              <p className="text-xl font-bold text-primary mt-2">
                #{completedOrder.order_number}
              </p>
            </div>

            <Card className="border-border bg-card/50 backdrop-blur-sm mb-6">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="text-foreground">
                    {completedOrder.items.reduce((sum: number, i: any) => sum + i.quantity, 0)} items
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{completedOrder.subtotal.toLocaleString()}</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Discount</span>
                    <span>-₹{completedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                {completedOrder.coinDiscount > 0 && (
                  <div className="flex justify-between text-sm text-amber-500">
                    <span className="flex items-center gap-1">
                      <Coins className="h-3 w-3" /> Deal Coins Used
                    </span>
                    <span>-₹{completedOrder.coinDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={completedOrder.shipping === 0 ? "text-green-500" : "text-foreground"}>
                    {completedOrder.shipping === 0 ? "Free" : `₹${completedOrder.shipping}`}
                  </span>
                </div>
                <Separator className="bg-border" />
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-foreground">Total Paid</span>
                  <span className="text-primary">₹{completedOrder.total.toLocaleString()}</span>
                </div>
                
                {/* Coins earned banner */}
                {earnedCoins > 0 && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Coins className="h-5 w-5" />
                      <span className="font-medium">You earned {earnedCoins} Deal Coins!</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use them on your next order (1 coin = ₹1 off)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={() => downloadBill(completedOrder)}
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                size="lg"
              >
                <FileText className="h-5 w-5 mr-2" />
                Download Invoice / Bill
              </Button>
              
              <div className="flex gap-3">
                <Link to="/orders" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Orders
                  </Button>
                </Link>
                <Link to="/search" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              A confirmation has been sent. You can download your invoice anytime from the Orders page.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen dark">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-6">
              Add items to your cart to proceed with checkout.
            </p>
            <Link to="/search">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Building Name, Street"
                    maxLength={200}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Area, Colony (Optional)"
                    maxLength={200}
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    name="landmark"
                    value={shippingAddress.landmark}
                    onChange={handleInputChange}
                    placeholder="Nearby landmark (Optional)"
                    maxLength={200}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {/* UPI Payment */}
                  <div className={`border rounded-lg transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:bg-muted/50'}`}>
                    <div className="flex items-center space-x-3 p-4 cursor-pointer">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-primary" />
                          <span className="font-medium">UPI Payment</span>
                          <Badge variant="secondary" className="text-xs">Instant</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Pay using any UPI app</p>
                      </Label>
                    </div>
                    {paymentMethod === 'upi' && (
                      <div className="px-4 pb-4 pt-2 border-t border-border/50">
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          {[
                            { name: "Google Pay", icon: "G" },
                            { name: "PhonePe", icon: "P" },
                            { name: "Paytm", icon: "₽" },
                            { name: "BHIM", icon: "B" }
                          ].map((app) => (
                            <button
                              key={app.name}
                              type="button"
                              className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                                {app.icon}
                              </div>
                              <span className="text-xs text-muted-foreground">{app.name}</span>
                            </button>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="upiId" className="text-sm">Or enter UPI ID</Label>
                          <Input
                            id="upiId"
                            placeholder="yourname@upi"
                            className="bg-background"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Credit/Debit Card */}
                  <div className={`border rounded-lg transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:bg-muted/50'}`}>
                    <div className="flex items-center space-x-3 p-4 cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <span className="font-medium">Credit/Debit Card</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Visa, Mastercard, RuPay, Amex</p>
                      </Label>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                        <div className="w-8 h-5 bg-red-500 rounded text-white text-[8px] flex items-center justify-center font-bold">MC</div>
                        <div className="w-8 h-5 bg-green-600 rounded text-white text-[8px] flex items-center justify-center font-bold">RuPay</div>
                      </div>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="px-4 pb-4 pt-2 border-t border-border/50 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber" className="text-sm">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="bg-background"
                            maxLength={19}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="expiry" className="text-sm">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              className="bg-background"
                              maxLength={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv" className="text-sm">CVV</Label>
                            <Input
                              id="cvv"
                              type="password"
                              placeholder="•••"
                              className="bg-background"
                              maxLength={4}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName" className="text-sm">Name on Card</Label>
                          <Input
                            id="cardName"
                            placeholder="JOHN DOE"
                            className="bg-background uppercase"
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                          <Lock className="h-3 w-3" />
                          Your card details are encrypted and secure
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Net Banking */}
                  <div className={`border rounded-lg transition-all ${paymentMethod === 'netbanking' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:bg-muted/50'}`}>
                    <div className="flex items-center space-x-3 p-4 cursor-pointer">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          <span className="font-medium">Net Banking</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">All major Indian banks supported</p>
                      </Label>
                    </div>
                    {paymentMethod === 'netbanking' && (
                      <div className="px-4 pb-4 pt-2 border-t border-border/50">
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {["HDFC", "ICICI", "SBI", "Axis", "Kotak", "Yes Bank"].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              className="p-2 text-sm rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-center"
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select other bank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pnb">Punjab National Bank</SelectItem>
                            <SelectItem value="bob">Bank of Baroda</SelectItem>
                            <SelectItem value="canara">Canara Bank</SelectItem>
                            <SelectItem value="union">Union Bank</SelectItem>
                            <SelectItem value="idbi">IDBI Bank</SelectItem>
                            <SelectItem value="federal">Federal Bank</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* EMI Options */}
                  <div className={`border rounded-lg transition-all ${paymentMethod === 'emi' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:bg-muted/50'}`}>
                    <div className="flex items-center space-x-3 p-4 cursor-pointer">
                      <RadioGroupItem value="emi" id="emi" />
                      <Label htmlFor="emi" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          <span className="font-medium">EMI</span>
                          <Badge className="bg-green-500 text-white text-xs">No Cost EMI Available</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Pay in easy monthly installments</p>
                      </Label>
                    </div>
                    {paymentMethod === 'emi' && (
                      <div className="px-4 pb-4 pt-2 border-t border-border/50 space-y-3">
                        <div className="space-y-2">
                          <Label className="text-sm">Select Bank</Label>
                          <Select>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Choose your bank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hdfc">HDFC Bank</SelectItem>
                              <SelectItem value="icici">ICICI Bank</SelectItem>
                              <SelectItem value="sbi">SBI Card</SelectItem>
                              <SelectItem value="axis">Axis Bank</SelectItem>
                              <SelectItem value="kotak">Kotak Bank</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Select Tenure</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {[3, 6, 9, 12].map((months) => (
                              <button
                                key={months}
                                type="button"
                                className="p-2 text-sm rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-center"
                              >
                                <div className="font-medium">{months} mo</div>
                                <div className="text-xs text-muted-foreground">
                                  ₹{Math.round(total / months).toLocaleString()}/mo
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                            <CheckCircle className="h-4 w-4" />
                            No Cost EMI available on select banks
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Interest will be refunded as cashback
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Wallet */}
                  <div className={`border rounded-lg transition-all ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:bg-muted/50'}`}>
                    <div className="flex items-center space-x-3 p-4 cursor-pointer">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-primary" />
                          <span className="font-medium">Mobile Wallets</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Paytm, Mobikwik, Amazon Pay</p>
                      </Label>
                    </div>
                    {paymentMethod === 'wallet' && (
                      <div className="px-4 pb-4 pt-2 border-t border-border/50">
                        <div className="grid grid-cols-3 gap-2">
                          {["Paytm", "Mobikwik", "Amazon Pay"].map((wallet) => (
                            <button
                              key={wallet}
                              type="button"
                              className="p-3 text-sm rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-center"
                            >
                              {wallet}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery */}
                  <div className={`border rounded-lg transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:bg-muted/50'}`}>
                    <div className="flex items-center space-x-3 p-4 cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Pay when you receive your order</p>
                      </Label>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="px-4 pb-4 pt-2 border-t border-border/50">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                          <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            ⚠️ Extra ₹30 COD handling charges may apply
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </RadioGroup>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>100% Secure Payments • 256-bit SSL Encryption</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Truck className="h-5 w-5 text-primary" />
                  Delivery Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value.slice(0, 500))}
                  placeholder="Add any special instructions for delivery (Optional)"
                  className="min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {orderNotes.length}/500 characters
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-border bg-card/50 backdrop-blur-sm sticky top-6">
              <CardHeader>
                <CardTitle className="text-foreground">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items Preview */}
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-border" />

                {/* Discount Code */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Discount Code
                  </Label>
                  {discountApplied ? (
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-green-600 dark:text-green-400">{discountCode.toUpperCase()}</span>
                        <span className="text-sm text-muted-foreground">applied</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveDiscount}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.slice(0, 20))}
                        placeholder="Enter code"
                        maxLength={20}
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyDiscount}
                        disabled={!discountCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Try: DEALWISE10 or FIRST50</p>
                </div>

                <Separator className="bg-border" />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Total Savings</span>
                    <span>-₹{totalSavings.toLocaleString()}</span>
                  </div>

                  {discountApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {useCoins && coinDiscount > 0 && (
                    <div className="flex justify-between text-amber-500">
                      <span className="flex items-center gap-1">
                        <Coins className="h-3 w-3" /> Deal Coins
                      </span>
                      <span>-₹{coinDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{(500 - subtotal).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>

                <Separator className="bg-border" />

                {/* Deal Coins Section */}
                {coins.balance > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-amber-500" />
                      Deal Coins
                      <Badge variant="secondary" className="bg-amber-500/20 text-amber-500 text-xs">
                        {coins.balance} available
                      </Badge>
                    </Label>
                    {useCoins ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-amber-500" />
                            <span className="text-sm text-amber-500">Using coins</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleToggleCoins}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={coinsToUse}
                            onChange={(e) => handleCoinsChange(e.target.value)}
                            min={0}
                            max={Math.min(coins.balance, subtotal)}
                            className="text-center"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCoinsToUse(Math.min(coins.balance, subtotal))}
                          >
                            Max
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Save ₹{coinDiscount.toLocaleString()} with Deal Coins
                        </p>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleToggleCoins}
                        className="w-full text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
                      >
                        <Coins className="h-4 w-4 mr-2" />
                        Use {coins.balance} coins (₹{coins.balance} off)
                      </Button>
                    )}
                  </div>
                )}

                {/* Coins you'll earn */}
                {potentialCoinsEarned > 0 && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Coins className="h-4 w-4 text-amber-500" />
                      <span className="text-muted-foreground">You'll earn</span>
                      <span className="font-medium text-amber-500">{potentialCoinsEarned} coins</span>
                      <span className="text-muted-foreground">on this order</span>
                    </div>
                  </div>
                )}

                <Separator className="bg-border" />

                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Placing Order..." : "Place Order"}
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
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

export default Checkout;
