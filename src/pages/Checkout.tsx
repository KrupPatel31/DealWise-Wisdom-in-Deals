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
  ArrowLeft,
  FileText,
  PartyPopper
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
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

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  
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
  const total = subtotal + shipping - discountAmount;

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
      const { data, error } = await supabase.functions.invoke('validate-order', {
        body: {
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
          discountCode: discountApplied ? discountCode : null,
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
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        status: 'placed',
        notes: orderNotes,
        created_at: new Date().toISOString()
      };

      setCompletedOrder(orderData);
      await clearCart();
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
                  <div className="flex gap-2">
                    <Input
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.slice(0, 20))}
                      placeholder="Enter code"
                      disabled={discountApplied}
                      maxLength={20}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyDiscount}
                      disabled={discountApplied || !discountCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                  {discountApplied && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Code applied!
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
