import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductSearchBar } from "@/components/ProductSearchBar";
import { SEO } from "@/components/SEO";

const Search = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Search Products — Compare Prices Across Stores | DealWise"
        description="Search any product and instantly compare prices across Amazon, Flipkart, Myntra, and more. Find the lowest price with DealWise."
        path="/search"
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="sr-only">Search Products & Compare Prices</h1>
        <ProductSearchBar />
      </main>
      <Footer />
    </div>
  );
};

export default Search;
