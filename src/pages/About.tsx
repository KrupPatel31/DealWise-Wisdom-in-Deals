import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const team = [
  {
    name: "Mayur Boricha",
    role: "CEO & Founder",
    image: "/images/team/Mayur Boricha.jpg",
  },
  {
    name: "Jainam Khadalia",
    role: "CTO",
    image: "/images/team/Jainam Khadalia.jpg",
  },
  {
    name: "Krup Patel",
    role: "Head of Product",
    image: "/images/team/Krup Patel.jpg",
  },
];

const About = () => {
  return (
    <div className="min-h-screen dark">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-20">
          <Badge className="bg-accent text-accent-foreground text-sm sm:text-lg px-4 sm:px-6 py-1.5 sm:py-2">
            ABOUT US
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="text-primary">EMPOWERING</span>{" "}
            <span className="hero-gradient">SMART SHOPPING</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe everyone deserves access to the best deals. That's why we
            built DealWise - to democratize smart shopping and help consumers
            save money effortlessly.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid lg:grid-cols-1 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              <span className="text-primary">Our Story</span>
            </h2>
          </div>

          <Card className="p-8 bg-gradient-to-br from-card via-card to-muted border-deal-border">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center glow">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">Our Mission</h3>
                <p className="text-muted-foreground">
                  To make smart shopping accessible to everyone by providing the
                  most accurate, comprehensive, and user-friendly price
                  comparison platform in the world.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-primary">Our Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-deal border-deal-border text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Transparency
              </h3>
              <p className="text-muted-foreground">
                We provide clear, honest information about prices, fees, and
                deals with no hidden agenda.
              </p>
            </Card>
            <Card className="p-8 bg-deal border-deal-border text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Innovation
              </h3>
              <p className="text-muted-foreground">
                We continuously improve our technology to deliver faster, more
                accurate price comparisons.
              </p>
            </Card>
            <Card className="p-8 bg-deal border-deal-border text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Customer First
              </h3>
              <p className="text-muted-foreground">
                Every feature we build is designed with our users' needs and
                savings goals in mind.
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
              <Card
                key={index}
                className="p-8 bg-deal border-deal-border text-center hover:border-accent/50 transition-all duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {member.name}
                </h3>
                <p className="text-accent font-medium mb-4">{member.role}</p>
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
            Start saving money today with intelligent price comparison and deal
            discovery
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/sign-up" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-accent to-primary text-white hover:from-accent/90 hover:to-primary/90 shadow-glow font-medium px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg animate-scale-in"
              >
                <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Get Started for Free
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default About;
