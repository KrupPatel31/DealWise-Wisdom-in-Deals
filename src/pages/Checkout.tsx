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
  MapPin, 
  CreditCard, 
  Truck, 
  Tag, 
  ShoppingBag,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  
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
  const total = subtotal + shipping - couponDiscount;

  const validCoupons: Record<string, { type: 'percent' | 'fixed'; value: number; minOrder?: number; description: string }> = {
    "DEALWISE10": { type: 'percent', value: 10, description: "10% off on your order" },
    "FIRST50": { type: 'fixed', value: 50, description: "₹50 off" },
    "SAVE100": { type: 'fixed', value: 100, minOrder: 1000, description: "₹100 off on orders above ₹1000" },
    "MEGA20": { type: 'percent', value: 20, minOrder: 2000, description: "20% off on orders above ₹2000" },
    "WELCOME15": { type: 'percent', value: 15, description: "15% off for new users" },
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.toUpperCase().trim();
    
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }
    
    const coupon = validCoupons[code];
    
    if (!coupon) {
      setCouponError("Invalid coupon code. Try DEALWISE10, FIRST50, SAVE100, MEGA20, or WELCOME15");
      toast.error("Invalid coupon code");
      return;
    }
    
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      setCouponError(`Minimum order of ₹${coupon.minOrder} required for this coupon`);
      toast.error(`Minimum order of ₹${coupon.minOrder} required`);
      return;
    }
    
    let discount = 0;
    if (coupon.type === 'percent') {
      discount = Math.round(subtotal * (coupon.value / 100));
    } else {
      discount = coupon.value;
    }
    
    setCouponDiscount(discount);
    setCouponApplied(true);
    toast.success(`Coupon applied! You saved ₹${discount.toLocaleString()}`);
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponError("");
    toast.info("Coupon removed");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
    for (const field of required) {
      if (!shippingAddress[field as keyof typeof shippingAddress].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
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
      const orderNumber = `DW${Date.now().toString().slice(-8)}`;
      
      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        order_number: orderNumber,
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
        subtotal,
        shipping,
        total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        notes: orderNotes,
        status: 'placed'
      });

      if (error) throw error;

      await clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
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
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer mt-3">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <span className="font-medium">UPI Payment</span>
                      <p className="text-sm text-muted-foreground">Pay using Google Pay, PhonePe, Paytm etc.</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer mt-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <span className="font-medium">Credit/Debit Card</span>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                    </Label>
                  </div>
                </RadioGroup>
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
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add any special instructions for delivery (Optional)"
                  className="min-h-[100px]"
                />
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

                {/* Coupon Code */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-semibold">
                    <Tag className="h-4 w-4 text-primary" />
                    Apply Coupon Code
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="Enter coupon code"
                      disabled={couponApplied}
                      className="uppercase"
                    />
                    {couponApplied ? (
                      <Button
                        variant="destructive"
                        onClick={handleRemoveCoupon}
                        size="sm"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                  
                  {couponError && (
                    <p className="text-xs text-red-500">{couponError}</p>
                  )}
                  
                  {couponApplied && (
                    <div className="flex items-center gap-1 text-green-600 text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
                      <CheckCircle className="h-4 w-4" />
                      <span>Coupon applied! Saving ₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">Available coupons:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>DEALWISE10 - 10% off</li>
                      <li>FIRST50 - ₹50 off</li>
                      <li>SAVE100 - ₹100 off (min ₹1000)</li>
                      <li>MEGA20 - 20% off (min ₹2000)</li>
                      <li>WELCOME15 - 15% off</li>
                    </ul>
                  </div>
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

                  {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toLocaleString()}</span>
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
