import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, MapPin, Shield, Truck, ArrowLeft } from "lucide-react";

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { profile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Address form state
  const [address, setAddress] = useState({
    fullName: profile?.full_name || "",
    email: profile?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  // Payment form state
  const [payment, setPayment] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    upiId: "",
    bankName: "",
  });

  // Additional features state
  const [promoCode, setPromoCode] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [orderNotes, setOrderNotes] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const total = subtotal + shipping;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Address validation
    if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!address.email.trim()) newErrors.email = "Email is required";
    if (!address.phone.trim()) newErrors.phone = "Phone number is required";
    if (!address.address.trim()) newErrors.address = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!address.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    // Payment validation based on method
    if (paymentMethod === "credit-card" || paymentMethod === "debit-card") {
      if (!payment.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
      if (!payment.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required";
      if (!payment.cvv.trim()) newErrors.cvv = "CVV is required";
      if (!payment.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required";
    } else if (paymentMethod === "upi") {
      if (!payment.upiId.trim()) newErrors.upiId = "UPI ID is required";
    } else if (paymentMethod === "net-banking") {
      if (!payment.bankName.trim()) newErrors.bankName = "Bank name is required";
    }
    // Cash on delivery doesn't require payment details

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (address.email && !emailRegex.test(address.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone format validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (address.phone && !phoneRegex.test(address.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Card number format (basic validation)
    const cardRegex = /^\d{16}$/;
    if ((paymentMethod === "credit-card" || paymentMethod === "debit-card") && payment.cardNumber && !cardRegex.test(payment.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    // Expiry date format (MM/YY)
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if ((paymentMethod === "credit-card" || paymentMethod === "debit-card") && payment.expiryDate && !expiryRegex.test(payment.expiryDate)) {
      newErrors.expiryDate = "Please enter expiry date in MM/YY format";
    }

    // CVV format
    const cvvRegex = /^\d{3,4}$/;
    if ((paymentMethod === "credit-card" || paymentMethod === "debit-card") && payment.cvv && !cvvRegex.test(payment.cvv)) {
      newErrors.cvv = "Please enter a valid CVV (3-4 digits)";
    }

    // UPI ID format (basic validation)
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (paymentMethod === "upi" && payment.upiId && !upiRegex.test(payment.upiId)) {
      newErrors.upiId = "Please enter a valid UPI ID (e.g., user@bank)";
    }

    if (!acceptTerms) {
      newErrors.terms = "Please accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPayment(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place an order.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Generate order number
      const orderNumber = `DW${Date.now().toString(36).toUpperCase()}`;

      // Prepare order items
      const orderItems = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      }));

      // Save order to database
      const { error: orderError } = await supabase.from("orders").insert({
        user_id: user.id,
        order_number: orderNumber,
        status: "placed",
        subtotal,
        shipping,
        total,
        payment_method: paymentMethod,
        shipping_address: address,
        items: orderItems,
        notes: orderNotes || null,
      });

      if (orderError) throw orderError;

      // Send confirmation email
      try {
        await supabase.functions.invoke("send-order-confirmation", {
          body: {
            orderNumber,
            customerEmail: address.email,
            customerName: address.fullName,
            items: orderItems,
            subtotal,
            shipping,
            total,
            paymentMethod,
            shippingAddress: address,
          },
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the order if email fails
      }

      clearCart();

      toast({
        title: "Order Placed Successfully!",
        description: `Order #${orderNumber} confirmed. Check your email for confirmation.`,
      });

      navigate("/orders");
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen dark">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Authentication Required
            </h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to proceed with checkout.
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
            <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart before proceeding to checkout.
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
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={address.fullName}
                      onChange={(e) => handleAddressChange("fullName", e.target.value)}
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={address.email}
                      onChange={(e) => handleAddressChange("email", e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={(e) => handleAddressChange("phone", e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={address.address}
                    onChange={(e) => handleAddressChange("address", e.target.value)}
                    placeholder="Street address, apartment, etc."
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                      className={errors.state ? "border-destructive" : ""}
                    />
                    {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={address.zipCode}
                      onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                      className={errors.zipCode ? "border-destructive" : ""}
                    />
                    {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="debit-card" id="debit-card" />
                      <Label htmlFor="debit-card">Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="net-banking" id="net-banking" />
                      <Label htmlFor="net-banking">Net Banking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                      <Label htmlFor="cash-on-delivery">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>
                </div>
                {(paymentMethod === "credit-card" || paymentMethod === "debit-card") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        value={payment.cardNumber}
                        onChange={(e) => handlePaymentChange("cardNumber", e.target.value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim())}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={errors.cardNumber ? "border-destructive" : ""}
                      />
                      {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          value={payment.expiryDate}
                          onChange={(e) => handlePaymentChange("expiryDate", e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={errors.expiryDate ? "border-destructive" : ""}
                        />
                        {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          value={payment.cvv}
                          onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                          placeholder="123"
                          maxLength={4}
                          className={errors.cvv ? "border-destructive" : ""}
                        />
                        {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card *</Label>
                        <Input
                          id="nameOnCard"
                          value={payment.nameOnCard}
                          onChange={(e) => handlePaymentChange("nameOnCard", e.target.value)}
                          className={errors.nameOnCard ? "border-destructive" : ""}
                        />
                        {errors.nameOnCard && <p className="text-sm text-destructive">{errors.nameOnCard}</p>}
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === "upi" && (
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID *</Label>
                    <Input
                      id="upiId"
                      value={payment.upiId}
                      onChange={(e) => handlePaymentChange("upiId", e.target.value)}
                      placeholder="user@bank"
                      className={errors.upiId ? "border-destructive" : ""}
                    />
                    {errors.upiId && <p className="text-sm text-destructive">{errors.upiId}</p>}
                  </div>
                )}

                {paymentMethod === "net-banking" && (
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      value={payment.bankName}
                      onChange={(e) => handlePaymentChange("bankName", e.target.value)}
                      placeholder="Enter your bank name"
                      className={errors.bankName ? "border-destructive" : ""}
                    />
                    {errors.bankName && <p className="text-sm text-destructive">{errors.bankName}</p>}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:text-primary/80">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:text-primary/80">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-border bg-card/50 backdrop-blur-sm sticky top-6">
              <CardHeader>
                <CardTitle className="text-foreground">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
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
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.discount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {item.discount}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-border" />

                <div className="space-y-2">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Total Savings</span>
                    <span>-₹{totalSavings.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>

                <div className="text-center">
                  <Link
                    to="/cart"
                    className="text-primary hover:text-primary/80 text-sm transition-colors"
                  >
                    Back to Cart
                  </Link>
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
