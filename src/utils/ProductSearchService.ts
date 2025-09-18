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

  // Get mock products for demo - 100+ products from major Indian e-commerce platforms
  static getMockProducts(): ProductData[] {
    return [
      // Electronics - Smartphones
      {
        id: '1',
        title: 'iPhone 15 Pro Max 256GB Natural Titanium',
        price: '₹1,34,900',
        originalPrice: '₹1,59,900',
        discount: '16% off',
        rating: '4.8',
        store: 'Amazon',
        category: 'Electronics',
        description: 'Latest iPhone with A17 Pro chip and titanium design',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
      },
      {
        id: '2',
        title: 'Samsung Galaxy S24 Ultra 512GB',
        price: '₹1,29,999',
        originalPrice: '₹1,49,999',
        discount: '13% off',
        rating: '4.6',
        store: 'Flipkart',
        category: 'Electronics',
        description: 'Premium Android flagship with S Pen',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
      },
      {
        id: '3',
        title: 'OnePlus 12R 5G 256GB Iron Gray',
        price: '₹39,999',
        originalPrice: '₹45,999',
        discount: '13% off',
        rating: '4.5',
        store: 'OnePlus Store',
        category: 'Electronics',
        description: 'Flagship killer with Snapdragon 8 Gen 2',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
      },
      {
        id: '4',
        title: 'Xiaomi 14 Ultra 512GB Black',
        price: '₹99,999',
        originalPrice: '₹1,09,999',
        discount: '9% off',
        rating: '4.4',
        store: 'Mi Store',
        category: 'Electronics',
        description: 'Camera-focused flagship with Leica lenses',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
      },
      {
        id: '5',
        title: 'Google Pixel 8 Pro 256GB Bay Blue',
        price: '₹84,999',
        originalPrice: '₹1,06,999',
        discount: '21% off',
        rating: '4.3',
        store: 'Amazon',
        category: 'Electronics',
        description: 'Pure Android experience with AI features',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
      },

      // Electronics - Laptops
      {
        id: '6',
        title: 'MacBook Air M3 15-inch 512GB Midnight',
        price: '₹1,54,900',
        originalPrice: '₹1,74,900',
        discount: '11% off',
        rating: '4.9',
        store: 'Apple Store',
        category: 'Electronics',
        description: 'Lightweight laptop with M3 chip',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop'
      },
      {
        id: '7',
        title: 'Dell XPS 13 Plus Intel i7 32GB',
        price: '₹1,89,990',
        originalPrice: '₹2,09,990',
        discount: '10% off',
        rating: '4.5',
        store: 'Dell Store',
        category: 'Electronics',
        description: 'Premium ultrabook for professionals',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop'
      },
      {
        id: '8',
        title: 'ASUS ROG Strix G15 RTX 4060',
        price: '₹89,990',
        originalPrice: '₹1,09,990',
        discount: '18% off',
        rating: '4.4',
        store: 'Flipkart',
        category: 'Electronics',
        description: 'Gaming laptop with high-refresh display',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop'
      },
      {
        id: '9',
        title: 'HP Pavilion 14 AMD Ryzen 7',
        price: '₹52,990',
        originalPrice: '₹64,990',
        discount: '18% off',
        rating: '4.2',
        store: 'Amazon',
        category: 'Electronics',
        description: 'Affordable laptop for everyday use',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop'
      },
      {
        id: '10',
        title: 'Lenovo ThinkPad E14 Gen 5',
        price: '₹67,890',
        originalPrice: '₹79,990',
        discount: '15% off',
        rating: '4.3',
        store: 'Lenovo Store',
        category: 'Electronics',
        description: 'Business laptop with enhanced security',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop'
      },

      // Fashion - Men's Clothing
      {
        id: '11',
        title: 'Levi\'s 511 Slim Fit Jeans Dark Blue',
        price: '₹2,999',
        originalPrice: '₹4,999',
        discount: '40% off',
        rating: '4.5',
        store: 'Myntra',
        category: 'Fashion',
        description: 'Classic slim fit denim jeans',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop'
      },
      {
        id: '12',
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
        id: '13',
        title: 'Nike Air Force 1 \'07 White',
        price: '₹7,495',
        originalPrice: '₹8,995',
        discount: '17% off',
        rating: '4.7',
        store: 'Nike Store',
        category: 'Fashion',
        description: 'Iconic basketball shoes in white',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'
      },
      {
        id: '14',
        title: 'H&M Cotton T-Shirt Pack of 3',
        price: '₹1,499',
        originalPrice: '₹2,997',
        discount: '50% off',
        rating: '4.1',
        store: 'H&M',
        category: 'Fashion',
        description: 'Basic cotton t-shirts in various colors',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'
      },
      {
        id: '15',
        title: 'Zara Slim Fit Blazer Navy Blue',
        price: '₹6,990',
        originalPrice: '₹9,990',
        discount: '30% off',
        rating: '4.4',
        store: 'Zara',
        category: 'Fashion',
        description: 'Formal blazer for office wear',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'
      },

      // Fashion - Women's Clothing
      {
        id: '16',
        title: 'Kurta Set with Dupatta Ethnic Wear',
        price: '₹1,899',
        originalPrice: '₹3,999',
        discount: '53% off',
        rating: '4.3',
        store: 'Myntra',
        category: 'Fashion',
        description: 'Traditional Indian ethnic wear set',
        image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=300&h=300&fit=crop'
      },
      {
        id: '17',
        title: 'Forever 21 Floral Maxi Dress',
        price: '₹2,495',
        originalPrice: '₹4,995',
        discount: '50% off',
        rating: '4.2',
        store: 'Nykaa Fashion',
        category: 'Fashion',
        description: 'Trendy floral print maxi dress',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop'
      },
      {
        id: '18',
        title: 'Saree Silk Banarasi with Blouse',
        price: '₹4,999',
        originalPrice: '₹12,999',
        discount: '62% off',
        rating: '4.6',
        store: 'Flipkart',
        category: 'Fashion',
        description: 'Traditional silk saree with golden work',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop'
      },
      {
        id: '19',
        title: 'Leggings High Waist Yoga Pants',
        price: '₹899',
        originalPrice: '₹1,999',
        discount: '55% off',
        rating: '4.0',
        store: 'Amazon',
        category: 'Fashion',
        description: 'Comfortable yoga and fitness leggings',
        image: 'https://images.unsplash.com/photo-1506629905877-c19d275b8ca0?w=300&h=300&fit=crop'
      },
      {
        id: '20',
        title: 'Denim Jacket Oversized Blue',
        price: '₹2,299',
        originalPrice: '₹3,999',
        discount: '43% off',
        rating: '4.4',
        store: 'Ajio',
        category: 'Fashion',
        description: 'Trendy oversized denim jacket',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop'
      },

      // Home & Kitchen
      {
        id: '21',
        title: 'Prestige Nakshatra Plus Pressure Cooker 5L',
        price: '₹2,499',
        originalPrice: '₹3,499',
        discount: '29% off',
        rating: '4.3',
        store: 'Flipkart',
        category: 'Kitchen',
        description: 'Stainless steel pressure cooker with safety features',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop'
      },
      {
        id: '22',
        title: 'Philips Air Fryer HD9252/90 4.1L',
        price: '₹8,995',
        originalPrice: '₹12,995',
        discount: '31% off',
        rating: '4.4',
        store: 'Amazon',
        category: 'Kitchen',
        description: 'Healthy cooking with rapid air technology',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop'
      },
      {
        id: '23',
        title: 'Godrej 190L Single Door Refrigerator',
        price: '₹12,999',
        originalPrice: '₹15,999',
        discount: '19% off',
        rating: '4.0',
        store: 'Reliance Digital',
        category: 'Appliances',
        description: 'Energy efficient refrigerator with direct cool',
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop'
      },
      {
        id: '24',
        title: 'LG 7 Kg Front Load Washing Machine',
        price: '₹32,990',
        originalPrice: '₹42,990',
        discount: '23% off',
        rating: '4.2',
        store: 'LG Store',
        category: 'Appliances',
        description: 'Energy efficient washing machine with smart features',
        image: 'https://images.unsplash.com/photo-1626806787460-102b0c50ee70?w=300&h=300&fit=crop'
      },
      {
        id: '25',
        title: 'Bajaj Mixer Grinder 750W 3 Jars',
        price: '₹3,499',
        originalPrice: '₹5,999',
        discount: '42% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Kitchen',
        description: 'Powerful mixer grinder for Indian cooking',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop'
      },

      // Beauty & Personal Care
      {
        id: '26',
        title: 'Himalaya Herbals Neem Face Wash',
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
        id: '27',
        title: 'Lakme Absolute Matte Lipstick',
        price: '₹649',
        originalPrice: '₹850',
        discount: '24% off',
        rating: '4.3',
        store: 'Nykaa',
        category: 'Beauty',
        description: 'Long-lasting matte finish lipstick',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'
      },
      {
        id: '28',
        title: 'L\'Oreal Paris Hair Serum 50ml',
        price: '₹599',
        originalPrice: '₹799',
        discount: '25% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Beauty',
        description: 'Anti-frizz hair serum for smooth hair',
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=300&fit=crop'
      },
      {
        id: '29',
        title: 'Gillette Fusion5 Razor + 4 Blades',
        price: '₹899',
        originalPrice: '₹1,299',
        discount: '31% off',
        rating: '4.4',
        store: 'Amazon',
        category: 'Beauty',
        description: 'Premium shaving razor with 5 blades',
        image: 'https://images.unsplash.com/photo-1585552622378-4d97fd96d276?w=300&h=300&fit=crop'
      },
      {
        id: '30',
        title: 'Mamaearth Vitamin C Face Cream',
        price: '₹399',
        originalPrice: '₹599',
        discount: '33% off',
        rating: '4.0',
        store: 'Mamaearth Store',
        category: 'Beauty',
        description: 'Natural vitamin C moisturizer',
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=300&fit=crop'
      },

      // Electronics - Audio & Accessories
      {
        id: '31',
        title: 'Boat Airdopes 141 True Wireless Earbuds',
        price: '₹1,299',
        originalPrice: '₹2,990',
        discount: '57% off',
        rating: '4.1',
        store: 'Flipkart',
        category: 'Electronics',
        description: 'True wireless earbuds with 42H playback',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop'
      },
      {
        id: '32',
        title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
        price: '₹29,990',
        originalPrice: '₹34,990',
        discount: '14% off',
        rating: '4.8',
        store: 'Sony Store',
        category: 'Electronics',
        description: 'Premium noise cancelling headphones',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop'
      },
      {
        id: '33',
        title: 'JBL Flip 6 Portable Bluetooth Speaker',
        price: '₹10,999',
        originalPrice: '₹12,999',
        discount: '15% off',
        rating: '4.5',
        store: 'Amazon',
        category: 'Electronics',
        description: 'Waterproof portable speaker with JBL sound',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&h=300&fit=crop'
      },
      {
        id: '34',
        title: 'Apple Watch Series 9 GPS 45mm',
        price: '₹44,900',
        originalPrice: '₹49,900',
        discount: '10% off',
        rating: '4.6',
        store: 'Apple Store',
        category: 'Electronics',
        description: 'Latest smartwatch with health monitoring',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop'
      },
      {
        id: '35',
        title: 'Samsung Galaxy Watch 6 Classic 47mm',
        price: '₹38,999',
        originalPrice: '₹43,999',
        discount: '11% off',
        rating: '4.4',
        store: 'Samsung Store',
        category: 'Electronics',
        description: 'Premium smartwatch with rotating bezel',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop'
      },

      // Books & Media
      {
        id: '36',
        title: 'Atomic Habits by James Clear',
        price: '₹399',
        originalPrice: '₹599',
        discount: '33% off',
        rating: '4.8',
        store: 'Amazon',
        category: 'Books',
        description: 'Bestselling book on building good habits',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop'
      },
      {
        id: '37',
        title: 'Rich Dad Poor Dad by Robert Kiyosaki',
        price: '₹299',
        originalPrice: '₹399',
        discount: '25% off',
        rating: '4.6',
        store: 'Flipkart',
        category: 'Books',
        description: 'Classic personal finance book',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop'
      },
      {
        id: '38',
        title: 'The Power of Your Subconscious Mind',
        price: '₹199',
        originalPrice: '₹299',
        discount: '33% off',
        rating: '4.5',
        store: 'Amazon',
        category: 'Books',
        description: 'Self-help book on mindpower',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop'
      },
      {
        id: '39',
        title: 'NCERT Physics Class 12 Textbook',
        price: '₹89',
        originalPrice: '₹125',
        discount: '29% off',
        rating: '4.3',
        store: 'Amazon',
        category: 'Books',
        description: 'Official NCERT textbook for Class 12',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop'
      },
      {
        id: '40',
        title: 'Bhagavad Gita As It Is',
        price: '₹250',
        originalPrice: '₹350',
        discount: '29% off',
        rating: '4.7',
        store: 'Flipkart',
        category: 'Books',
        description: 'Sacred Hindu scripture with commentary',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop'
      },

      // Sports & Fitness
      {
        id: '41',
        title: 'Decathlon Yoga Mat 6mm Anti-Slip',
        price: '₹799',
        originalPrice: '₹1,299',
        discount: '38% off',
        rating: '4.2',
        store: 'Decathlon',
        category: 'Sports',
        description: 'Non-slip yoga mat for all fitness levels',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop'
      },
      {
        id: '42',
        title: 'Dumbbells Set 20kg Adjustable',
        price: '₹2,999',
        originalPrice: '₹4,999',
        discount: '40% off',
        rating: '4.3',
        store: 'Amazon',
        category: 'Sports',
        description: 'Adjustable dumbbells for home gym',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'
      },
      {
        id: '43',
        title: 'Cosco Cricket Bat English Willow',
        price: '₹3,499',
        originalPrice: '₹5,999',
        discount: '42% off',
        rating: '4.4',
        store: 'Flipkart',
        category: 'Sports',
        description: 'Professional cricket bat for serious players',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
      },
      {
        id: '44',
        title: 'Football Nivia Shining Star Size 5',
        price: '₹899',
        originalPrice: '₹1,499',
        discount: '40% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Sports',
        description: 'Official size football for matches',
        image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=300&h=300&fit=crop'
      },
      {
        id: '45',
        title: 'Badminton Racket Yonex Arcsaber',
        price: '₹4,999',
        originalPrice: '₹7,999',
        discount: '38% off',
        rating: '4.6',
        store: 'Decathlon',
        category: 'Sports',
        description: 'Professional badminton racket',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop'
      },

      // Toys & Baby Products
      {
        id: '46',
        title: 'LEGO Classic Creative Bricks Set',
        price: '₹2,499',
        originalPrice: '₹2,999',
        discount: '17% off',
        rating: '4.7',
        store: 'Amazon',
        category: 'Toys',
        description: 'Building blocks for creative play',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop'
      },
      {
        id: '47',
        title: 'Barbie Dreamhouse Dollhouse',
        price: '₹8,999',
        originalPrice: '₹12,999',
        discount: '31% off',
        rating: '4.5',
        store: 'Flipkart',
        category: 'Toys',
        description: 'Multi-story dollhouse with accessories',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop'
      },
      {
        id: '48',
        title: 'Remote Control Car 4WD Off-Road',
        price: '₹3,999',
        originalPrice: '₹6,999',
        discount: '43% off',
        rating: '4.2',
        store: 'Amazon',
        category: 'Toys',
        description: 'High-speed RC car for outdoor fun',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop'
      },
      {
        id: '49',
        title: 'Baby Stroller 3-in-1 Convertible',
        price: '₹12,999',
        originalPrice: '₹18,999',
        discount: '32% off',
        rating: '4.3',
        store: 'FirstCry',
        category: 'Baby',
        description: 'Convertible stroller for newborn to toddler',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop'
      },
      {
        id: '50',
        title: 'Baby Car Seat with ISOFIX Base',
        price: '₹8,999',
        originalPrice: '₹12,999',
        discount: '31% off',
        rating: '4.4',
        store: 'Amazon',
        category: 'Baby',
        description: 'Safety-certified car seat for infants',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop'
      },

      // Automotive Accessories (51-60)
      {
        id: '51',
        title: 'Car Dash Camera Full HD 1080p',
        price: '₹3,999',
        originalPrice: '₹6,999',
        discount: '43% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Automotive',
        description: 'HD dash cam with night vision',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop'
      },
      {
        id: '52',
        title: 'Car Air Purifier with HEPA Filter',
        price: '₹2,499',
        originalPrice: '₹4,999',
        discount: '50% off',
        rating: '4.0',
        store: 'Flipkart',
        category: 'Automotive',
        description: 'Portable air purifier for car',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop'
      },
      {
        id: '53',
        title: 'Michelin Car Tyre 185/65R15',
        price: '₹4,999',
        originalPrice: '₹6,999',
        discount: '29% off',
        rating: '4.5',
        store: 'Michelin Store',
        category: 'Automotive',
        description: 'Premium car tyre with fuel efficiency',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop'
      },
      {
        id: '54',
        title: 'Car Mobile Holder Magnetic',
        price: '₹399',
        originalPrice: '₹999',
        discount: '60% off',
        rating: '3.9',
        store: 'Amazon',
        category: 'Automotive',
        description: 'Strong magnetic phone holder for car',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop'
      },
      {
        id: '55',
        title: 'Car Seat Covers Leather Premium',
        price: '₹3,999',
        originalPrice: '₹7,999',
        discount: '50% off',
        rating: '4.2',
        store: 'Flipkart',
        category: 'Automotive',
        description: 'Premium leather seat covers set',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop'
      },

      // Food & Beverages (56-65)
      {
        id: '56',
        title: 'Organic Basmati Rice 5kg',
        price: '₹899',
        originalPrice: '₹1,299',
        discount: '31% off',
        rating: '4.3',
        store: 'BigBasket',
        category: 'Food',
        description: 'Premium organic basmati rice',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop'
      },
      {
        id: '57',
        title: 'Amul Butter 500g Pack of 2',
        price: '₹549',
        originalPrice: '₹600',
        discount: '9% off',
        rating: '4.6',
        store: 'Amazon',
        category: 'Food',
        description: 'Fresh Amul butter combo pack',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop'
      },
      {
        id: '58',
        title: 'Britannia Good Day Cookies 600g',
        price: '₹149',
        originalPrice: '₹180',
        discount: '17% off',
        rating: '4.2',
        store: 'Grofers',
        category: 'Food',
        description: 'Delicious butter cookies family pack',
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop'
      },
      {
        id: '59',
        title: 'Tata Tea Premium 1kg',
        price: '₹449',
        originalPrice: '₹520',
        discount: '14% off',
        rating: '4.4',
        store: 'BigBasket',
        category: 'Food',
        description: 'Premium quality black tea blend',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop'
      },
      {
        id: '60',
        title: 'Maggi 2-Minute Noodles Pack of 12',
        price: '₹144',
        originalPrice: '₹168',
        discount: '14% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Food',
        description: 'Instant noodles masala flavor',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop'
      },

      // Jewellery & Accessories (61-70)
      {
        id: '61',
        title: 'Gold Plated Earrings Traditional',
        price: '₹1,299',
        originalPrice: '₹2,999',
        discount: '57% off',
        rating: '4.1',
        store: 'Myntra',
        category: 'Jewellery',
        description: 'Traditional gold plated earrings',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop'
      },
      {
        id: '62',
        title: 'Silver Chain Necklace for Men',
        price: '₹2,999',
        originalPrice: '₹4,999',
        discount: '40% off',
        rating: '4.3',
        store: 'Amazon',
        category: 'Jewellery',
        description: 'Sterling silver chain for men',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop'
      },
      {
        id: '63',
        title: 'Diamond Ring Solitaire 0.5 Carat',
        price: '₹89,999',
        originalPrice: '₹1,20,999',
        discount: '26% off',
        rating: '4.8',
        store: 'Tanishq',
        category: 'Jewellery',
        description: 'Certified diamond solitaire ring',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop'
      },
      {
        id: '64',
        title: 'Leather Wallet for Men Brown',
        price: '₹899',
        originalPrice: '₹1,999',
        discount: '55% off',
        rating: '4.2',
        store: 'Amazon',
        category: 'Accessories',
        description: 'Genuine leather bi-fold wallet',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
      },
      {
        id: '65',
        title: 'Sunglasses Ray-Ban Aviator',
        price: '₹7,999',
        originalPrice: '₹12,990',
        discount: '38% off',
        rating: '4.6',
        store: 'Lenskart',
        category: 'Accessories',
        description: 'Classic aviator sunglasses',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop'
      },

      // Pet Supplies (66-70)
      {
        id: '66',
        title: 'Dog Food Royal Canin 15kg',
        price: '₹6,999',
        originalPrice: '₹8,999',
        discount: '22% off',
        rating: '4.5',
        store: 'Amazon',
        category: 'Pets',
        description: 'Premium dog food for adult dogs',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop'
      },
      {
        id: '67',
        title: 'Cat Litter Box Automatic Self-Cleaning',
        price: '₹12,999',
        originalPrice: '₹18,999',
        discount: '32% off',
        rating: '4.2',
        store: 'Flipkart',
        category: 'Pets',
        description: 'Automatic self-cleaning cat litter box',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop'
      },
      {
        id: '68',
        title: 'Dog Leash Retractable 5 Meter',
        price: '₹899',
        originalPrice: '₹1,499',
        discount: '40% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Pets',
        description: 'Retractable dog leash for walks',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop'
      },
      {
        id: '69',
        title: 'Fish Tank Aquarium 100L with Filter',
        price: '₹8,999',
        originalPrice: '₹12,999',
        discount: '31% off',
        rating: '4.3',
        store: 'Amazon',
        category: 'Pets',
        description: 'Complete aquarium setup with filter',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop'
      },
      {
        id: '70',
        title: 'Bird Cage Large with Accessories',
        price: '₹3,999',
        originalPrice: '₹6,999',
        discount: '43% off',
        rating: '4.0',
        store: 'Flipkart',
        category: 'Pets',
        description: 'Spacious bird cage with feeding accessories',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop'
      },

      // Health & Wellness (71-80)
      {
        id: '71',
        title: 'Protein Powder Whey 2kg Chocolate',
        price: '₹3,999',
        originalPrice: '₹5,999',
        discount: '33% off',
        rating: '4.4',
        store: 'Amazon',
        category: 'Health',
        description: 'Premium whey protein for muscle building',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop'
      },
      {
        id: '72',
        title: 'Digital Blood Pressure Monitor',
        price: '₹1,999',
        originalPrice: '₹3,999',
        discount: '50% off',
        rating: '4.2',
        store: 'Amazon',
        category: 'Health',
        description: 'Accurate digital BP monitor',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'
      },
      {
        id: '73',
        title: 'Glucometer with 100 Strips',
        price: '₹899',
        originalPrice: '₹1,599',
        discount: '44% off',
        rating: '4.1',
        store: 'Flipkart',
        category: 'Health',
        description: 'Blood sugar testing kit',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'
      },
      {
        id: '74',
        title: 'Vitamin D3 Tablets 60 Count',
        price: '₹299',
        originalPrice: '₹499',
        discount: '40% off',
        rating: '4.3',
        store: 'Amazon',
        category: 'Health',
        description: 'Essential vitamin D3 supplement',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'
      },
      {
        id: '75',
        title: 'Digital Weighing Scale Body Fat Analyzer',
        price: '₹2,499',
        originalPrice: '₹4,999',
        discount: '50% off',
        rating: '4.0',
        store: 'Amazon',
        category: 'Health',
        description: 'Smart scale with body composition analysis',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'
      },

      // Office Supplies (76-85)
      {
        id: '76',
        title: 'Office Chair Ergonomic with Lumbar Support',
        price: '₹8,999',
        originalPrice: '₹15,999',
        discount: '44% off',
        rating: '4.3',
        store: 'Amazon',
        category: 'Office',
        description: 'Comfortable ergonomic office chair',
        image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&h=300&fit=crop'
      },
      {
        id: '77',
        title: 'Wireless Keyboard and Mouse Combo',
        price: '₹1,999',
        originalPrice: '₹3,999',
        discount: '50% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Office',
        description: 'Wireless keyboard mouse combo',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop'
      },
      {
        id: '78',
        title: 'LED Desk Lamp with USB Charging',
        price: '₹1,499',
        originalPrice: '₹2,999',
        discount: '50% off',
        rating: '4.2',
        store: 'Amazon',
        category: 'Office',
        description: 'Adjustable LED desk lamp with charging port',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'
      },
      {
        id: '79',
        title: 'Printer Canon PIXMA All-in-One',
        price: '₹6,999',
        originalPrice: '₹9,999',
        discount: '30% off',
        rating: '4.2',
        store: 'Amazon',
        category: 'Office',
        description: 'All-in-one inkjet printer with WiFi',
        image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=300&fit=crop'
      },
      {
        id: '80',
        title: 'File Organizer Desktop 6 Compartments',
        price: '₹899',
        originalPrice: '₹1,799',
        discount: '50% off',
        rating: '4.0',
        store: 'Amazon',
        category: 'Office',
        description: 'Desktop file organizer for office',
        image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&h=300&fit=crop'
      },

      // Musical Instruments (81-85)
      {
        id: '81',
        title: 'Yamaha Acoustic Guitar F310',
        price: '₹8,999',
        originalPrice: '₹11,999',
        discount: '25% off',
        rating: '4.5',
        store: 'Amazon',
        category: 'Music',
        description: 'Quality acoustic guitar for beginners',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
      },
      {
        id: '82',
        title: 'Casio Keyboard SA-76 44 Keys',
        price: '₹3,999',
        originalPrice: '₹5,999',
        discount: '33% off',
        rating: '4.3',
        store: 'Amazon',
        category: 'Music',
        description: 'Compact keyboard for learning music',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
      },
      {
        id: '83',
        title: 'Harmonium 39 Keys Standard',
        price: '₹6,999',
        originalPrice: '₹9,999',
        discount: '30% off',
        rating: '4.2',
        store: 'Amazon',
        category: 'Music',
        description: 'Traditional Indian harmonium',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
      },
      {
        id: '84',
        title: 'Tabla Set Copper Bayan with Bag',
        price: '₹8,999',
        originalPrice: '₹12,999',
        discount: '31% off',
        rating: '4.4',
        store: 'Amazon',
        category: 'Music',
        description: 'Professional tabla set with carrying bag',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
      },
      {
        id: '85',
        title: 'Flute Bamboo Professional Scale C',
        price: '₹1,999',
        originalPrice: '₹3,999',
        discount: '50% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Music',
        description: 'Professional bamboo flute in C scale',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
      },

      // Garden & Outdoor (86-90)
      {
        id: '86',
        title: 'Garden Tool Set 10 Pieces',
        price: '₹1,999',
        originalPrice: '₹3,999',
        discount: '50% off',
        rating: '4.2',
        store: 'Amazon',
        category: 'Garden',
        description: 'Complete gardening tool set',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop'
      },
      {
        id: '87',
        title: 'Plant Pots Ceramic Set of 6',
        price: '₹1,499',
        originalPrice: '₹2,999',
        discount: '50% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Garden',
        description: 'Beautiful ceramic plant pots set',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop'
      },
      {
        id: '88',
        title: 'Garden Hose Pipe 50 Feet with Spray Gun',
        price: '₹1,299',
        originalPrice: '₹2,499',
        discount: '48% off',
        rating: '4.0',
        store: 'Amazon',
        category: 'Garden',
        description: 'Flexible garden hose with spray gun',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop'
      },
      {
        id: '89',
        title: 'Outdoor Solar Lights String 20 LED',
        price: '₹899',
        originalPrice: '₹1,999',
        discount: '55% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Garden',
        description: 'Solar powered LED string lights',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop'
      },
      {
        id: '90',
        title: 'Camping Tent 4 Person Waterproof',
        price: '₹4,999',
        originalPrice: '₹8,999',
        discount: '44% off',
        rating: '4.3',
        store: 'Decathlon',
        category: 'Outdoor',
        description: 'Waterproof camping tent for 4 people',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=300&fit=crop'
      },

      // Art & Craft (91-95)
      {
        id: '91',
        title: 'Art Supplies Set 150 Pieces',
        price: '₹2,999',
        originalPrice: '₹5,999',
        discount: '50% off',
        rating: '4.4',
        store: 'Amazon',
        category: 'Art',
        description: 'Complete art supplies set for artists',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop'
      },
      {
        id: '92',
        title: 'Canvas Boards Set of 20 Different Sizes',
        price: '₹899',
        originalPrice: '₹1,799',
        discount: '50% off',
        rating: '4.2',
        store: 'Amazon',
        category: 'Art',
        description: 'Pre-stretched canvas boards for painting',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop'
      },
      {
        id: '93',
        title: 'Watercolor Paint Set 36 Colors',
        price: '₹1,499',
        originalPrice: '₹2,999',
        discount: '50% off',
        rating: '4.3',
        store: 'Amazon',
        category: 'Art',
        description: 'Professional watercolor paint set',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop'
      },
      {
        id: '94',
        title: 'Easel Stand Adjustable Wood',
        price: '₹3,999',
        originalPrice: '₹6,999',
        discount: '43% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Art',
        description: 'Adjustable wooden easel for artists',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop'
      },
      {
        id: '95',
        title: 'Sketchbook A4 200 Pages Premium',
        price: '₹599',
        originalPrice: '₹999',
        discount: '40% off',
        rating: '4.5',
        store: 'Amazon',
        category: 'Art',
        description: 'Premium quality sketchbook for artists',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop'
      },

      // Travel & Luggage (96-100)
      {
        id: '96',
        title: 'VIP Suitcase Set 3 Pieces Hard Shell',
        price: '₹8,999',
        originalPrice: '₹15,999',
        discount: '44% off',
        rating: '4.3',
        store: 'Amazon',
        category: 'Travel',
        description: 'Durable hard shell suitcase set',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
      },
      {
        id: '97',
        title: 'Travel Backpack 50L Waterproof',
        price: '₹3,999',
        originalPrice: '₹6,999',
        discount: '43% off',
        rating: '4.4',
        store: 'Amazon',
        category: 'Travel',
        description: 'Large capacity travel backpack',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
      },
      {
        id: '98',
        title: 'Travel Neck Pillow Memory Foam',
        price: '₹899',
        originalPrice: '₹1,999',
        discount: '55% off',
        rating: '4.2',
        store: 'Amazon',
        category: 'Travel',
        description: 'Comfortable memory foam neck pillow',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
      },
      {
        id: '99',
        title: 'Power Bank 20000mAh Fast Charging',
        price: '₹1,999',
        originalPrice: '₹3,999',
        discount: '50% off',
        rating: '4.1',
        store: 'Amazon',
        category: 'Travel',
        description: 'High capacity power bank for travel',
        image: 'https://images.unsplash.com/photo-1609592888306-4effe2db3eb4?w=300&h=300&fit=crop'
      },
      {
        id: '100',
        title: 'Travel Organizer Bags Set of 6',
        price: '₹1,299',
        originalPrice: '₹2,599',
        discount: '50% off',
        rating: '4.0',
        store: 'Amazon',
        category: 'Travel',
        description: 'Complete travel organizer bags set',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
      }
    ];
  }
}