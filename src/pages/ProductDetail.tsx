import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ShoppingCart, BarChart3, ArrowLeft, Tag, Plus, Minus } from "lucide-react";
import { GalaxyButton } from "@/components/ui/galaxy-button";
import { ProductData, ProductSearchService } from "@/utils/ProductSearchService";
import { useFakeStoreProducts } from "@/hooks/useFakeStoreProducts";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { products: fakeStoreProducts, isLoading } = useFakeStoreProducts();
  const [product, setProduct] = useState<ProductData | null>(null);

  useEffect(() => {
    if (!id) return;
    const mockProducts = ProductSearchService.getMockProducts();
    const allProducts = [...mockProducts, ...fakeStoreProducts];
    const found = allProducts.find((p) => p.id === id);
    if (found) setProduct(found);
  }, [id, fakeStoreProducts]);

  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[₹,]/g, "")) || 0;
  };

  const parseDiscount = (d?: string) => {
    if (!d) return 0;
    const m = d.match(/(\d+)/);
    return m ? parseInt(m[1]) : 0;
  };

  const getCartQty = () => cartItems.find((i) => i.id === id)?.quantity || 0;

  const handleAddToCart = () => {
    if (!user) { toast.error("Please sign in"); navigate("/sign-in"); return; }
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.title,
      price: parsePrice(product.price),
      originalPrice: parsePrice(product.originalPrice || product.price),
      image: product.image || "",
      store: product.store || "Unknown",
      discount: parseDiscount(product.discount),
    });
    toast.success(`${product.title} added to cart!`);
  };

  const qty = getCartQty();

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/search")}>Back to Search</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain p-4"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"; }}
                />
              </div>

              {/* Details */}
              <div className="space-y-4">
                {product.category && (
                  <Badge variant="secondary">{product.category}</Badge>
                )}
                <h1 className="text-2xl font-bold text-foreground">{product.title}</h1>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-primary">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                  {product.discount && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <Tag className="h-3 w-3 mr-1" /> {product.discount}
                    </Badge>
                  )}
                </div>

                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(parseFloat(product.rating!))
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{product.rating}/5</span>
                    {(product as any).ratingCount && (
                      <span className="text-sm text-muted-foreground">
                        ({(product as any).ratingCount} reviews)
                      </span>
                    )}
                  </div>
                )}

                {product.store && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Sold by {product.store}</span>
                  </div>
                )}

                {product.description && (
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                )}

                <div className="flex gap-3 pt-4 flex-wrap">
                  <Link
                    to={`/compare-prices?name=${encodeURIComponent(product.title)}&price=${parsePrice(product.price)}&image=${encodeURIComponent(product.image || "")}&store=${encodeURIComponent(product.store || "")}`}
                  >
                    <Button size="lg">
                      <BarChart3 className="h-4 w-4 mr-2" /> Compare Prices
                    </Button>
                  </Link>

                  {qty === 0 ? (
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-primary-foreground border-0" onClick={handleAddToCart}>
                      <Plus className="h-4 w-4 mr-2" /> Add to Cart
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1 bg-emerald-600 rounded-md">
                      <Button size="sm" variant="ghost" className="h-10 w-10 p-0 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => updateQuantity(product.id, qty - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-primary-foreground font-bold min-w-[28px] text-center">{qty}</span>
                      <Button size="sm" variant="ghost" className="h-10 w-10 p-0 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => updateQuantity(product.id, qty + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
