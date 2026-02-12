import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Mail, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState<"email" | "sent" | "reset">("email");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            toast({ title: "Enter your email", description: "We need your email to send the reset link.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        setIsLoading(false);
        setStep("sent");
        toast({ title: "OTP Sent!", description: "Check your email for the verification code." });
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 4) {
            toast({ title: "Invalid OTP", description: "Please enter the 6-digit code from your email.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setIsLoading(false);
        setStep("reset");
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast({ title: "Too short", description: "Password must be at least 6 characters.", variant: "destructive" });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ title: "Passwords don't match", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        setIsLoading(false);
        toast({ title: "Password Reset Successfully!", description: "You can now sign in with your new password." });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-12 flex items-center justify-center">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-3">
                        <div className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center mx-auto shadow-soft">
                            <KeyRound className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="font-heading text-3xl font-bold">Reset Password</h1>
                        <p className="text-muted-foreground">
                            {step === "email" && "Enter your email to receive a verification code"}
                            {step === "sent" && "Enter the 6-digit code sent to your email"}
                            {step === "reset" && "Create a new password for your account"}
                        </p>
                    </div>

                    <Card className="shadow-card">
                        <CardContent className="pt-6">
                            {/* Step 1: Email */}
                            {step === "email" && (
                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Sending..." : "Send Verification Code"}
                                    </Button>
                                </form>
                            )}

                            {/* Step 2: OTP */}
                            {step === "sent" && (
                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <div className="text-center mb-4">
                                        <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center mx-auto mb-3">
                                            <Mail className="w-6 h-6 text-success" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Code sent to <strong>{email}</strong>
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="otp">Verification Code</Label>
                                        <Input
                                            id="otp"
                                            placeholder="Enter 6-digit code"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            maxLength={6}
                                            className="text-center text-2xl tracking-widest font-mono"
                                        />
                                    </div>
                                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Verifying..." : "Verify Code"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full text-sm"
                                        onClick={() => setStep("email")}
                                    >
                                        <ArrowLeft className="w-3 h-3" />
                                        Try a different email
                                    </Button>
                                </form>
                            )}

                            {/* Step 3: New Password */}
                            {step === "reset" && (
                                <form onSubmit={handleResetPassword} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Min. 6 characters"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Re-enter password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Resetting..." : "Reset Password"}
                                    </Button>
                                </form>
                            )}

                            <div className="text-center mt-6">
                                <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                                    <ArrowLeft className="w-3 h-3" />
                                    Back to Sign In
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
