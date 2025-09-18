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
  // Mock data service - no external dependencies

  static searchProducts(products: ProductData[], query: string): ProductData[] {
    if (!query.trim()) return products;
    
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.title?.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery) ||
      product.store?.toLowerCase().includes(lowercaseQuery) ||
      product.category?.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get mock products for demo
  static getMockProducts(): ProductData[] {
    return [
      {
        id: '1',
        title: 'OnePlus 12R 5G Smartphone',
        price: '₹39,999',
        originalPrice: '₹45,999',
        discount: '13% off',
        rating: '4.5',
        store: 'Amazon',
        category: 'Electronics',
        description: 'Latest OnePlus flagship with Snapdragon 8 Gen 2',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
      },
      {
        id: '2',
        title: 'Prestige Nakshatra Plus Pressure Cooker',
        price: '₹2,499',
        originalPrice: '₹3,499',
        discount: '29% off',
        rating: '4.3',
        store: 'Flipkart',
        category: 'Kitchen',
        description: '5L stainless steel pressure cooker with safety features',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop'
      },
      {
        id: '3',
        title: 'Boat Airdopes 141 Wireless Earbuds',
        price: '₹1,299',
        originalPrice: '₹2,990',
        discount: '57% off',
        rating: '4.1',
        store: 'Myntra',
        category: 'Electronics',
        description: 'True wireless earbuds with 42H playback',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop'
      },
      {
        id: '4',
        title: 'Himalaya Herbals Face Wash',
        price: '₹149',
        originalPrice: '₹175',
        discount: '15% off',
        rating: '4.2',
        store: 'Nykaa',
        category: 'Beauty',
        description: 'Natural face wash with neem and turmeric',
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=300&fit=crop'
      },
      {
        id: '5',
        title: 'Adidas Ultraboost 22 Running Shoes',
        price: '₹8,999',
        originalPrice: '₹16,999',
        discount: '47% off',
        rating: '4.6',
        store: 'Ajio',
        category: 'Fashion',
        description: 'Premium running shoes with Boost technology',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'
      },
      {
        id: '6',
        title: 'Godrej 190L Single Door Refrigerator',
        price: '₹12,999',
        originalPrice: '₹15,999',
        discount: '19% off',
        rating: '4.0',
        store: 'Reliance Digital',
        category: 'Appliances',
        description: 'Energy efficient refrigerator with direct cool technology',
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop'
      }
    ];
  }
}