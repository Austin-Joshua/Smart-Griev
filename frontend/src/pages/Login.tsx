import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogIn, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast({
                title: "Missing fields",
                description: "Please enter both email and password.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        // Simulate login — in production, this calls the backend
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock successful login
        login(
            {
                id: "usr-001",
                email: email,
                fullName: email.includes("admin") ? "Admin User" : email.includes("officer") ? "Officer User" : "Citizen User",
                role: email.includes("admin") ? "admin" : email.includes("officer") ? "officer" : "citizen",
                department: email.includes("officer") ? "Public Works" : email.includes("admin") ? "Central Administration" : undefined,
                phone: "+91 98765 43210",
                memberSince: new Date("2023-06-15"),
                isActive: true,
            },
            "mock-jwt-token"
        );

        setIsLoading(false);

        toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
        });

        // Redirect based on role
        if (email.includes("admin")) {
            navigate("/admin");
        } else if (email.includes("officer")) {
            navigate("/officer");
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-12 flex items-center justify-center">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-3">
                        <div className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center mx-auto shadow-soft">
                            <Shield className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="font-heading text-3xl font-bold">Welcome Back</h1>
                        <p className="text-muted-foreground">
                            Sign in to your SmartGriev account
                        </p>
                    </div>

                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LogIn className="w-5 h-5 text-primary" />
                                Sign In
                            </CardTitle>
                            <CardDescription>
                                Enter your credentials to access your dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Button
                                    type="submit"
                                    variant="hero"
                                    size="lg"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <LogIn className="w-5 h-5 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-5 h-5" />
                                            Sign In
                                        </>
                                    )}
                                </Button>

                                <div className="text-center text-sm text-muted-foreground">
                                    Don't have an account?{" "}
                                    <Link to="/register" className="text-primary font-medium hover:underline">
                                        Create one
                                        <ArrowRight className="w-3 h-3 inline ml-1" />
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            <strong>Demo:</strong> Use <code className="bg-muted px-1.5 py-0.5 rounded">admin@test.com</code>,{" "}
                            <code className="bg-muted px-1.5 py-0.5 rounded">officer@test.com</code>, or any email for citizen login.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
