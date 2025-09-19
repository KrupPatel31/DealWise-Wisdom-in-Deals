import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-card via-background to-muted/20 border-t border-border/50">
      {/* Newsletter Section */}
      <div className="container mx-auto px-6 py-16">
        <Separator className="bg-border/50 mb-12" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-glow">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary font-display">
                DEALWISE
              </span>
            </Link>

            <p className="text-muted-foreground leading-relaxed max-w-sm">
              The ultimate price comparison platform that helps you find the
              best deals across multiple stores. Save time, save money, shop
              smart.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Features", path: "/features" },
                { name: "How It Works", path: "/how-it-works" },
                { name: "Demo", path: "/demo" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-muted-foreground hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">
              Categories
            </h3>
            <nav className="space-y-3">
              {[
                "Electronics",
                "Gaming",
                "Home & Kitchen",
                "Fashion",
                "Books",
                "Sports",
                "Beauty",
                "Automotive",
              ].map((category) => (
                <Link
                  key={category}
                  to="/demo"
                  className="block text-muted-foreground hover:text-accent transition-colors"
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Support</h3>
            <nav className="space-y-3">
              {[
                "Help Center",
                "API Documentation",
                "Status Page",
                "Bug Reports",
                "Feature Requests",
                "Community Forum",
                "Live Chat",
                "Email Support",
              ].map((item) => (
                <Link
                  key={item}
                  to="/contact"
                  className="block text-muted-foreground hover:text-accent transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="bg-border/50 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Follow us:</span>
            <div className="flex gap-3">
              {[
                { icon: Facebook, name: "Facebook" },
                { icon: Twitter, name: "Twitter" },
                { icon: Instagram, name: "Instagram" },
                { icon: Linkedin, name: "LinkedIn" },
                { icon: Github, name: "GitHub" },
              ].map(({ icon: Icon, name }) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-accent/20 hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-accent transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 mt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            © 2025 DealWise. Made with
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            by the DealWise team. All rights reserved.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-8 pt-8 opacity-50">
          <div className="text-center">
            <div className="text-xl font-bold text-accent">SSL</div>
            <div className="text-xs text-muted-foreground">Secured</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">24/7</div>
            <div className="text-xs text-muted-foreground">Support</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-accent">99.9%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
