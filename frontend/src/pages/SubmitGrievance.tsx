import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Send, Shield, Clock, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function SubmitGrievance() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [grievance, setGrievance] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!grievance.trim()) {
      toast({
        title: "Please describe your grievance",
        description: "We need to understand your concern to help you.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-success/20 animate-scale-in">
              <CardContent className="pt-12 pb-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                
                <div className="space-y-2">
                  <h1 className="font-heading text-2xl md:text-3xl font-bold">
                    Your Grievance Has Been Submitted
                  </h1>
                  <p className="text-muted-foreground">
                    Thank you for bringing this to our attention. Your voice matters to us.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-6 text-left space-y-4">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">AI Analysis Complete</p>
                      <p className="text-sm text-muted-foreground">Category: Infrastructure & Public Works</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="font-medium">Estimated Response</p>
                      <p className="text-sm text-muted-foreground">Within 24-48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium">Case ID: GRV-2024-001234</p>
                      <p className="text-sm text-muted-foreground">Use this to track your case</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button onClick={() => navigate("/dashboard")}>
                    Track My Grievance
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setSubmitted(false);
                    setGrievance("");
                    setName("");
                    setEmail("");
                  }}>
                    Submit Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="font-heading text-3xl md:text-4xl font-bold">
              Submit Your Grievance
            </h1>
            <p className="text-muted-foreground text-lg">
              Tell us what's on your mind. We're here to help and ensure your concern is addressed.
            </p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Share Your Concern
              </CardTitle>
              <CardDescription>
                Describe your grievance in your own words. Be as detailed as you'd like.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name (optional)</Label>
                    <Input
                      id="name"
                      placeholder="How should we address you?"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="For updates on your case"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grievance">Your Grievance *</Label>
                  <Textarea
                    id="grievance"
                    placeholder="Please describe your concern in detail. What happened? When did it happen? How has it affected you?"
                    className="min-h-[200px] resize-none"
                    value={grievance}
                    onChange={(e) => setGrievance(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Our AI will automatically categorize your grievance and route it to the appropriate department.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Brain className="w-5 h-5 animate-pulse" />
                      AI is Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Grievance
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-muted/50">
              <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Secure & Private</p>
              <p className="text-xs text-muted-foreground">Your data is protected</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <Brain className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-sm font-medium">AI-Powered</p>
              <p className="text-xs text-muted-foreground">Smart categorization</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <Clock className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-sm font-medium">Fast Response</p>
              <p className="text-xs text-muted-foreground">24-48 hour acknowledgment</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
