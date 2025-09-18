import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-primary">DEALWISE</span>
      </Link>
      
      <nav className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-foreground hover:text-accent transition-colors">Home</Link>
        <Link to="/features" className="text-foreground hover:text-accent transition-colors">Features</Link>
        <Link to="/how-it-works" className="text-foreground hover:text-accent transition-colors">How It Works</Link>
        <Link to="/demo" className="text-foreground hover:text-accent transition-colors">Demo</Link>
        <Link to="/about" className="text-foreground hover:text-accent transition-colors">About</Link>
        <Link to="/contact" className="text-foreground hover:text-accent transition-colors">Contact</Link>
      </nav>
      
      <div className="flex items-center gap-4">
        <Link to="/sign-in">
          <Button variant="ghost" size="sm">
            Log In
          </Button>
        </Link>
        <Link to="/sign-up">
          <Button variant="default" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Start Comparing
          </Button>
        </Link>
      </div>
    </header>
  );
};