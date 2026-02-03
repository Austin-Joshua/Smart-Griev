import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  Brain,
  FileText,
  Building2,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  Eye,
  Users,
  Zap,
  MessageSquare,
} from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Submit Your Grievance",
    description: "Describe your concern in your own words. Our system makes it easy to share your experience.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our intelligent system categorizes your complaint, detects urgency, and identifies duplicates.",
  },
  {
    icon: Building2,
    title: "Smart Routing",
    description: "Your grievance is automatically directed to the right department for faster resolution.",
  },
  {
    icon: CheckCircle2,
    title: "Track & Resolve",
    description: "Follow your case in real-time until complete resolution. We keep you informed every step.",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Faster Resolution",
    description: "AI-powered routing means your grievance reaches the right team immediately.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Track every step of your case with real-time status updates.",
  },
  {
    icon: Shield,
    title: "Accountability",
    description: "Every action is logged, ensuring responsible handling of your concerns.",
  },
  {
    icon: Users,
    title: "Citizen-First",
    description: "Designed with you in mind—simple, accessible, and respectful.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium animate-fade-in">
              <Zap className="w-4 h-4" />
              AI-Powered Public Service
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in text-balance">
              Your Voice Matters.
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                We're Here to Listen.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              SmartGriev is a modern grievance management system that ensures your concerns 
              are heard, tracked, and resolved with transparency and accountability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button asChild variant="hero" size="xl">
                <Link to="/submit">
                  <MessageSquare className="w-5 h-5" />
                  Submit a Grievance
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">
                  Track Existing Case
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              How SmartGriev Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A simple, transparent process designed to ensure your grievance gets the attention it deserves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full hero-gradient text-primary-foreground flex items-center justify-center font-bold text-sm shadow-soft">
                  {index + 1}
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl md:text-4xl font-bold">
                Built for Trust.
                <br />
                <span className="text-primary">Designed for You.</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                SmartGriev bridges the gap between citizens and government with a system 
                that prioritizes transparency, speed, and respect for every individual.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit.title}
                    className="flex gap-3 p-4 rounded-xl hover:bg-muted/50 transition-colors animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary-light flex items-center justify-center shrink-0">
                      <benefit.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 hero-gradient rounded-3xl opacity-10 blur-3xl" />
              <div className="relative bg-card rounded-3xl p-8 shadow-elevated border">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold">Grievance Resolved</p>
                      <p className="text-sm text-muted-foreground">Your water supply issue has been fixed</p>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Average Resolution Time</span>
                      <span className="font-semibold text-success">3.2 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Citizen Satisfaction</span>
                      <span className="font-semibold text-success">94%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cases Handled</span>
                      <span className="font-semibold">12,847+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Ready to Be Heard?
            </h2>
            <p className="text-muted-foreground text-lg">
              Your grievance is important. Submit it today and let us work together toward a resolution.
            </p>
            <Button asChild variant="hero" size="xl">
              <Link to="/submit">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
