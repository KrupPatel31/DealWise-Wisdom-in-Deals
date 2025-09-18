import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, Award } from "lucide-react";

const stats = [
  { number: "2M+", label: "Active Users", icon: Users },
  { number: "50+", label: "Partner Stores", icon: TrendingUp },
  { number: "$100M+", label: "Money Saved", icon: Target },
  { number: "99.9%", label: "Uptime", icon: Award }
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Founder",
    bio: "Former Amazon executive with 10+ years in e-commerce and data analytics",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=300&h=300&fit=crop&crop=face"
  },
  {
    name: "Michael Rodriguez",
    role: "CTO",
    bio: "Ex-Google engineer specializing in large-scale distributed systems and AI",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
  },
  {
    name: "Emily Watson",
    role: "Head of Product",
    bio: "Former Shopify product leader with expertise in consumer shopping behavior",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
  }
];

const About = () => {
  return (
    <div className="min-h-screen dark">
      <Header />
      
      <main className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-20">
          <Badge className="bg-accent text-accent-foreground text-lg px-6 py-2">
            ABOUT US
          </Badge>
          <h1 className="text-5xl font-bold">
            <span className="text-primary">EMPOWERING</span>{" "}
            <span className="hero-gradient">SMART SHOPPING</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe everyone deserves access to the best deals. That's why we built DealWise - 
            to democratize smart shopping and help consumers save money effortlessly.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              <span className="text-primary">Our Story</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2020, DealWise emerged from a simple frustration: spending hours manually 
                comparing prices across different websites just to find the best deal. Our founders, 
                experienced tech professionals from Amazon and Google, knew there had to be a better way.
              </p>
              <p>
                We built DealWise to solve this problem not just for ourselves, but for millions of 
                online shoppers who deserve better tools to make informed purchasing decisions. Our 
                AI-powered platform now serves over 2 million users worldwide.
              </p>
              <p>
                Today, we continue to innovate with advanced machine learning algorithms, real-time 
                price tracking, and partnerships with major retailers to bring you the most comprehensive 
                price comparison experience available.
              </p>
            </div>
          </div>
          
          <Card className="p-8 bg-gradient-to-br from-card via-card to-muted border-deal-border">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center glow">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  Our Mission
                </h3>
                <p className="text-muted-foreground">
                  To make smart shopping accessible to everyone by providing the most accurate, 
                  comprehensive, and user-friendly price comparison platform in the world.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 bg-deal border-deal-border text-center hover:border-accent/50 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-accent mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-primary">Our Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-deal border-deal-border text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">Transparency</h3>
              <p className="text-muted-foreground">
                We provide clear, honest information about prices, fees, and deals with no hidden agenda.
              </p>
            </Card>
            <Card className="p-8 bg-deal border-deal-border text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously improve our technology to deliver faster, more accurate price comparisons.
              </p>
            </Card>
            <Card className="p-8 bg-deal border-deal-border text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">Customer First</h3>
              <p className="text-muted-foreground">
                Every feature we build is designed with our users' needs and savings goals in mind.
              </p>
            </Card>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-primary">Meet Our Team</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-8 bg-deal border-deal-border text-center hover:border-accent/50 transition-all duration-300">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                <p className="text-accent font-medium mb-4">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-accent/20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-primary">Join the DealWise Community</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start saving money today with intelligent price comparison and deal discovery
          </p>
          <button className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
            Get Started for Free
          </button>
        </Card>
      </main>
    </div>
  );
};

export default About;