import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const removeItem = (id: string) => {
    removeFromCart(id);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );


  if (!user) {
    return (
      <div className="min-h-screen dark">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Sign in to view your cart
            </h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your saved items and checkout.
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

  return (
    <div className="min-h-screen dark">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to add items to your cart
            </p>
            <Link to="/search">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="border-border bg-card/50 backdrop-blur-sm"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-lg self-center"
                      />

                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base">
                            {item.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.store}
                          </Badge>
                          <Badge variant="destructive" className="text-xs">
                            {item.discount}% OFF
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base sm:text-lg font-bold text-foreground">
                              ₹{item.price.toLocaleString()}
                            </span>
                            <span className="text-xs sm:text-sm text-muted-foreground line-through">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-foreground">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-border bg-card/50 backdrop-blur-sm sticky top-6">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <span className="text-green-600">Free</span>
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  <Link to="/checkout" className="w-full">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <div className="text-center">
                    <Link
                      to="/search"
                      className="text-primary hover:text-primary/80 text-sm transition-colors"
                    >
                      Continue Shopping
                    </Link>
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

export default Cart;
