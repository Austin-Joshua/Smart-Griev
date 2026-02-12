import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-12 flex items-center justify-center">
                <Card className="max-w-md w-full text-center shadow-card">
                    <CardContent className="pt-12 pb-8 space-y-6">
                        <div className="w-20 h-20 rounded-full bg-urgent-light flex items-center justify-center mx-auto">
                            <ShieldX className="w-10 h-10 text-urgent" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="font-heading text-2xl font-bold">Access Denied</h1>
                            <p className="text-muted-foreground">
                                You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" asChild>
                                <Link to="/">
                                    <Home className="w-4 h-4" />
                                    Home
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link to="/dashboard">
                                    <ArrowLeft className="w-4 h-4" />
                                    Dashboard
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
