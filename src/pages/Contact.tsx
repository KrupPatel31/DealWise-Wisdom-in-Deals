import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, MessageCircle, Users } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: ["support@dealwise.com", "hello@dealwise.com"],
    description: "Get in touch for any questions or support needs"
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    description: "Speak with our support team directly"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Tech Street", "San Francisco, CA 94105"],
    description: "Come visit our headquarters"
  },
  {
    icon: Clock,
    title: "Support Hours",
    details: ["Mon-Fri: 9AM-6PM PST", "Weekend: 10AM-4PM PST"],
    description: "When our support team is available"
  }
];

const departments = [
  {
    icon: MessageCircle,
    title: "General Support",
    email: "support@dealwise.com",
    description: "For general questions, technical issues, and account help"
  },
  {
    icon: Users,
    title: "Business Partnerships",
    email: "partners@dealwise.com", 
    description: "For retailer partnerships and business development"
  }
];

const Contact = () => {
  return (
    <div className="min-h-screen dark">
      <Header />
      
      <main className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-20">
          <Badge className="bg-accent text-accent-foreground text-lg px-6 py-2">
            CONTACT US
          </Badge>
          <h1 className="text-5xl font-bold">
            <span className="text-primary">GET IN</span>{" "}
            <span className="hero-gradient">TOUCH</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about DealWise? Need support? Want to partner with us? 
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Contact Form */}
          <Card className="p-8 bg-deal border-deal-border">
            <h2 className="text-2xl font-bold mb-6">
              <span className="text-primary">Send us a message</span>
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input placeholder="John" className="bg-background border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input placeholder="Doe" className="bg-background border-border" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="john@example.com" className="bg-background border-border" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <select className="w-full bg-background border border-border rounded-md px-3 py-2">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Partnership Opportunity</option>
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea 
                  placeholder="Tell us how we can help you..."
                  className="bg-background border-border min-h-[120px]"
                />
              </div>
              
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                <span className="text-primary">Contact Information</span>
              </h2>
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="p-6 bg-deal border-deal-border hover:border-accent/50 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-2">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-accent font-medium">{detail}</p>
                        ))}
                        <p className="text-sm text-muted-foreground mt-2">{info.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Department Contacts */}
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-primary">Department Contacts</span>
              </h3>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <Card key={index} className="p-6 bg-deal border-deal-border">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <dept.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">{dept.title}</h4>
                        <p className="text-accent font-medium mb-2">{dept.email}</p>
                        <p className="text-sm text-muted-foreground">{dept.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="p-8 bg-deal border-deal-border mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            <span className="text-primary">Frequently Asked Questions</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">How accurate are your price comparisons?</h3>
                <p className="text-sm text-muted-foreground">
                  Our prices are updated in real-time and are 99.9% accurate. We verify all prices directly with retailer APIs.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Is DealWise free to use?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! DealWise is completely free for consumers. We make money through affiliate partnerships with retailers.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">How do I set up price alerts?</h3>
                <p className="text-sm text-muted-foreground">
                  Simply search for a product, click the alert icon, and set your target price. We'll notify you when it drops!
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">Which stores do you compare?</h3>
                <p className="text-sm text-muted-foreground">
                  We compare prices across 50+ major retailers including Amazon, Best Buy, Walmart, Target, and many more.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Can I suggest a store to add?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely! Send us an email with the store details and we'll evaluate adding it to our platform.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Do you have a mobile app?</h3>
                <p className="text-sm text-muted-foreground">
                  Our mobile app is coming soon! For now, our website is fully optimized for mobile devices.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-accent/20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-primary">Start saving money today</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join millions of smart shoppers who use DealWise to find the best deals
          </p>
          <Button className="bg-accent text-accent-foreground px-8 py-3 text-lg hover:bg-accent/90">
            Try DealWise Now
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default Contact;