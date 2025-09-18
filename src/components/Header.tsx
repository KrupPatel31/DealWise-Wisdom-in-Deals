import { Button } from "@/components/ui/button";
import { TrendingUp, ShoppingCart, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-primary">DEALWISE</span>
      </Link>
      
      <nav className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-foreground hover:text-accent transition-colors">Home</Link>
        <Link to="/features" className="text-foreground hover:text-accent transition-colors">Features</Link>
        <Link to="/search" className="text-foreground hover:text-accent transition-colors">Search</Link>
        <Link to="/how-it-works" className="text-foreground hover:text-accent transition-colors">How It Works</Link>
        <Link to="/demo" className="text-foreground hover:text-accent transition-colors">Demo</Link>
        <Link to="/competitor-analysis" className="text-foreground hover:text-accent transition-colors">Scraper</Link>
        <Link to="/about" className="text-foreground hover:text-accent transition-colors">About</Link>
        <Link to="/contact" className="text-foreground hover:text-accent transition-colors">Contact</Link>
      </nav>
      
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </header>
  );
};