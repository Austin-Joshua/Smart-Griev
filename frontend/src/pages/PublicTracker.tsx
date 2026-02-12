import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Users,
    Building2,
    CheckCircle2,
    Clock,
    TrendingUp,
    BarChart3,
    X,
    MapPin,
    Star,
    Search,
    Filter
} from "lucide-react";
import { useState, useMemo } from "react";
import { useGrievance } from "@/contexts/GrievanceContext";
import { GrievanceDetailModal } from "@/components/GrievanceDetailModal";
import type { Grievance } from "@/types";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

/* ───────── Mock Data (kept for layout but should eventually come from API) ───────── */
// ... (Keeping existing mock data for departments if needed, or removing if fully dynamic)
const departmentStats = [
    { name: "Public Works", pending: 24, resolved: 156, avgDays: 3.2, satisfaction: 4.2 },
    { name: "Water Authority", pending: 18, resolved: 89, avgDays: 2.8, satisfaction: 4.5 },
    { name: "Municipal Services", pending: 12, resolved: 234, avgDays: 1.5, satisfaction: 4.8 },
    { name: "Transport Authority", pending: 31, resolved: 112, avgDays: 4.1, satisfaction: 3.9 },
    { name: "Health Department", pending: 8, resolved: 67, avgDays: 2.2, satisfaction: 4.6 },
];

type ModalType = "total-filed" | "resolved-month" | "avg-days" | "active-depts" | "satisfaction" | "active-officers" | "grievance-detail" | null;

export default function PublicTracker() {
    const { grievances } = useGrievance(); // Updated hook
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [deptFilter, setDeptFilter] = useState<string>("all");

    // Calculate stats from real data where possible, falling back to mock for demo completeness if needed
    const totalFiled = grievances.length;
    const totalResolved = grievances.filter(g => g.status === "Resolved").length;
    // Mocking avg days calculation for now as we need history
    const avgResolutionDays = 2.8;
    const satisfactionScore = 4.4;

    const closeModal = () => {
        setModalType(null);
        setSelectedGrievance(null);
    };

    const filteredGrievances = useMemo(() => {
        return grievances.filter(g => {
            const matchesSearch =
                g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (g.department_name && g.department_name.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus = statusFilter === "all" || g.status === statusFilter;
            const matchesDept = deptFilter === "all" || g.department_name === deptFilter;

            return matchesSearch && matchesStatus && matchesDept;
        });
    }, [grievances, searchTerm, statusFilter, deptFilter]);

    // Helper to format date safely
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
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Public Grievance Tracker</h1>
                        <p className="text-muted-foreground text-lg">Transparency in action. Track the status of community issues and view municipal performance metrics in real-time.</p>
                    </div>

                    {/* Key Metrics — Clickable */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatCard title="Total Filed" value={totalFiled} description="Community submissions" icon={FileText} variant="primary" onClick={() => setModalType("total-filed")} />
                        <StatCard title="Resolved" value={totalResolved} description="Issues fixed" icon={CheckCircle2} variant="success" onClick={() => setModalType("resolved-month")} />
                        <StatCard title="Avg Resolution" value={`${avgResolutionDays} days`} description="Speed of action" icon={Clock} variant="secondary" onClick={() => setModalType("avg-days")} />
                        <StatCard title="Active Depts" value={departmentStats.length} description="Responding teams" icon={Building2} onClick={() => setModalType("active-depts")} />
                        <StatCard title="Citizen Rating" value={`${satisfactionScore}/5`} description="Average satisfaction" icon={Star} variant="warning" onClick={() => setModalType("satisfaction")} />
                        <StatCard title="Officers" value="45" description="Active on field" icon={Users} onClick={() => setModalType("active-officers")} />
                    </div>

                    {/* Public Grievance List */}
                    <Card className="shadow-soft">
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <CardTitle className="flex items-center gap-2">
                                    <SEARCH className="w-5 h-5 text-primary" />
                                    Live Grievance Feed
                                </CardTitle>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search ID or keyword..."
                                            className="pl-9 w-full sm:w-[200px]"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={deptFilter} onValueChange={setDeptFilter}>
                                        <SelectTrigger className="w-[160px]">
                                            <SelectValue placeholder="Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Departments</SelectItem>
                                            {departmentStats.map((d) => (
                                                <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredGrievances.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p>No grievances found matching your criteria.</p>
                                    </div>
                                ) : (
                                    filteredGrievances.map((g) => (
                                        <div key={g.id} className="p-4 rounded-xl border hover:shadow-soft transition-all bg-card/50 cursor-pointer" onClick={() => { setSelectedGrievance(g); setModalType("grievance-detail"); }}>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="font-mono text-xs">{g.id}</Badge>
                                                        <span className="text-xs text-muted-foreground">{formatDate(g.created_at)}</span>
                                                    </div>
                                                    <h3 className="font-semibold text-lg">{g.category} Issue</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">{g.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {g.department_name || "Unassigned"}</span>
                                                        {g.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {g.location}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right hidden md:block">
                                                        <p className="text-sm font-medium">{g.status}</p>
                                                        <p className="text-xs text-muted-foreground">Status</p>
                                                    </div>
                                                    <Badge variant={g.status === "Resolved" ? "success" : g.status === "In Progress" ? "secondary" : "default"} className="h-8 px-3">
                                                        {g.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Grievance Detail Modal */}
            {modalType === "grievance-detail" && selectedGrievance && (
                <GrievanceDetailModal grievance={selectedGrievance} onClose={closeModal} />
            )}

            {/* Other Modals (Total Filed, etc.) - Placeholder implementation for brevity, 
          following the pattern from AdminDashboard but tailored for public view */}
            {modalType === "total-filed" && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Total Filed</CardTitle>
                                <Button variant="ghost" size="icon" onClick={closeModal}><X className="w-4 h-4" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>Detailed breakdown of {totalFiled} total grievances filed.</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Footer />
        </div>
    );
}
// Helper component for Search icon to avoid conflict with Lucide import if needed
function SEARCH(props: any) {
    return <BarChart3 {...props} />
}
