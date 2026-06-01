import { useState, useRef, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Search,
  X,
  Star,
  ExternalLink,
  Sparkles,
  Trophy,
  Link as LinkIcon,
  ScanSearch,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";

interface ProductResult {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  store: string;
  category: string;
  image: string;
  link: string;
  similarity: number;
}

interface ProductInfo {
  product_name: string;
  category: string;
  brand: string;
  color: string;
  search_query: string;
  confidence: number;
}

const VisualSearch = () => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  const handleFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be under 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setProducts([]);
      setProductInfo(null);
      setHasSearched(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  const handlePasteUrl = () => {
    if (!imageUrl.trim()) return;
    setPreview(imageUrl.trim());
    setProducts([]);
    setProductInfo(null);
    setHasSearched(false);
  };

  const clearImage = () => {
    setPreview(null);
    setImageUrl("");
    setProducts([]);
    setProductInfo(null);
    setHasSearched(false);
  };

  const searchProducts = async () => {
    if (!preview) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const body: Record<string, string> = {};
      if (preview.startsWith("data:")) {
        body.imageBase64 = preview;
      } else {
        body.imageUrl = preview;
      }

      const { data, error } = await supabase.functions.invoke("visual-search", {
        body,
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      setProductInfo(data.productInfo);
      setProducts(data.products || []);

      if ((data.products || []).length === 0) {
        toast.info("No matching products found. Try a clearer image.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const lowestPrice =
    products.length > 0
      ? Math.min(...products.filter((p) => p.price > 0).map((p) => p.price))
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Visual Search — Find Products by Image | DealWise"
        description="Upload a photo of any product and instantly compare prices across Amazon, Flipkart, Myntra, and more with AI-powered visual search."
        path="/visual-search"
      />
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Visual Search
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Search Products by <span className="gradient-text">Image</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Upload a photo of any product and instantly compare prices across
            Amazon, Flipkart, Myntra, and more.
          </p>
        </div>

        {/* Upload Area */}
        {!preview ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-10 sm:p-16 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
              />
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ScanSearch className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    Drag & drop your product image
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG, WEBP — Max 10 MB
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload from Device
              </Button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
              />
              <Button
                variant="outline"
                className="flex-1 sm:hidden"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>

            {/* Paste URL */}
            <div className="flex gap-2">
              <Input
                placeholder="Or paste an image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasteUrl()}
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={handlePasteUrl}
                disabled={!imageUrl.trim()}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* Preview + Search */
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
              <img
                src={preview}
                alt="Uploaded product"
                className="w-full max-h-80 object-contain bg-black/20"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {productInfo && (
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {productInfo.category}
                </Badge>
                {productInfo.brand !== "Unknown" && (
                  <Badge variant="outline">{productInfo.brand}</Badge>
                )}
                {productInfo.color && (
                  <Badge variant="outline">{productInfo.color}</Badge>
                )}
                <Badge variant="outline">
                  {Math.round(productInfo.confidence * 100)}% confidence
                </Badge>
              </div>
            )}

            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base"
              onClick={searchProducts}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Analyzing & Searching…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find Similar Products
                </span>
              )}
            </Button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && products.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {products.length} Products Found
              </h2>
              {productInfo && (
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Searching for:{" "}
                  <span className="text-foreground font-medium">
                    {productInfo.product_name}
                  </span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => {
                const isBestPrice =
                  product.price > 0 && product.price === lowestPrice;
                const savings = product.originalPrice - product.price;

                return (
                  <Card
                    key={product.id}
                    className={`overflow-hidden hover-lift group transition-all flex flex-col ${
                      isBestPrice ? "ring-2 ring-accent" : "border-border"
                    }`}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden bg-muted/30">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}

                      {/* Similarity badge */}
                      <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground border-0">
                        {product.similarity}% match
                      </Badge>

                      {isBestPrice && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-bold">
                          <Trophy className="h-3 w-3" />
                          Best Price
                        </div>
                      )}

                      <Badge
                        variant="outline"
                        className="absolute bottom-2 left-2 bg-background/70 backdrop-blur-sm border-0 text-xs"
                      >
                        {product.store}
                      </Badge>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4 flex flex-col flex-1">
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">
                          {product.rating.toFixed(1)}{" "}
                          {product.reviews > 0 &&
                            `(${product.reviews.toLocaleString()})`}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm text-foreground line-clamp-2 h-10 mb-3">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-price-current">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-price-original line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {savings > 0 && (
                          <p className="text-xs text-accent font-medium mt-0.5">
                            Save ₹{savings.toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto">
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            className="w-full"
                            variant={isBestPrice ? "default" : "outline"}
                            size="sm"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                            View Deal
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && hasSearched && products.length === 0 && (
          <div className="mt-16 text-center">
            <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No products found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try uploading a clearer image or a different product.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default VisualSearch;
