import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import qrCode from "@/assets/qr-code-styled.png";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-card via-background to-muted/20 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Separator className="bg-border/50 mb-8 sm:mb-12" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-glow">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary font-display">
                DEALWISE
              </span>
            </Link>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm">
              The ultimate price comparison platform that helps you find the
              best deals across multiple stores.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-base sm:text-lg">
              Quick Links
            </h3>
            <nav className="space-y-2 sm:space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Features", path: "/features" },
                { name: "Search", path: "/search" },
                { name: "How It Works", path: "/how-it-works" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-sm sm:text-base text-muted-foreground hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories - Hidden on smallest screens */}
          <div className="hidden sm:block space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-base sm:text-lg">
              Categories
            </h3>
            <nav className="space-y-2 sm:space-y-3">
              {[
                "Electronics",
                "Gaming",
                "Home & Kitchen",
                "Fashion",
              ].map((category) => (
                <Link
                  key={category}
                  to="/search"
                  className="block text-sm sm:text-base text-muted-foreground hover:text-accent transition-colors"
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support - Hidden on smallest screens */}
          <div className="hidden lg:block space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-base sm:text-lg">Support</h3>
            <nav className="space-y-2 sm:space-y-3">
              {[
                "Help Center",
                "Contact Us",
                "Live Chat",
              ].map((item) => (
                <Link
                  key={item}
                  to="/contact"
                  className="block text-sm sm:text-base text-muted-foreground hover:text-accent transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="bg-border/50 mb-6 sm:mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground">Follow us:</span>
            <div className="flex gap-1 sm:gap-2">
              {[
                { icon: Facebook, name: "Facebook" },
                { icon: Twitter, name: "Twitter" },
                { icon: Instagram, name: "Instagram" },
                { icon: Linkedin, name: "LinkedIn" },
              ].map(({ icon: Icon, name }) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-accent/20 hover:text-accent"
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">{name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Copyright info is shown below */}
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-border/30">
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
            © 2026 DealWise. Made with
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current" />
            by the DealWise team.
          </p>
        </div>
      </div>
    </footer>
  );
};
