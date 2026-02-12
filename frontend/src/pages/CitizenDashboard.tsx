import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useGrievance } from "@/contexts/GrievanceContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { Grievance } from "@/types";
import { GrievanceDetailModal } from "@/components/GrievanceDetailModal";
import {
    FileText,
    Clock,
    CheckCircle2,
    PlusCircle,
    MoreHorizontal,
    AlertTriangle,
    Building2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CitizenDashboard() {
    const { user } = useAuth();
    const { grievances } = useGrievance(); // This should now fetch *my* grievances
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

    // Filter grievances for the current user (although API should already filter this for citizens)
    // Assuming the API returns all grievances the user is allowed to see.
    const myGrievances = grievances;

    const pendingCount = myGrievances.filter(g => g.status === "Pending").length;
    const inProgressCount = myGrievances.filter(g => g.status === "In Progress").length;
    const resolvedCount = myGrievances.filter(g => g.status === "Resolved").length;

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return "Invalid Date";
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-heading text-2xl md:text-3xl font-bold">Welcome back, {user?.full_name?.split(" ")[0]}!</h1>
                            <p className="text-muted-foreground">Track and manage your submitted grievances</p>
                        </div>
                        <Button asChild>
                            <Link to="/submit">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                New Grievance
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard title="Pending" value={pendingCount} description="Awaiting review" icon={Clock} variant="warning" />
                        <StatCard title="In Progress" value={inProgressCount} description="Being addressed" icon={FileText} variant="primary" />
                        <StatCard title="Resolved" value={resolvedCount} description="Closed cases" icon={CheckCircle2} variant="success" />
                    </div>

                    <Card className="shadow-soft min-h-[400px]">
                        <CardHeader>
                            <CardTitle>My Grievances</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr className="border-b">
                                            <th className="h-12 px-4 text-left font-medium text-muted-foreground">ID</th>
                                            <th className="h-12 px-4 text-left font-medium text-muted-foreground">Category</th>
                                            <th className="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
                                            <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
                                            <th className="h-12 px-4 text-left font-medium text-muted-foreground">Department</th>
                                            <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myGrievances.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FileText className="w-8 h-8 opacity-20" />
                                                        <p>You haven't submitted any grievances yet.</p>
                                                        <Button variant="link" asChild><Link to="/submit">Submit your first grievance</Link></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            myGrievances.map((g) => (
                                                <tr key={g.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                    <td className="p-4 font-mono text-xs">{g.id.slice(0, 8)}</td>
                                                    <td className="p-4 font-medium">{g.category}</td>
                                                    <td className="p-4">
                                                        <Badge variant={g.status === "Resolved" ? "success" : g.status === "In Progress" ? "secondary" : g.status === "Rejected" ? "destructive" : "default"}>
                                                            {g.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4 text-muted-foreground">{formatDate(g.created_at)}</td>
                                                    <td className="p-4 text-muted-foreground">
                                                        {g.department_name ? (
                                                            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {g.department_name}</span>
                                                        ) : <span>-</span>}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => setSelectedGrievance(g)}>View Details</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {selectedGrievance && (
                <GrievanceDetailModal grievance={selectedGrievance} onClose={() => setSelectedGrievance(null)} />
            )}

            <Footer />
        </div>
    );
}
