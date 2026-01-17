import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-card via-background to-muted/20 border-t border-border/50">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        {/* Newsletter Section */}
        <div className="text-center mb-10 sm:mb-14 animate-fade-up">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-display">
              <span className="gradient-text">Stay Updated</span>
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Get the latest deals and price drops delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <Button className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 font-semibold px-6">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50 mb-10 sm:mb-12" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-2 space-y-5 sm:space-y-6">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary font-display">
                DEALWISE
              </span>
            </Link>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm">
              The ultimate price comparison platform that helps you find the
              best deals across multiple stores. Save money, shop smarter.
            </p>

            {/* Social Links */}
            <div className="flex gap-2">
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
                  className="h-10 w-10 rounded-xl bg-muted/30 hover:bg-accent/20 hover:text-accent transition-all"
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">{name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base sm:text-lg">
              Quick Links
            </h3>
            <nav className="space-y-2.5 sm:space-y-3">
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
                  className="block text-sm sm:text-base text-muted-foreground hover:text-accent hover:translate-x-1 transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className="hidden sm:block space-y-4">
            <h3 className="font-semibold text-foreground text-base sm:text-lg">
              Categories
            </h3>
            <nav className="space-y-2.5 sm:space-y-3">
              {[
                "Electronics",
                "Gaming",
                "Home & Kitchen",
                "Fashion",
                "Mobiles",
                "Accessories",
              ].map((category) => (
                <Link
                  key={category}
                  to="/search"
                  className="block text-sm sm:text-base text-muted-foreground hover:text-accent hover:translate-x-1 transition-all"
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="hidden lg:block space-y-4">
            <h3 className="font-semibold text-foreground text-base sm:text-lg">Support</h3>
            <nav className="space-y-2.5 sm:space-y-3">
              {[
                "Help Center",
                "Contact Us",
                "Live Chat",
                "FAQs",
                "Report an Issue",
              ].map((item) => (
                <Link
                  key={item}
                  to="/contact"
                  className="block text-sm sm:text-base text-muted-foreground hover:text-accent hover:translate-x-1 transition-all"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="bg-border/50 mb-6 sm:mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            © 2025-26 DealWise. Made with
            <Heart className="h-3.5 w-3.5 text-red-500 fill-current animate-glow-pulse" />
            by the DealWise team.
          </p>

          {/* Legal Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-accent transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-accent transition-colors">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-accent transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
