import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, ShoppingCart, User, LogOut, Menu, Mail, Package, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useProfile } from "@/hooks/useProfile";
import { DealCoinsDisplay } from "@/components/DealCoinsDisplay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { cartCount } = useCart();
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Search", href: "/search" },
    { name: "Visual Search", href: "/visual-search" },
    { name: "Scan", href: "/scan" },
    { name: "Coupons", href: "/coupons" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = profile?.email || user?.email || '';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-lg sm:text-xl font-bold text-primary">DEALWISE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 min-w-[200px] justify-end">
            {authLoading ? (
              <div className="h-9 w-[200px]" />
            ) : user ? (
              <>
                <Link to="/deal-coins"><DealCoinsDisplay /></Link>
                
                <Link to="/cart">
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                    <span className="sr-only">Cart</span>
                  </Button>
                </Link>

                <Link to="/orders">
                  <Button variant="ghost" size="sm">
                    <Package className="h-4 w-4" />
                    <span className="sr-only">Orders</span>
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-background border-border w-64"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {displayEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/change-password" className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Link>
                    </DropdownMenuItem>
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
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <span className="hidden sm:inline">Start Comparing</span>
                    <span className="sm:hidden">Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-1">
            {!authLoading && user && (
              <>
                <Link to="/deal-coins" className="hidden xs:block"><DealCoinsDisplay /></Link>
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative h-8 w-8">
                    <ShoppingCart className="h-4 w-4" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                    <span className="sr-only">Cart</span>
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Package className="h-4 w-4" />
                    <span className="sr-only">Orders</span>
                  </Button>
                </Link>
              </>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold text-primary">
                      DEALWISE
                    </span>
                  </div>

                  <nav className="flex flex-col gap-3">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-6 pt-6 border-t border-border">
                    {user ? (
                      <div className="space-y-4">
                        <div className="px-3 py-2 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium">{displayName}</p>
                          <p className="text-xs text-muted-foreground">{displayEmail}</p>
                        </div>
                        <Link to="/change-password" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="outline"
                            className="w-full justify-start mb-2"
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Change Password
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            signOut();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link to="/sign-in" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full">
                            Log In
                          </Button>
                        </Link>
                        <Link to="/sign-up" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            Start Comparing
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
