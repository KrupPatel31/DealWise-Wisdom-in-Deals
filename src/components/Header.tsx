import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-primary">DEALWISE</span>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <a href="#" className="text-foreground hover:text-accent transition-colors">Home</a>
        <a href="#" className="text-foreground hover:text-accent transition-colors">Features</a>
        <a href="#" className="text-foreground hover:text-accent transition-colors">How It Works</a>
        <a href="#" className="text-foreground hover:text-accent transition-colors">Demo</a>
        <a href="#" className="text-foreground hover:text-accent transition-colors">About</a>
        <a href="#" className="text-foreground hover:text-accent transition-colors">Contact</a>
      </nav>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          Log In
        </Button>
        <Button variant="default" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
          Start Comparing
        </Button>
      </div>
    </header>
  );
};