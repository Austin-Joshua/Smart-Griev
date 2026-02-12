import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useGrievance } from "@/contexts/GrievanceContext";
import { GrievanceDetailModal } from "@/components/GrievanceDetailModal";
import { useState, useMemo } from "react";
import type { Grievance } from "@/types";
import {
    FileText,
    Users,
    Building2,
    CheckCircle2,
    Clock,
    AlertTriangle,
    TrendingUp,
    MapPin,
    Search,
    Filter,
    ArrowRight,
    MoreHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OfficerDashboard() {
    const { user } = useAuth();
    const { grievances, updateStatus } = useGrievance(); // Updated context hook
    const { toast } = useToast();
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [tab, setTab] = useState("assigned");

    /* ───────── Derived State ───────── */
    // Filter grievances relevant to this officer
    // Logic: 
    // 1. "assigned" tab -> matches officer ID (assuming mock ID or user ID) OR department unassigned if I am header
    // 2. "department" tab -> matches my department
    // For this demo, we'll assume the logged-in user is an officer.

    const myDepartment = user?.department_id || "Public Works"; // Fallback for demo

    const relevantGrievances = useMemo(() => {
        return grievances.filter(g => {
            // In a real app, strict filtering by officer_id or department_id
            // For demo, we might filter by department name string match
            return g.department_name === myDepartment || !g.department_name;
        });
    }, [grievances, myDepartment]);

    const displayedGrievances = useMemo(() => {
        return relevantGrievances.filter(g => {
            const matchesSearch =
                g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                g.id.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || g.status === statusFilter;

            // Tab filtering
            // "assigned" -> explicitly assigned to me (user.id) OR unassigned/pending in my dept
            // "all" -> everything in my dept
            // For simplified demo:
            const matchesTab = tab === "assigned"
                ? (g.status === "Pending" || g.status === "In Progress")
                : true; // "department" tab shows all history

            return matchesSearch && matchesStatus && matchesTab;
        });
    }, [relevantGrievances, searchTerm, statusFilter, tab]);

    const pendingCount = relevantGrievances.filter(g => g.status === "Pending").length;
    const inProgressCount = relevantGrievances.filter(g => g.status === "In Progress").length;
    const resolvedCount = relevantGrievances.filter(g => g.status === "Resolved").length;
    const criticalCount = relevantGrievances.filter(g => g.urgency === "Critical" || g.urgency === "High").length;

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateStatus(id, newStatus);
            toast({ title: "Status Updated", description: `Grievance #${id.slice(0, 8)} marked as ${newStatus}` });
        } catch (error) {
            toast({ title: "Update Failed", description: "Could not update status", variant: "destructive" });
        }
    };

    // Safe date formatting
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
                            <h1 className="font-heading text-2xl md:text-3xl font-bold">Officer Dashboard</h1>
                            <p className="text-muted-foreground">Manage your assigned cases and department overview</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-sm py-1"><Building2 className="w-4 h-4 mr-2 text-primary" /> {myDepartment}</Badge>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="My Pending" value={pendingCount} description="Awaiting action" icon={Clock} variant="warning" />
                        <StatCard title="In Progress" value={inProgressCount} description="Active investigations" icon={TrendingUp} variant="primary" />
                        <StatCard title="Resolved" value={resolvedCount} description="Successfully closed" icon={CheckCircle2} variant="success" />
                        <StatCard title="Critical" value={criticalCount} description="High priority cases" icon={AlertTriangle} variant="urgent" />
                    </div>

                    {/* Main Workspace */}
                    <Card className="shadow-soft min-h-[500px]">
                        <CardHeader>
                            <div className="flex flex-col lg:flex-row gap-4 justify-between">
                                <Tabs value={tab} onValueChange={setTab} className="w-[400px]">
                                    <TabsList>
                                        <TabsTrigger value="assigned">My Assignments</TabsTrigger>
                                        <TabsTrigger value="department">Department All</TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search cases..."
                                            className="pl-9 w-full sm:w-[250px]"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Case ID</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priority</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedGrievances.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-muted-foreground">No cases found matching your criteria.</td>
                                            </tr>
                                        ) : (
                                            displayedGrievances.map((g) => (
                                                <tr key={g.id} className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 font-mono font-medium truncate max-w-[100px]" title={g.id}>{g.id.slice(0, 8)}</td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{g.category}</span>
                                                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{g.description}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant={g.status === "Resolved" ? "success" : g.status === "In Progress" ? "secondary" : "warning"}>{g.status}</Badge>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            {g.urgency === "Critical" || g.urgency === "High" ? <AlertTriangle className="w-4 h-4 text-urgent" /> : null}
                                                            <span className={g.urgency === "High" ? "font-bold text-urgent" : ""}>{g.urgency}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-muted-foreground">{formatDate(g.created_at)}</td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="sm" onClick={() => setSelectedGrievance(g)}>View</Button>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(g.id, "In Progress")}>Mark In Progress</DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(g.id, "Resolved")}>Mark Resolved</DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(g.id, "Rejected")}>Reject Case</DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => setSelectedGrievance(g)}>View Details</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
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

            {/* Grievance Detail Modal */}
            {selectedGrievance && (
                <GrievanceDetailModal grievance={selectedGrievance} onClose={() => setSelectedGrievance(null)} />
            )}

            <Footer />
        </div>
    );
}
