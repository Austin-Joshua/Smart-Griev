import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GrievanceCard } from "@/components/GrievanceCard";
import { GrievanceDetailModal } from "@/components/GrievanceDetailModal";
import { useAuth } from "@/contexts/AuthContext";
import { useGrievances } from "@/contexts/GrievanceContext";
import type { Grievance } from "@/types";
import {
    User,
    Mail,
    Phone,
    Building2,
    Calendar,
    Shield,
    FileText,
    Settings as SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const { user, logout } = useAuth();
    const { grievances } = useGrievances();
    const navigate = useNavigate();
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        navigate("/login");
        return null;
    }

    const roleColors = {
        citizen: "default" as const,
        officer: "secondary" as const,
        admin: "default" as const,
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Page Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                            <SettingsIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-heading text-2xl md:text-3xl font-bold">Settings</h1>
                            <p className="text-muted-foreground">Manage your profile and preferences</p>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <Card className="shadow-card overflow-hidden">
                        <div className="h-24 hero-gradient" />
                        <CardContent className="relative pt-0">
                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10">
                                <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card flex items-center justify-center shadow-soft">
                                    <User className="w-10 h-10 text-primary" />
                                </div>
                                <div className="flex-1 pb-2">
                                    <h2 className="font-heading text-xl font-bold">{user.fullName}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant={roleColors[user.role]}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </Badge>
                                        {user.isActive && (
                                            <Badge variant="success" className="text-xs">Active</Badge>
                                        )}
                                    </div>
                                </div>
                                <Button variant="outline" onClick={handleLogout} className="shrink-0">
                                    Sign Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Details */}
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <User className="w-4 h-4" /> Full Name
                                    </Label>
                                    <Input value={user.fullName} readOnly className="bg-muted/30" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="w-4 h-4" /> Email Address
                                    </Label>
                                    <Input value={user.email} readOnly className="bg-muted/30" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="w-4 h-4" /> Phone Number
                                    </Label>
                                    <Input value={user.phone || "Not provided"} readOnly className="bg-muted/30" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="w-4 h-4" /> Department
                                    </Label>
                                    <Input value={user.department || "N/A"} readOnly className="bg-muted/30" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <Shield className="w-4 h-4" /> Role
                                    </Label>
                                    <Input value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} readOnly className="bg-muted/30" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-4 h-4" /> Member Since
                                    </Label>
                                    <Input
                                        value={user.memberSince.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                                        readOnly
                                        className="bg-muted/30"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* Grievances Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                My Submitted Grievances
                            </h2>
                            <Badge variant="outline" className="text-sm">
                                {grievances.length} total
                            </Badge>
                        </div>

                        {grievances.length === 0 ? (
                            <Card className="shadow-soft">
                                <CardContent className="py-12 text-center">
                                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">No grievances yet</h3>
                                    <p className="text-muted-foreground">You haven't submitted any grievances yet.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {grievances.map((g) => (
                                    <GrievanceCard
                                        key={g.id}
                                        grievance={g}
                                        onClick={() => setSelectedGrievance(g)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {selectedGrievance && (
                <GrievanceDetailModal
                    grievance={selectedGrievance}
                    onClose={() => setSelectedGrievance(null)}
                />
            )}

            <Footer />
        </div>
    );
}
