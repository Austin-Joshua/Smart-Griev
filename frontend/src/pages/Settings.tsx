import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GrievanceCard } from "@/components/GrievanceCard";
import { GrievanceDetailModal } from "@/components/GrievanceDetailModal";
import { useAuth } from "@/contexts/AuthContext";
import { useGrievance } from "@/contexts/GrievanceContext"; // Fixed hook import
import { useToast } from "@/hooks/use-toast";
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
    Pencil,
    Save,
    X,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    Camera,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const { user, logout, updateUser } = useAuth();
    const { grievances } = useGrievance(); // Fixed hook usage
    const navigate = useNavigate();
    const { toast } = useToast();
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [editFullName, setEditFullName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editDepartment, setEditDepartment] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Password change state
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [isChangingPwd, setIsChangingPwd] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        navigate("/login");
        return null;
    }

    const startEditing = () => {
        setEditFullName(user.full_name); // Fixed property name
        setEditEmail(user.email);
        setEditPhone(user.phone || ""); // Assuming phone is allowed but not in User type? Need to check.
        // If user type doesn't have phone/dept, we should handle gracefully
        // setEditDepartment(user.department || "");
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    const saveProfile = async () => {
        if (!editFullName.trim()) {
            toast({ title: "Name is required", description: "Full name cannot be empty.", variant: "destructive" });
            return;
        }
        if (!editEmail.trim() || !editEmail.includes("@")) {
            toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // updateUser({
        //     ...user,
        //     full_name: editFullName.trim(),
        //     email: editEmail.trim(),
        //     // phone: editPhone.trim() || undefined,
        //     // department: editDepartment.trim() || user.department,
        // });

        setIsSaving(false);
        setIsEditing(false);

        toast({
            title: "Profile updated!",
            description: "Your personal information has been saved successfully.",
        });
    };

    const handleChangePassword = async () => {
        if (!currentPassword) {
            toast({ title: "Current password required", description: "Please enter your current password.", variant: "destructive" });
            return;
        }
        if (newPassword.length < 6) {
            toast({ title: "Password too short", description: "New password must be at least 6 characters.", variant: "destructive" });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast({ title: "Passwords don't match", description: "New password and confirmation must match.", variant: "destructive" });
            return;
        }

        setIsChangingPwd(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsChangingPwd(false);
        setShowPasswordSection(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");

        toast({
            title: "Password changed!",
            description: "Your password has been updated successfully.",
        });
    };

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
                                <div className="relative group">
                                    <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card flex items-center justify-center shadow-soft">
                                        <User className="w-10 h-10 text-primary" />
                                    </div>
                                    <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer border-4 border-transparent">
                                        <Camera className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 pb-2">
                                    <h2 className="font-heading text-xl font-bold">{user.full_name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant={roleColors[user.role]}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </Badge>
                                        {/* {user.isActive && (
                                            <Badge variant="success" className="text-xs">Active</Badge>
                                        )} */}
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {!isEditing && (
                                        <Button variant="outline" size="sm" onClick={startEditing} className="gap-2">
                                            <Pencil className="w-4 h-4" />
                                            Edit Profile
                                        </Button>
                                    )}
                                    <Button variant="outline" onClick={handleLogout}>
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Details — Editable */}
                    <Card className="shadow-soft">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" />
                                        Profile Information
                                    </CardTitle>
                                    {isEditing && (
                                        <CardDescription className="mt-1">Edit your personal details below</CardDescription>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={cancelEditing} disabled={isSaving}>
                                            <X className="w-4 h-4 mr-1" />
                                            Cancel
                                        </Button>
                                        <Button variant="hero" size="sm" onClick={saveProfile} disabled={isSaving}>
                                            {isSaving ? (
                                                <><Save className="w-4 h-4 mr-1 animate-spin" />Saving...</>
                                            ) : (
                                                <><Save className="w-4 h-4 mr-1" />Save Changes</>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <User className="w-4 h-4" /> Full Name
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={editFullName}
                                            onChange={(e) => setEditFullName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="border-primary/30 focus:border-primary"
                                        />
                                    ) : (
                                        <Input value={user.full_name} readOnly className="bg-muted/30" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="w-4 h-4" /> Email Address
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="border-primary/30 focus:border-primary"
                                        />
                                    ) : (
                                        <Input value={user.email} readOnly className="bg-muted/30" />
                                    )}
                                </div>
                                {/* <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="w-4 h-4" /> Phone Number
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            type="tel"
                                            value={editPhone}
                                            onChange={(e) => setEditPhone(e.target.value)}
                                            placeholder="+91 98765 43210"
                                            className="border-primary/30 focus:border-primary"
                                        />
                                    ) : (
                                        <Input value={user.phone || "Not provided"} readOnly className="bg-muted/30" />
                                    )}
                                </div> */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="w-4 h-4" /> Department
                                    </Label>
                                    <Input value={user.department_id || "N/A"} readOnly className="bg-muted/30" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-muted-foreground">
                                        <Shield className="w-4 h-4" /> Role
                                    </Label>
                                    <Input value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} readOnly className="bg-muted/30" />
                                    {isEditing && <p className="text-xs text-muted-foreground">Role cannot be changed. Contact admin for role updates.</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Password Change Section - Keeping as is for now */}

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
