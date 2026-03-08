import { useState, useEffect } from "react";
import { ProductData } from "@/utils/ProductSearchService";

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const categoryMap: Record<string, string> = {
  "electronics": "Electronics",
  "jewelery": "Jewelery",
  "men's clothing": "Men's Clothing",
  "women's clothing": "Women's Clothing",
};

export function useFakeStoreProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: FakeStoreProduct[] = await res.json();

        if (cancelled) return;

        const mapped: ProductData[] = data.map((p) => {
          const inrPrice = Math.round(p.price * 83);
          const originalPrice = Math.round(inrPrice * (1 + Math.random() * 0.25));
          const discountPct = Math.round(((originalPrice - inrPrice) / originalPrice) * 100);

          return {
            id: `fakestore-${p.id}`,
            title: p.title,
            price: `₹${inrPrice.toLocaleString("en-IN")}`,
            originalPrice: `₹${originalPrice.toLocaleString("en-IN")}`,
            discount: discountPct > 0 ? `${discountPct}% off` : undefined,
            rating: p.rating.rate.toString(),
            ratingCount: p.rating.count,
            store: "FakeStore",
            category: categoryMap[p.category] || p.category,
            description: p.description,
            image: p.image,
          };
        });

        setProducts(mapped);
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  return { products, isLoading, error };
}
