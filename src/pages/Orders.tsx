import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Package, ShoppingBag, Truck, CheckCircle, Clock, ArrowLeft, Shield } from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  placed: { icon: Clock, color: "bg-yellow-500", label: "Order Placed" },
  processing: { icon: Package, color: "bg-blue-500", label: "Processing" },
  shipped: { icon: Truck, color: "bg-purple-500", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "bg-green-500", label: "Delivered" },
};

const Orders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Type cast the JSONB fields
      const typedOrders = (data || []).map((order: any) => ({
        ...order,
        shipping_address: order.shipping_address as ShippingAddress,
        items: order.items as OrderItem[],
      }));

      setOrders(typedOrders);
    } catch (error: any) {
      toast({
        title: "Error loading orders",
        description: error.message,
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
              Please sign in to view your orders.
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
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ShoppingBag className="h-8 w-8" />
            My Orders
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your orders
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border bg-card/50 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-1/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here!
              </p>
              <Link to="/search">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.placed;
              const StatusIcon = status.icon;

              return (
                <Card key={order.id} className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg text-foreground">
                          Order #{order.order_number}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Placed on {format(new Date(order.created_at), "MMM dd, yyyy 'at' hh:mm a")}
                        </p>
                      </div>
                      <Badge className={`${status.color} text-white flex items-center gap-1 w-fit`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground line-clamp-1">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-medium text-primary">₹{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Shipping Address */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Shipping Address</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{order.shipping_address.fullName}</p>
                          <p>{order.shipping_address.address}</p>
                          <p>
                            {order.shipping_address.city}, {order.shipping_address.state}{" "}
                            {order.shipping_address.zipCode}
                          </p>
                          <p>{order.shipping_address.phone}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-2">Order Summary</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>₹{order.subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Shipping</span>
                            <span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
                          </div>
                          <div className="flex justify-between font-medium text-foreground pt-1 border-t border-border">
                            <span>Total</span>
                            <span>₹{order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Order Notes</h4>
                          <p className="text-sm text-muted-foreground">{order.notes}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
