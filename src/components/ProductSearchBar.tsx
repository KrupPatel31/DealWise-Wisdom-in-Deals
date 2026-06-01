import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Filter,
  SortAsc,
  Star,
  ShoppingCart,
  Tag,
  Plus,
  Minus,
  Loader2,
  BarChart3,
  ScanLine,
  Mic,
  MicOff,
} from "lucide-react";
import { GalaxyButton } from "@/components/ui/galaxy-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProductSearchService,
  ProductData,
} from "@/utils/ProductSearchService";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useFakeStoreProducts } from "@/hooks/useFakeStoreProducts";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ShareDeal } from "@/components/ShareDeal";

export const ProductSearchBar = () => {
  // Restore persisted search state from sessionStorage
  const [searchQuery, setSearchQuery] = useState(
    () => sessionStorage.getItem("search_query") || "",
  );
  const [products, setProducts] = useState<ProductData[]>(() => {
    try {
      const saved = sessionStorage.getItem("search_products");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => sessionStorage.getItem("search_category") || "all",
  );
  const [sortBy, setSortBy] = useState<string>(
    () => sessionStorage.getItem("search_sort") || "relevance",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const hasRestoredSearch = useRef(false);

  const { user } = useAuth();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { products: fakeStoreProducts, isLoading: isFakeStoreLoading } =
    useFakeStoreProducts();
  const navigate = useNavigate();

  // Voice search using Web Speech API
  const toggleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice search is not supported in your browser");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      toast.success(`Heard: "${transcript}"`);
      // Auto-search after voice input
      setTimeout(() => {
        if (transcript.trim().length >= 2) {
          fetchProductsFromApi(transcript);
        }
      }, 300);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === "not-allowed") {
        toast.error(
          "Microphone access denied. Please allow microphone permission.",
        );
      } else {
        toast.error("Voice search failed. Please try again.");
      }
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    toast.info("Listening... Speak the product name");
  };

  const parsePrice = (priceStr: string): number => {
    const numStr = priceStr.replace(/[₹,]/g, "");
    return parseFloat(numStr) || 0;
  };

  const parseDiscount = (discountStr?: string): number => {
    if (!discountStr) return 0;
    const match = discountStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const getCartItemQuantity = (productId: string): number => {
    const item = cartItems.find((i) => i.id === productId);
    return item?.quantity || 0;
  };

  const handleAddToCart = (product: ProductData) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/sign-in");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.title,
      price: parsePrice(product.price),
      originalPrice: parsePrice(product.originalPrice || product.price),
      image: product.image || "",
      store: product.store || "Unknown",
      discount: parseDiscount(product.discount),
    };

    addToCart(cartItem);
    toast.success(`${product.title} added to cart!`);
  };

  const handleIncrement = (product: ProductData) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/sign-in");
      return;
    }

    const currentQty = getCartItemQuantity(product.id);
    if (currentQty === 0) {
      handleAddToCart(product);
    } else {
      updateQuantity(product.id, currentQty + 1);
    }
  };

  const handleDecrement = (productId: string) => {
    const currentQty = getCartItemQuantity(productId);
    if (currentQty > 0) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  // Fetch products from RapidAPI
  const fetchProductsFromApi = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      // Check if user is authenticated
      if (!user) {
        toast.error("Please sign in to search products");
        navigate("/sign-in");
        return;
      }

      setIsSearchingApi(true);
      try {
        // Get the current session to use the user's access token
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token;

        if (!accessToken) {
          toast.error("Session expired. Please sign in again.");
          navigate("/sign-in");
          return;
        }

        const { data, error } = await supabase.functions.invoke(
          "search-products",
          {
            body: { query },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (error) {
          toast.error("Failed to fetch products from API");
          return;
        }

        if (data?.products && data.products.length > 0) {
          const transformedProducts: ProductData[] = data.products.map(
            (p: any) => ({
              id: p.id,
              title: p.name,
              price: `₹${p.price.toLocaleString("en-IN")}`,
              originalPrice:
                p.originalPrice > p.price
                  ? `₹${p.originalPrice.toLocaleString("en-IN")}`
                  : undefined,
              discount: p.discount ? `${p.discount}% off` : undefined,
              rating: p.rating?.toString(),
              store: p.store,
              category: p.category,
              description: p.description,
              image: p.image,
              link: p.link,
              source: p.source,
            }),
          );

          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
          // Persist search results
          sessionStorage.setItem(
            "search_products",
            JSON.stringify(transformedProducts),
          );
          sessionStorage.setItem("search_query", searchQuery);

          const sources = data.sources;
          const sourceInfo = sources
            ? ` (${sources.realTime + sources.googleShopping + sources.offers} from ${Object.values(sources).filter((v: any) => v > 0).length} sources)`
            : "";
          toast.success(
            `Found ${transformedProducts.length} products${sourceInfo}`,
          );
        } else {
          toast.info("No products found, showing local results");
        }
      } catch {
        toast.error("Search failed, showing local results");
      } finally {
        setIsSearchingApi(false);
      }
    },
    [user, navigate],
  );

  // Merge mock + Fake Store products (only if no restored search results)
  useEffect(() => {
    if (hasRestoredSearch.current) return; // Don't overwrite restored search
    const savedProducts = sessionStorage.getItem("search_products");
    if (savedProducts) {
      hasRestoredSearch.current = true;
      return; // Already restored from sessionStorage in useState init
    }
    const mockProducts = ProductSearchService.getMockProducts();
    const merged = [...mockProducts, ...fakeStoreProducts];
    setProducts(merged);
    setFilteredProducts(merged);
  }, [fakeStoreProducts]);

  // Handle search button click
  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      fetchProductsFromApi(searchQuery);
    } else if (searchQuery.trim().length > 0) {
      toast.error("Please enter at least 2 characters to search");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Persist filter/sort selections
  useEffect(() => {
    sessionStorage.setItem("search_category", selectedCategory);
  }, [selectedCategory]);
  useEffect(() => {
    sessionStorage.setItem("search_sort", sortBy);
  }, [sortBy]);

  // Local filtering and sorting
  useEffect(() => {
    handleLocalFilter();
  }, [selectedCategory, sortBy, products]);

  const handleLocalFilter = () => {
    setIsLoading(true);

    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "rating":
        filtered.sort(
          (a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"),
        );
        break;
      case "discount":
        filtered.sort(
          (a, b) => parseDiscount(b.discount) - parseDiscount(a.discount),
        );
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setIsLoading(false);
  };

  const getCategories = () => {
    const categories = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    return categories;
  };

  // Group products by category
  const getProductsByCategory = () => {
    const grouped: Record<string, ProductData[]> = {};
    filteredProducts.forEach((product) => {
      const category = product.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  };

  const productsByCategory = getProductsByCategory();

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-2 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Find Best Deals
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Compare prices across multiple stores
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isListening ? "Listening..." : "Search products..."
                }
                className={`pl-10 sm:pl-12 h-10 sm:h-12 text-base sm:text-lg ${isListening ? "ring-2 ring-red-500/50" : ""}`}
              />
            </div>
            <Button
              variant={isListening ? "destructive" : "outline"}
              onClick={toggleVoiceSearch}
              className="h-10 sm:h-12 px-3"
              title={isListening ? "Stop listening" : "Voice search"}
              aria-label={isListening ? "Stop voice search" : "Start voice search"}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
              <span className="sr-only">{isListening ? "Stop voice search" : "Start voice search"}</span>
            </Button>
            <GalaxyButton
              onClick={handleSearch}
              disabled={isSearchingApi}
              className="h-10 sm:h-12 px-4 sm:px-6"
            >
              {isSearchingApi ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </>
              )}
            </GalaxyButton>
            <Link to="/scan">
              <Button
                variant="outline"
                className="h-10 sm:h-12 px-3"
                title="Scan Barcode"
                aria-label="Scan product barcode"
              >
                <ScanLine className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Scan product barcode</span>
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getCategories().map((category) => (
                    <SelectItem
                      key={category}
                      value={category?.toLowerCase() || ""}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <SortAsc className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="discount">Best Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSearchingApi && <div className="product-loader scale-75" />}
          <p className="text-muted-foreground">
            {isSearchingApi
              ? "Searching live products..."
              : isLoading
                ? "Filtering..."
                : `Showing ${filteredProducts.length} products`}
          </p>
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery("");
              sessionStorage.removeItem("search_query");
              sessionStorage.removeItem("search_products");
              hasRestoredSearch.current = false;
              // Reload default products
              const mockProducts = ProductSearchService.getMockProducts();
              const merged = [...mockProducts, ...fakeStoreProducts];
              setProducts(merged);
              setFilteredProducts(merged);
            }}
            className="text-sm"
          >
            Clear search
          </Button>
        )}
      </div>

      {/* Skeleton Loader */}
      {isFakeStoreLoading && products.length === 0 && (
        <ProductGridSkeleton count={8} />
      )}

      {/* Products by Category */}
      {Object.keys(productsByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(productsByCategory).map(
            ([category, categoryProducts]) => (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {category}
                    </Badge>
                    <span className="text-sm font-normal text-muted-foreground">
                      ({categoryProducts.length} products)
                    </span>
                  </h2>
                </div>

                {/* Category Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => {
                    const quantity = getCartItemQuantity(product.id);

                    return (
                      <Card
                        key={product.id}
                        className="hover:shadow-lg transition-all duration-300 group h-full flex flex-col"
                      >
                        <CardContent className="p-4 flex-1 flex flex-col">
                          <div className="flex flex-col h-full">
                            {/* Product Image */}
                            <Link
                              to={`/product/${encodeURIComponent(product.id)}`}
                            >
                              <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3 cursor-pointer">
                                <img
                                  src={
                                    product.image ||
                                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
                                  }
                                  alt={product.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400";
                                  }}
                                />
                              </div>
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-1">
                                <Link
                                  to={`/product/${encodeURIComponent(product.id)}`}
                                >
                                  <h3 className="font-semibold line-clamp-2 text-sm leading-tight hover:text-primary transition-colors">
                                    {product.title}
                                  </h3>
                                </Link>
                                <ShareDeal
                                  title={product.title}
                                  price={product.price}
                                  store={product.store}
                                  url={`${window.location.origin}/product/${encodeURIComponent(product.id)}`}
                                  variant="icon"
                                />
                              </div>

                              {/* Price */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-lg font-bold text-primary">
                                  {product.price}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {product.originalPrice}
                                  </span>
                                )}
                              </div>

                              {/* Discount Badge */}
                              {product.discount && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {product.discount}
                                </Badge>
                              )}

                              {/* Rating */}
                              {product.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">
                                    {product.rating}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    /5
                                  </span>
                                  {product.ratingCount && (
                                    <span className="text-xs text-muted-foreground">
                                      ({product.ratingCount})
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Store & Source */}
                              <div className="flex items-center gap-2 flex-wrap">
                                {product.store && (
                                  <div className="flex items-center gap-1">
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {product.store}
                                    </span>
                                  </div>
                                )}
                                {(product as any).source && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0"
                                  >
                                    {(product as any).source}
                                  </Badge>
                                )}
                              </div>

                              {/* Description */}
                              {product.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 mt-auto pt-4">
                              <div className="flex gap-2">
                                <Link
                                  to={`/compare-prices?name=${encodeURIComponent(product.title)}&price=${parsePrice(product.price)}&image=${encodeURIComponent(product.image || "")}&store=${encodeURIComponent(product.store || "")}`}
                                  className="flex-1"
                                >
                                  <Button
                                    className="w-full text-xs px-2"
                                    size="sm"
                                  >
                                    <BarChart3 className="h-3 w-3 mr-1" />
                                    Compare
                                  </Button>
                                </Link>
                                <Link
                                  to={`/product/${encodeURIComponent(product.id)}`}
                                  className="flex-1"
                                >
                                  <Button
                                    variant="outline"
                                    className="w-full text-xs px-2"
                                    size="sm"
                                  >
                                    View Details
                                  </Button>
                                </Link>
                              </div>

                              {quantity === 0 ? (
                                <GalaxyButton
                                  className="w-full text-xs px-2 text-sm"
                                  onClick={() => handleAddToCart(product)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add to Cart
                                </GalaxyButton>
                              ) : (
                                <div className="flex items-center justify-center gap-1 bg-emerald-600 rounded-md">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                                    onClick={() => handleDecrement(product.id)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="text-primary-foreground font-bold min-w-[24px] text-center">
                                    {quantity}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                                    onClick={() => handleIncrement(product)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        !isLoading &&
        !isFakeStoreLoading && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )
      )}
    </div>
  );
};
