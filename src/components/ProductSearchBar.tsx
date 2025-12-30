import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, SortAsc, Star, ShoppingCart, Tag, Plus } from "lucide-react";
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
import { toast } from "sonner";

export const ProductSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const parsePrice = (priceStr: string): number => {
    const numStr = priceStr.replace(/[₹,]/g, "");
    return parseFloat(numStr) || 0;
  };

  const parseDiscount = (discountStr?: string): number => {
    if (!discountStr) return 0;
    const match = discountStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
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

  useEffect(() => {
    // Load mock products for demo
    const mockProducts = ProductSearchService.getMockProducts();
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedCategory, sortBy, products]);

  const handleSearch = () => {
    setIsLoading(true);

    let filtered = ProductSearchService.searchProducts(products, searchQuery);

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "rating":
        filtered.sort(
          (a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0")
        );
        break;
      case "discount":
        filtered.sort(
          (a, b) => parseDiscount(b.discount) - parseDiscount(a.discount)
        );
        break;
      default:
        // relevance - keep original order
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

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Find Best Deals</h1>
        <p className="text-muted-foreground">
          Compare prices across multiple stores and find the best deals
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands, or categories..."
              className="pl-12 h-12 text-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
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

            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
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
        <p className="text-muted-foreground">
          {isLoading
            ? "Searching..."
            : `Showing ${filteredProducts.length} products`}
        </p>
        {searchQuery && (
          <Button
            variant="ghost"
            onClick={() => setSearchQuery("")}
            className="text-sm"
          >
            Clear search
          </Button>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="hover:shadow-lg transition-all duration-300 group"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Product Image */}
                {product.image && (
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold line-clamp-2 text-sm leading-tight">
                    {product.title}
                  </h3>

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
                      className="text-xs bg-green-100 text-green-700"
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
                      <span className="text-xs text-muted-foreground">/5</span>
                    </div>
                  )}

                  {/* Store */}
                  {product.store && (
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {product.store}
                      </span>
                    </div>
                  )}

                  {/* Category */}
                  {product.category && (
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  )}

                  {/* Description */}
                  {product.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1" size="sm">
                    Compare Prices
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleAddToCart(product)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
};
