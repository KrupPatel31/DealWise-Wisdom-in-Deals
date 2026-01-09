export interface ProductData {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image?: string;
  url?: string;
  store?: string;
  rating?: string;
  description?: string;
  category?: string;
}

export class ProductSearchService {
  static searchProducts(products: ProductData[], query: string): ProductData[] {
    if (!query.trim()) return products;

    const lowercaseQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.title?.toLowerCase().includes(lowercaseQuery) ||
        product.description?.toLowerCase().includes(lowercaseQuery) ||
        product.store?.toLowerCase().includes(lowercaseQuery) ||
        product.category?.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Minimal fallback mock products (API is primary source)
  static getMockProducts(): ProductData[] {
    return [
      {
        id: "1",
        title: "iPhone 15 Pro Max 256GB",
        price: "₹1,34,900",
        originalPrice: "₹1,59,900",
        discount: "16% off",
        rating: "4.8",
        store: "Amazon",
        category: "Electronics",
        description: "Latest iPhone with A17 Pro chip",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
      },
      {
        id: "2",
        title: "Samsung Galaxy S24 Ultra 512GB",
        price: "₹1,29,999",
        originalPrice: "₹1,49,999",
        discount: "13% off",
        rating: "4.6",
        store: "Flipkart",
        category: "Electronics",
        description: "Premium Android flagship with S Pen",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
      },
      {
        id: "3",
        title: "Sony WH-1000XM5 Headphones",
        price: "₹26,990",
        originalPrice: "₹34,990",
        discount: "23% off",
        rating: "4.7",
        store: "Amazon",
        category: "Electronics",
        description: "Industry-leading noise cancellation",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      },
      {
        id: "4",
        title: "MacBook Air M3 15-inch",
        price: "₹1,34,900",
        originalPrice: "₹1,44,900",
        discount: "7% off",
        rating: "4.9",
        store: "Apple Store",
        category: "Electronics",
        description: "Supercharged by M3 chip",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      },
      {
        id: "5",
        title: "Nike Air Max 270",
        price: "₹12,995",
        originalPrice: "₹15,995",
        discount: "19% off",
        rating: "4.5",
        store: "Nike",
        category: "Fashion",
        description: "Iconic style with Max Air cushioning",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      },
      {
        id: "6",
        title: "Dyson V15 Detect Vacuum",
        price: "₹62,900",
        originalPrice: "₹69,900",
        discount: "10% off",
        rating: "4.6",
        store: "Dyson",
        category: "Home",
        description: "Laser reveals hidden dust",
        image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400",
      },
      {
        id: "7",
        title: "LG 55-inch OLED TV C3",
        price: "₹1,19,990",
        originalPrice: "₹1,54,990",
        discount: "23% off",
        rating: "4.8",
        store: "Flipkart",
        category: "Electronics",
        description: "Perfect blacks and infinite contrast",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      },
      {
        id: "8",
        title: "Kindle Paperwhite 11th Gen",
        price: "₹13,999",
        originalPrice: "₹16,999",
        discount: "18% off",
        rating: "4.7",
        store: "Amazon",
        category: "Electronics",
        description: "6.8-inch display with warm light",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      },
    ];
  }
}
