import { DealCard } from "./DealCard";
import { Link } from "react-router-dom";

const deals = [
  {
    image: "https://static.wixstatic.com/media/c3da52_74e7d6a15eb34e1a8e94453561a1b02e~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_74e7d6a15eb34e1a8e94453561a1b02e~mv2.png",
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    currentPrice: "₹24,883",
    originalPrice: "₹29,224",
    discount: "15% OFF",
    store: "Amazon",
    description: "Limited-time offer: 15% off + free 2-day shipping for Prime members."
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_03fefc6d3d3e4bd5a61675ae4158ca3b~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_03fefc6d3d3e4bd5a61675ae4158ca3b~mv2.png",
    title: "Apple MacBook Air M2 (2022)",
    currentPrice: "₹83,417",
    originalPrice: "₹1,00,117",
    discount: "17% OFF",
    store: "Best Buy",
    description: "Save $200 instantly. Student discount available."
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_63a7ad9e8f93492bbf58a26cdce2ae7c~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_63a7ad9e8f93492bbf58a26cdce2ae7c~mv2.png",
    title: "Nintendo Switch OLED Model",
    currentPrice: "₹26,637",
    originalPrice: "₹29,142",
    discount: "9% OFF",
    store: "Walmart",
    description: "Bundle deal: Includes Mario Kart 8 Deluxe (digital code)."
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_9132cbb00669421c92e1b58e92e7cf7d~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_9132cbb00669421c92e1b58e92e7cf7d~mv2.png",
    title: "Samsung 65-inch QLED 4K Smart TV",
    currentPrice: "₹75,149",
    originalPrice: "₹1,00,199",
    discount: "25% OFF",
    store: "Target",
    description: "Black Friday in July sale: 25% off + 5% back with Target RedCard."
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_59f0a005039646df821fed384c6fcddc~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_59f0a005039646df821fed384c6fcddc~mv2.png",
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    currentPrice: "₹6,679",
    originalPrice: "₹10,854",
    discount: "38% OFF",
    store: "Macy's",
    description: "Flash sale: Extra 10% off with coupon code 'HOMECOOK'."
  },
  {
    image: "https://static.wixstatic.com/media/c3da52_4310eb49615f449999c192fdf719695d~mv2.png/v1/fill/w_602,h_602,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c3da52_4310eb49615f449999c192fdf719695d~mv2.png",
    title: "Logitech MX Master 3S Wireless Mouse",
    currentPrice: "₹7,514",
    originalPrice: "₹8,349",
    discount: "10% OFF",
    store: "B&H Photo Video",
    description: "New customer discount: Free shipping on orders over $50."
  }
];

export const FeaturedDeals = () => {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl font-bold text-foreground">
          <span className="text-muted-foreground">FEATURED</span>{" "}
          <span className="text-primary">DEALS</span>
        </h2>
        <div className="w-24 h-1 bg-accent mx-auto"></div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the{" "}
          <span className="text-accent font-semibold">best deals</span>{" "}
          across multiple platforms with{" "}
          <span className="text-accent font-semibold">real-time price comparisons</span>{" "}
          and promotional insights.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deals.map((deal, index) => (
          <DealCard key={index} {...deal} />
        ))}
      </div>
      
      <div className="text-center mt-12">
        <Link 
          to="/demo" 
          className="inline-flex items-center text-lg text-primary hover:text-accent transition-colors font-medium"
        >
          View All Deals →
        </Link>
      </div>
    </section>
  );
};