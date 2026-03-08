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
  ratingCount?: number;
  description?: string;
  category?: string;
  link?: string;
  source?: string;
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

  // Comprehensive default products (~100 products across all categories)
  static getMockProducts(): ProductData[] {
    return [
      // Electronics - Smartphones (20)
      { id: "1", title: "iPhone 15 Pro Max 256GB", price: "₹1,34,900", originalPrice: "₹1,59,900", discount: "16% off", rating: "4.8", store: "Amazon", category: "Electronics", description: "Latest iPhone with A17 Pro chip", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400" },
      { id: "2", title: "Samsung Galaxy S24 Ultra 512GB", price: "₹1,29,999", originalPrice: "₹1,49,999", discount: "13% off", rating: "4.6", store: "Flipkart", category: "Electronics", description: "Premium Android flagship with S Pen", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400" },
      { id: "3", title: "OnePlus 12 256GB Flowy Emerald", price: "₹64,999", originalPrice: "₹69,999", discount: "7% off", rating: "4.5", store: "Amazon", category: "Electronics", description: "Flagship killer with Snapdragon 8 Gen 3", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" },
      { id: "4", title: "Google Pixel 8 Pro 256GB", price: "₹96,999", originalPrice: "₹1,06,999", discount: "9% off", rating: "4.7", store: "Flipkart", category: "Electronics", description: "Best camera smartphone with AI features", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400" },
      { id: "5", title: "Xiaomi 14 Ultra 512GB", price: "₹89,999", originalPrice: "₹99,999", discount: "10% off", rating: "4.4", store: "Amazon", category: "Electronics", description: "Leica camera system, 90W charging", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400" },
      { id: "6", title: "Vivo X100 Pro 256GB", price: "₹79,999", originalPrice: "₹89,999", discount: "11% off", rating: "4.3", store: "Flipkart", category: "Electronics", description: "Zeiss optics, MediaTek Dimensity 9300", image: "https://images.unsplash.com/photo-1580910051074-3eb694886f8b?w=400" },
      { id: "7", title: "iPhone 14 128GB", price: "₹59,999", originalPrice: "₹79,900", discount: "25% off", rating: "4.6", store: "Amazon", category: "Electronics", description: "A15 Bionic chip, excellent value", image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400" },
      { id: "8", title: "Samsung Galaxy A55 5G", price: "₹39,999", originalPrice: "₹44,999", discount: "11% off", rating: "4.2", store: "Flipkart", category: "Electronics", description: "Mid-range 5G phone with great display", image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400" },
      { id: "9", title: "Realme GT 6T 256GB", price: "₹29,999", originalPrice: "₹34,999", discount: "14% off", rating: "4.1", store: "Amazon", category: "Electronics", description: "Snapdragon 7+ Gen 3, 120W charging", image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400" },
      { id: "10", title: "Nothing Phone 2a 256GB", price: "₹27,999", originalPrice: "₹32,999", discount: "15% off", rating: "4.3", store: "Flipkart", category: "Electronics", description: "Unique Glyph interface, clean software", image: "https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?w=400" },
      
      // Electronics - Laptops (15)
      { id: "11", title: "MacBook Air M3 15-inch", price: "₹1,34,900", originalPrice: "₹1,44,900", discount: "7% off", rating: "4.9", store: "Apple Store", category: "Electronics", description: "Supercharged by M3 chip", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" },
      { id: "12", title: "MacBook Pro 14 M3 Pro", price: "₹1,99,900", originalPrice: "₹2,19,900", discount: "9% off", rating: "4.9", store: "Amazon", category: "Electronics", description: "Pro performance for professionals", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400" },
      { id: "13", title: "Dell XPS 15 Intel i7", price: "₹1,49,990", originalPrice: "₹1,69,990", discount: "12% off", rating: "4.6", store: "Dell", category: "Electronics", description: "InfinityEdge display, powerful performance", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400" },
      { id: "14", title: "HP Spectre x360 16", price: "₹1,59,999", originalPrice: "₹1,79,999", discount: "11% off", rating: "4.5", store: "Flipkart", category: "Electronics", description: "2-in-1 convertible laptop", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400" },
      { id: "15", title: "Lenovo ThinkPad X1 Carbon", price: "₹1,44,990", originalPrice: "₹1,64,990", discount: "12% off", rating: "4.7", store: "Amazon", category: "Electronics", description: "Business ultrabook, legendary durability", image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400" },
      { id: "16", title: "ASUS ROG Zephyrus G16", price: "₹1,79,990", originalPrice: "₹1,99,990", discount: "10% off", rating: "4.6", store: "Flipkart", category: "Electronics", description: "Gaming laptop with RTX 4070", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400" },
      { id: "17", title: "Acer Swift Go 14 OLED", price: "₹84,990", originalPrice: "₹94,990", discount: "11% off", rating: "4.4", store: "Amazon", category: "Electronics", description: "Stunning OLED display, lightweight", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400" },
      { id: "18", title: "MSI Stealth 16 Mercedes", price: "₹2,29,990", originalPrice: "₹2,49,990", discount: "8% off", rating: "4.5", store: "Flipkart", category: "Electronics", description: "Limited edition gaming laptop", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400" },
      { id: "19", title: "Samsung Galaxy Book4 Pro", price: "₹1,24,990", originalPrice: "₹1,39,990", discount: "11% off", rating: "4.4", store: "Samsung Store", category: "Electronics", description: "AMOLED display, Intel Core Ultra", image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=400" },
      { id: "20", title: "HP Pavilion Gaming 15", price: "₹69,990", originalPrice: "₹84,990", discount: "18% off", rating: "4.2", store: "Amazon", category: "Electronics", description: "Entry-level gaming laptop", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400" },
      
      // Electronics - Audio (15)
      { id: "21", title: "Sony WH-1000XM5 Headphones", price: "₹26,990", originalPrice: "₹34,990", discount: "23% off", rating: "4.7", store: "Amazon", category: "Electronics", description: "Industry-leading noise cancellation", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
      { id: "22", title: "Apple AirPods Pro 2nd Gen", price: "₹22,900", originalPrice: "₹24,900", discount: "8% off", rating: "4.8", store: "Apple Store", category: "Electronics", description: "Adaptive Audio, USB-C", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400" },
      { id: "23", title: "Bose QuietComfort Ultra", price: "₹32,990", originalPrice: "₹39,990", discount: "18% off", rating: "4.6", store: "Amazon", category: "Electronics", description: "Immersive audio, world-class ANC", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400" },
      { id: "24", title: "Samsung Galaxy Buds2 Pro", price: "₹14,999", originalPrice: "₹17,999", discount: "17% off", rating: "4.4", store: "Flipkart", category: "Electronics", description: "Hi-Fi sound, 360 Audio", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400" },
      { id: "25", title: "JBL Tour One M2", price: "₹29,999", originalPrice: "₹34,999", discount: "14% off", rating: "4.5", store: "Amazon", category: "Electronics", description: "True Adaptive ANC, 50hr battery", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400" },
      { id: "26", title: "Sony WF-1000XM5 Earbuds", price: "₹24,990", originalPrice: "₹29,990", discount: "17% off", rating: "4.6", store: "Flipkart", category: "Electronics", description: "World's smallest ANC earbuds", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400" },
      { id: "27", title: "Sennheiser Momentum 4", price: "₹27,990", originalPrice: "₹34,990", discount: "20% off", rating: "4.7", store: "Amazon", category: "Electronics", description: "Audiophile-grade sound", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400" },
      { id: "28", title: "Marshall Major IV", price: "₹12,999", originalPrice: "₹14,999", discount: "13% off", rating: "4.3", store: "Flipkart", category: "Electronics", description: "Iconic design, 80hr battery", image: "https://images.unsplash.com/photo-1558050032-160f36233a07?w=400" },
      { id: "29", title: "Beats Studio Pro", price: "₹34,900", originalPrice: "₹39,900", discount: "13% off", rating: "4.4", store: "Apple Store", category: "Electronics", description: "Spatial Audio, USB-C", image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400" },
      { id: "30", title: "OnePlus Buds 3", price: "₹5,499", originalPrice: "₹5,999", discount: "8% off", rating: "4.2", store: "Amazon", category: "Electronics", description: "Hi-Res Audio, 49dB ANC", image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400" },
      
      // Electronics - TVs (10)
      { id: "31", title: "LG 55-inch OLED C3", price: "₹1,19,990", originalPrice: "₹1,54,990", discount: "23% off", rating: "4.8", store: "Flipkart", category: "Electronics", description: "Perfect blacks and infinite contrast", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
      { id: "32", title: "Samsung 65-inch Neo QLED 4K", price: "₹1,49,990", originalPrice: "₹1,79,990", discount: "17% off", rating: "4.7", store: "Amazon", category: "Electronics", description: "Quantum Matrix Technology", image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400" },
      { id: "33", title: "Sony Bravia XR A80L 55-inch", price: "₹1,39,990", originalPrice: "₹1,64,990", discount: "15% off", rating: "4.8", store: "Sony", category: "Electronics", description: "Cognitive Processor XR", image: "https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=400" },
      { id: "34", title: "TCL 55-inch QLED 4K Google TV", price: "₹44,990", originalPrice: "₹54,990", discount: "18% off", rating: "4.3", store: "Flipkart", category: "Electronics", description: "Affordable QLED quality", image: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400" },
      { id: "35", title: "Hisense 65-inch Mini LED", price: "₹79,990", originalPrice: "₹99,990", discount: "20% off", rating: "4.4", store: "Amazon", category: "Electronics", description: "Mini LED with Dolby Vision", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400" },
      { id: "36", title: "LG 43-inch UHD 4K Smart TV", price: "₹32,990", originalPrice: "₹42,990", discount: "23% off", rating: "4.2", store: "Flipkart", category: "Electronics", description: "WebOS, Magic Remote", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
      { id: "37", title: "Samsung The Frame 55-inch", price: "₹1,29,990", originalPrice: "₹1,49,990", discount: "13% off", rating: "4.6", store: "Samsung Store", category: "Electronics", description: "Art Mode, Matte Display", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
      { id: "38", title: "OnePlus TV 55 Q2 Pro", price: "₹69,999", originalPrice: "₹84,999", discount: "18% off", rating: "4.4", store: "Amazon", category: "Electronics", description: "QLED, 120Hz, Dolby Vision", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
      { id: "39", title: "Mi 50-inch QLED 4K TV", price: "₹39,999", originalPrice: "₹49,999", discount: "20% off", rating: "4.1", store: "Flipkart", category: "Electronics", description: "Value QLED, Android TV", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
      { id: "40", title: "Sony Bravia 43-inch 4K LED", price: "₹49,990", originalPrice: "₹59,990", discount: "17% off", rating: "4.5", store: "Amazon", category: "Electronics", description: "Google TV, Triluminos Display", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
      
      // Electronics - Accessories (10)
      { id: "41", title: "Kindle Paperwhite 11th Gen", price: "₹13,999", originalPrice: "₹16,999", discount: "18% off", rating: "4.7", store: "Amazon", category: "Electronics", description: "6.8-inch display with warm light", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400" },
      { id: "42", title: "Apple Watch Ultra 2", price: "₹89,900", originalPrice: "₹99,900", discount: "10% off", rating: "4.8", store: "Apple Store", category: "Electronics", description: "Adventure-ready smartwatch", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400" },
      { id: "43", title: "Samsung Galaxy Watch 6 Classic", price: "₹34,999", originalPrice: "₹40,999", discount: "15% off", rating: "4.5", store: "Samsung Store", category: "Electronics", description: "Rotating bezel, Wear OS", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
      { id: "44", title: "Apple iPad Pro 12.9 M2", price: "₹1,12,900", originalPrice: "₹1,32,900", discount: "15% off", rating: "4.9", store: "Apple Store", category: "Electronics", description: "M2 chip, Liquid Retina XDR", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400" },
      { id: "45", title: "Samsung Galaxy Tab S9 Ultra", price: "₹1,08,999", originalPrice: "₹1,24,999", discount: "13% off", rating: "4.6", store: "Amazon", category: "Electronics", description: "14.6-inch AMOLED, S Pen", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400" },
      { id: "46", title: "Logitech MX Master 3S", price: "₹9,995", originalPrice: "₹11,995", discount: "17% off", rating: "4.7", store: "Amazon", category: "Electronics", description: "Quiet clicks, 8K DPI", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400" },
      { id: "47", title: "Apple Magic Keyboard", price: "₹9,900", originalPrice: "₹10,900", discount: "9% off", rating: "4.5", store: "Apple Store", category: "Electronics", description: "Touch ID, wireless charging", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400" },
      { id: "48", title: "GoPro Hero 12 Black", price: "₹44,990", originalPrice: "₹52,990", discount: "15% off", rating: "4.6", store: "Amazon", category: "Electronics", description: "5.3K video, HyperSmooth 6.0", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400" },
      { id: "49", title: "DJI Mini 4 Pro", price: "₹89,990", originalPrice: "₹99,990", discount: "10% off", rating: "4.7", store: "Flipkart", category: "Electronics", description: "4K 60fps, Omnidirectional sensing", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400" },
      { id: "50", title: "Nintendo Switch OLED", price: "₹29,999", originalPrice: "₹34,999", discount: "14% off", rating: "4.8", store: "Amazon", category: "Electronics", description: "7-inch OLED screen", image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400" },
      
      // Fashion - Shoes (15)
      { id: "51", title: "Nike Air Max 270", price: "₹12,995", originalPrice: "₹15,995", discount: "19% off", rating: "4.5", store: "Nike", category: "Fashion", description: "Iconic style with Max Air cushioning", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
      { id: "52", title: "Adidas Ultraboost 23", price: "₹16,999", originalPrice: "₹19,999", discount: "15% off", rating: "4.6", store: "Adidas", category: "Fashion", description: "Light-Strike cushioning", image: "https://images.unsplash.com/photo-1520256862855-398228c41684?w=400" },
      { id: "53", title: "Nike Air Jordan 1 Retro High", price: "₹14,995", originalPrice: "₹16,995", discount: "12% off", rating: "4.7", store: "Nike", category: "Fashion", description: "Classic basketball style", image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400" },
      { id: "54", title: "Puma RS-X", price: "₹8,999", originalPrice: "₹10,999", discount: "18% off", rating: "4.3", store: "Puma", category: "Fashion", description: "Retro-inspired running shoe", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400" },
      { id: "55", title: "New Balance 550", price: "₹11,999", originalPrice: "₹13,999", discount: "14% off", rating: "4.4", store: "Amazon", category: "Fashion", description: "Vintage basketball silhouette", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400" },
      { id: "56", title: "Reebok Classic Leather", price: "₹6,999", originalPrice: "₹8,999", discount: "22% off", rating: "4.2", store: "Flipkart", category: "Fashion", description: "Timeless casual sneaker", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400" },
      { id: "57", title: "Asics Gel-Kayano 30", price: "₹14,990", originalPrice: "₹17,990", discount: "17% off", rating: "4.6", store: "Amazon", category: "Fashion", description: "Stability running shoe", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400" },
      { id: "58", title: "Converse Chuck Taylor All Star", price: "₹4,499", originalPrice: "₹5,499", discount: "18% off", rating: "4.5", store: "Flipkart", category: "Fashion", description: "Iconic canvas sneaker", image: "https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=400" },
      { id: "59", title: "Vans Old Skool", price: "₹5,999", originalPrice: "₹6,999", discount: "14% off", rating: "4.4", store: "Amazon", category: "Fashion", description: "Classic skate shoe", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400" },
      { id: "60", title: "Skechers Go Walk 6", price: "₹5,499", originalPrice: "₹6,999", discount: "21% off", rating: "4.3", store: "Flipkart", category: "Fashion", description: "Ultra comfortable walking shoe", image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400" },
      
      // Fashion - Clothing (10)
      { id: "61", title: "Levi's 511 Slim Fit Jeans", price: "₹2,999", originalPrice: "₹4,499", discount: "33% off", rating: "4.4", store: "Myntra", category: "Fashion", description: "Classic slim fit denim", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
      { id: "62", title: "U.S. Polo Assn Polo T-Shirt", price: "₹1,299", originalPrice: "₹1,999", discount: "35% off", rating: "4.2", store: "Ajio", category: "Fashion", description: "Cotton polo for everyday wear", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
      { id: "63", title: "Allen Solly Formal Shirt", price: "₹1,599", originalPrice: "₹2,499", discount: "36% off", rating: "4.3", store: "Myntra", category: "Fashion", description: "Premium cotton formal shirt", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400" },
      { id: "64", title: "Peter England Blazer", price: "₹4,999", originalPrice: "₹7,999", discount: "38% off", rating: "4.1", store: "Flipkart", category: "Fashion", description: "Slim fit formal blazer", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400" },
      { id: "65", title: "Van Heusen Chinos", price: "₹1,899", originalPrice: "₹2,999", discount: "37% off", rating: "4.2", store: "Amazon", category: "Fashion", description: "Stretch cotton chinos", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400" },
      { id: "66", title: "H&M Oversized Hoodie", price: "₹1,499", originalPrice: "₹1,999", discount: "25% off", rating: "4.4", store: "H&M", category: "Fashion", description: "Cozy cotton blend hoodie", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
      { id: "67", title: "Zara Leather Jacket", price: "₹7,990", originalPrice: "₹9,990", discount: "20% off", rating: "4.5", store: "Zara", category: "Fashion", description: "Classic biker leather jacket", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400" },
      { id: "68", title: "Jack & Jones Denim Jacket", price: "₹2,999", originalPrice: "₹3,999", discount: "25% off", rating: "4.3", store: "Myntra", category: "Fashion", description: "Vintage wash denim jacket", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400" },
      { id: "69", title: "Woodland Leather Belt", price: "₹999", originalPrice: "₹1,495", discount: "33% off", rating: "4.4", store: "Amazon", category: "Fashion", description: "Genuine leather casual belt", image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400" },
      { id: "70", title: "Raymond Premium Suit", price: "₹14,999", originalPrice: "₹19,999", discount: "25% off", rating: "4.6", store: "Raymond", category: "Fashion", description: "Two-piece formal suit", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400" },
      
      // Home & Appliances (15)
      { id: "71", title: "Dyson V15 Detect Vacuum", price: "₹62,900", originalPrice: "₹69,900", discount: "10% off", rating: "4.6", store: "Dyson", category: "Home", description: "Laser reveals hidden dust", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400" },
      { id: "72", title: "Philips Air Fryer XXL", price: "₹18,995", originalPrice: "₹22,995", discount: "17% off", rating: "4.5", store: "Amazon", category: "Home", description: "Fat removal technology", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400" },
      { id: "73", title: "iRobot Roomba i7+", price: "₹59,900", originalPrice: "₹74,900", discount: "20% off", rating: "4.4", store: "Flipkart", category: "Home", description: "Self-emptying robot vacuum", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
      { id: "74", title: "Instant Pot Duo 7-in-1", price: "₹8,499", originalPrice: "₹10,999", discount: "23% off", rating: "4.6", store: "Amazon", category: "Home", description: "Multi-cooker, pressure cooker", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400" },
      { id: "75", title: "Prestige Iris 750W Mixer Grinder", price: "₹4,299", originalPrice: "₹5,495", discount: "22% off", rating: "4.3", store: "Flipkart", category: "Home", description: "3 stainless steel jars", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400" },
      { id: "76", title: "Havells Instanio Prime Geyser", price: "₹7,999", originalPrice: "₹9,999", discount: "20% off", rating: "4.2", store: "Amazon", category: "Home", description: "25L storage water heater", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400" },
      { id: "77", title: "LG 260L Frost-Free Refrigerator", price: "₹32,990", originalPrice: "₹39,990", discount: "18% off", rating: "4.4", store: "Flipkart", category: "Home", description: "Smart Inverter Compressor", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400" },
      { id: "78", title: "Samsung 7kg Front Load Washer", price: "₹34,990", originalPrice: "₹44,990", discount: "22% off", rating: "4.5", store: "Samsung Store", category: "Home", description: "AI Ecobubble technology", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400" },
      { id: "79", title: "Voltas 1.5 Ton 5 Star AC", price: "₹42,990", originalPrice: "₹52,990", discount: "19% off", rating: "4.3", store: "Amazon", category: "Home", description: "Inverter split AC", image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400" },
      { id: "80", title: "Bajaj Majesty Induction Cooktop", price: "₹2,199", originalPrice: "₹2,999", discount: "27% off", rating: "4.1", store: "Flipkart", category: "Home", description: "1900W, Auto-cook presets", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
      { id: "81", title: "Crompton Aura Prime Ceiling Fan", price: "₹2,999", originalPrice: "₹3,999", discount: "25% off", rating: "4.2", store: "Amazon", category: "Home", description: "Anti-dust technology", image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400" },
      { id: "82", title: "Kent Grand Plus RO Purifier", price: "₹17,500", originalPrice: "₹21,000", discount: "17% off", rating: "4.4", store: "Flipkart", category: "Home", description: "RO+UV+UF+TDS Control", image: "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400" },
      { id: "83", title: "Morphy Richards OTG 40L", price: "₹8,999", originalPrice: "₹11,999", discount: "25% off", rating: "4.3", store: "Amazon", category: "Home", description: "Convection, rotisserie", image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400" },
      { id: "84", title: "Bosch Dishwasher 12 Place", price: "₹39,990", originalPrice: "₹49,990", discount: "20% off", rating: "4.5", store: "Flipkart", category: "Home", description: "EcoSilence Drive", image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400" },
      { id: "85", title: "Philips Steam Iron 2400W", price: "₹3,495", originalPrice: "₹4,295", discount: "19% off", rating: "4.2", store: "Amazon", category: "Home", description: "SteamGlide Plus soleplate", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
      
      // Beauty & Personal Care (10)
      { id: "86", title: "Dyson Airwrap Complete", price: "₹49,900", originalPrice: "₹55,900", discount: "11% off", rating: "4.7", store: "Dyson", category: "Beauty", description: "Multi-styler with attachments", image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400" },
      { id: "87", title: "Philips Trimmer BT3211", price: "₹1,595", originalPrice: "₹2,195", discount: "27% off", rating: "4.3", store: "Amazon", category: "Beauty", description: "DualCut technology", image: "https://images.unsplash.com/photo-1621607505837-904c9be55c46?w=400" },
      { id: "88", title: "Braun Series 9 Shaver", price: "₹29,990", originalPrice: "₹34,990", discount: "14% off", rating: "4.6", store: "Flipkart", category: "Beauty", description: "ProLift trimmer, wet & dry", image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400" },
      { id: "89", title: "Philips Hair Dryer HP8120", price: "₹1,295", originalPrice: "₹1,595", discount: "19% off", rating: "4.2", store: "Amazon", category: "Beauty", description: "1200W, ThermoProtect", image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400" },
      { id: "90", title: "Oral-B iO Series 9", price: "₹24,990", originalPrice: "₹29,990", discount: "17% off", rating: "4.5", store: "Amazon", category: "Beauty", description: "AI-powered toothbrush", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400" },
      { id: "91", title: "The Body Shop Vitamin E Set", price: "₹2,995", originalPrice: "₹3,995", discount: "25% off", rating: "4.4", store: "The Body Shop", category: "Beauty", description: "Moisturizing skincare set", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400" },
      { id: "92", title: "MAC Ruby Woo Lipstick", price: "₹1,850", originalPrice: "₹2,100", discount: "12% off", rating: "4.7", store: "Nykaa", category: "Beauty", description: "Iconic red matte lipstick", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400" },
      { id: "93", title: "Maybelline Fit Me Foundation", price: "₹449", originalPrice: "₹599", discount: "25% off", rating: "4.3", store: "Amazon", category: "Beauty", description: "Matte + poreless formula", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400" },
      { id: "94", title: "L'Oreal Paris Serum", price: "₹899", originalPrice: "₹1,199", discount: "25% off", rating: "4.4", store: "Flipkart", category: "Beauty", description: "Hyaluronic Acid serum", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400" },
      { id: "95", title: "Dove Shampoo 1L", price: "₹499", originalPrice: "₹650", discount: "23% off", rating: "4.2", store: "Amazon", category: "Beauty", description: "Daily moisture shampoo", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400" },
      
      // Sports & Fitness (5)
      { id: "96", title: "Fitbit Charge 6", price: "₹14,999", originalPrice: "₹17,999", discount: "17% off", rating: "4.4", store: "Amazon", category: "Sports", description: "Advanced fitness tracker", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400" },
      { id: "97", title: "Nike Yoga Mat Premium", price: "₹2,995", originalPrice: "₹3,995", discount: "25% off", rating: "4.5", store: "Nike", category: "Sports", description: "5mm thick, non-slip", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400" },
      { id: "98", title: "Decathlon Dumbbells 5kg Pair", price: "₹1,299", originalPrice: "₹1,699", discount: "24% off", rating: "4.3", store: "Decathlon", category: "Sports", description: "Vinyl coated dumbbells", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400" },
      { id: "99", title: "Yonex Badminton Racket", price: "₹2,490", originalPrice: "₹2,990", discount: "17% off", rating: "4.6", store: "Amazon", category: "Sports", description: "Astrox series, lightweight", image: "https://images.unsplash.com/photo-1617083934555-ac7d2d1a6f38?w=400" },
      { id: "100", title: "Adidas Football Size 5", price: "₹1,999", originalPrice: "₹2,499", discount: "20% off", rating: "4.4", store: "Flipkart", category: "Sports", description: "FIFA quality certified", image: "https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=400" },
    ];
  }
}
