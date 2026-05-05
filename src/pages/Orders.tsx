import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ShoppingBag,
  MapPin,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { downloadBill } from "@/utils/billGenerator";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  store: string;
  discount: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

interface Order {
  id: string;
  order_number: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shipping_address: ShippingAddress;
  payment_method: string;
  status: string;
  notes?: string;
  created_at: string;
}

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const typedOrders: Order[] = (data || []).map((order) => ({
          id: order.id,
          order_number: order.order_number,
          items: order.items as unknown as OrderItem[],
          subtotal: Number(order.subtotal),
          shipping: Number(order.shipping),
          total: Number(order.total),
          shipping_address:
            order.shipping_address as unknown as ShippingAddress,
          payment_method: order.payment_method,
          status: order.status,
          notes: order.notes,
          created_at: order.created_at,
        }));

        setOrders(typedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "processing":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/20 text-purple-500 border-purple-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery";
      case "upi":
        return "UPI Payment";
      case "card":
        return "Credit/Debit Card";
      default:
        return method;
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
              Sign in to view your orders
            </h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your order history.
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
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to place your first order
            </p>
            <Link to="/search">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="border-border bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-4 sm:p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">
                          Order #{order.order_number}
                        </h3>
                        <Badge
                          className={`${getStatusColor(order.status)} capitalize`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          ₹{order.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}{" "}
                          items
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadBill(order)}
                        className="hidden sm:flex"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                    {order.items.slice(0, 4).map((item, index) => (
                      <img
                        key={index}
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-muted-foreground">
                          +{order.items.length - 4}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Expand Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.id ? null : order.id,
                      )
                    }
                    className="w-full"
                  >
                    {expandedOrder === order.id ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        View Details
                      </>
                    )}
                  </Button>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-border space-y-4">
                      {/* All Items */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Items</h4>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.store}
                              </p>
                              <p className="text-sm text-foreground">
                                Qty: {item.quantity} × ₹
                                {item.price.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-foreground">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="bg-border" />

                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Shipping Address
                        </h4>
                        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          <p className="font-medium text-foreground">
                            {order.shipping_address.fullName}
                          </p>
                          <p>{order.shipping_address.addressLine1}</p>
                          {order.shipping_address.addressLine2 && (
                            <p>{order.shipping_address.addressLine2}</p>
                          )}
                          <p>
                            {order.shipping_address.city},{" "}
                            {order.shipping_address.state} -{" "}
                            {order.shipping_address.pincode}
                          </p>
                          <p>Phone: {order.shipping_address.phone}</p>
                          {order.shipping_address.landmark && (
                            <p>Landmark: {order.shipping_address.landmark}</p>
                          )}
                        </div>
                      </div>

                      <Separator className="bg-border" />

                      {/* Payment & Price Summary */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Payment
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {getPaymentMethodLabel(order.payment_method)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Subtotal
                            </span>
                            <span className="text-foreground">
                              ₹{order.subtotal.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Shipping
                            </span>
                            <span
                              className={
                                order.shipping === 0
                                  ? "text-green-600"
                                  : "text-foreground"
                              }
                            >
                              {order.shipping === 0
                                ? "Free"
                                : `₹${order.shipping}`}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium pt-1 border-t border-border">
                            <span className="text-foreground">Total</span>
                            <span className="text-foreground">
                              ₹{order.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {order.notes && (
                        <>
                          <Separator className="bg-border" />
                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              Delivery Notes
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {order.notes}
                            </p>
                          </div>
                        </>
                      )}

                      {/* Download Invoice Button */}
                      <div className="pt-4">
                        <Button
                          onClick={() => downloadBill(order)}
                          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Download Invoice / Bill
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
