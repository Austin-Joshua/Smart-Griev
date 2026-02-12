import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGrievance } from "@/contexts/GrievanceContext";
import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart as PieIcon,
    Activity,
    Calendar,
    X,
    FileText,
    CheckCircle2,
    AlertTriangle,
    Building2,
} from "lucide-react";

// Mock trend data for the past 6 months (static for now)
const monthlyTrends = [
    { month: "Aug", submitted: 45, resolved: 38, pending: 7 },
    { month: "Sep", submitted: 62, resolved: 55, pending: 14 },
    { month: "Oct", submitted: 58, resolved: 48, pending: 24 },
    { month: "Nov", submitted: 73, resolved: 67, pending: 30 },
    { month: "Dec", submitted: 51, resolved: 52, pending: 29 },
    { month: "Jan", submitted: 68, resolved: 61, pending: 36 },
];

const categoryBreakdown = [
    { name: "Infrastructure", value: 145, color: "hsl(215, 72%, 53%)" },
    { name: "Utilities", value: 112, color: "hsl(168, 65%, 45%)" },
    { name: "Sanitation", value: 98, color: "hsl(38, 92%, 55%)" },
    { name: "Roads", value: 87, color: "hsl(0, 72%, 55%)" },
    { name: "Health", value: 56, color: "hsl(280, 65%, 55%)" },
    { name: "General", value: 43, color: "hsl(190, 80%, 45%)" },
];

const resolutionTime = [
    { dept: "Municipal", days: 1.5 },
    { dept: "Water", days: 2.8 },
    { dept: "Health", days: 2.2 },
    { dept: "Public Works", days: 3.2 },
    { dept: "Transport", days: 4.1 },
];

const satisfactionData = [
    { month: "Aug", score: 3.8 },
    { month: "Sep", score: 4.0 },
    { month: "Oct", score: 3.9 },
    { month: "Nov", score: 4.2 },
    { month: "Dec", score: 4.1 },
    { month: "Jan", score: 4.4 },
];

type StatModal = "total-submitted" | "total-resolved" | "resolution-rate" | "active-cases" | null;

export default function Analytics() {
    const { grievances } = useGrievance(); // Fixed hook name
    const [activeModal, setActiveModal] = useState<StatModal>(null);

    const totalSubmitted = monthlyTrends.reduce((s, m) => s + m.submitted, 0);
    const totalResolved = monthlyTrends.reduce((s, m) => s + m.resolved, 0);
    const resolutionRate = ((totalResolved / totalSubmitted) * 100).toFixed(1);

    // Fixed case sensitivity for status
    const activeCases = grievances.filter(g => g.status !== "Resolved");

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
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-3">
                                <BarChart3 className="w-8 h-8 text-primary" />
                                Analytics Dashboard
                            </h1>
                            <p className="text-muted-foreground">Comprehensive insights into grievance management performance</p>
                        </div>
                        <Badge variant="outline" className="gap-2 self-start">
                            <Calendar className="w-3 h-3" />
                            Last 6 months
                        </Badge>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="shadow-soft border-l-4 border-l-primary cursor-pointer hover:shadow-card transition-all" onClick={() => setActiveModal("total-submitted")}>
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Total Submitted</p>
                                <p className="text-3xl font-bold font-heading mt-1">{totalSubmitted}</p>
                                <div className="flex items-center gap-1 mt-2 text-sm text-success">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+12% vs prior period</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-soft border-l-4 border-l-success cursor-pointer hover:shadow-card transition-all" onClick={() => setActiveModal("total-resolved")}>
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Total Resolved</p>
                                <p className="text-3xl font-bold font-heading mt-1">{totalResolved}</p>
                                <div className="flex items-center gap-1 mt-2 text-sm text-success">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+8% vs prior period</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-soft border-l-4 border-l-secondary cursor-pointer hover:shadow-card transition-all" onClick={() => setActiveModal("resolution-rate")}>
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                                <p className="text-3xl font-bold font-heading mt-1">{resolutionRate}%</p>
                                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                                    <Activity className="w-4 h-4" />
                                    <span>Target: 95%</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-soft border-l-4 border-l-warning cursor-pointer hover:shadow-card transition-all" onClick={() => setActiveModal("active-cases")}>
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Active Cases</p>
                                <p className="text-3xl font-bold font-heading mt-1">{activeCases.length}</p>
                                <div className="flex items-center gap-1 mt-2 text-sm text-urgent">
                                    <TrendingDown className="w-4 h-4" />
                                    <span>{grievances.filter(g => g.urgency === "High").length} high priority</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Monthly Trends - Area Chart */}
                        <Card className="shadow-soft lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Activity className="w-5 h-5 text-primary" />
                                    Monthly Grievance Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={monthlyTrends}>
                                        <defs>
                                            <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(215, 72%, 53%)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(215, 72%, 53%)" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 85%)" />
                                        <XAxis dataKey="month" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                                        <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                background: "hsl(var(--card))",
                                                border: "1px solid hsl(var(--border))",
                                                borderRadius: "12px",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                            }}
                                        />
                                        <Area type="monotone" dataKey="submitted" stroke="hsl(215, 72%, 53%)" fill="url(#colorSubmitted)" strokeWidth={2} />
                                        <Area type="monotone" dataKey="resolved" stroke="hsl(168, 76%, 42%)" fill="url(#colorResolved)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Category Breakdown - Pie Chart */}
                        <Card className="shadow-soft">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <PieIcon className="w-5 h-5 text-secondary" />
                                    By Category
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={categoryBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {categoryBreakdown.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {categoryBreakdown.map((c) => (
                                        <div key={c.name} className="flex items-center gap-2 text-xs">
                                            <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                                            <span className="text-muted-foreground truncate">{c.name}</span>
                                            <span className="font-semibold ml-auto">{c.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Resolution Time Bar */}
                        <Card className="shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-lg">Average Resolution Time by Department</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={resolutionTime} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 85%)" />
                                        <XAxis type="number" unit=" days" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                                        <YAxis dataKey="dept" type="category" width={100} stroke="hsl(215, 15%, 55%)" fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="days" radius={[0, 8, 8, 0]}>
                                            {resolutionTime.map((entry, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={entry.days <= 2 ? "hsl(168, 76%, 42%)" : entry.days <= 3.5 ? "hsl(38, 92%, 55%)" : "hsl(0, 72%, 55%)"}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Satisfaction Score Line */}
                        <Card className="shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-lg">Citizen Satisfaction Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={satisfactionData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 85%)" />
                                        <XAxis dataKey="month" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                                        <YAxis domain={[3, 5]} stroke="hsl(215, 15%, 55%)" fontSize={12} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="hsl(280, 65%, 55%)"
                                            strokeWidth={3}
                                            dot={{ fill: "hsl(280, 65%, 55%)", r: 6 }}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                                <div className="text-center mt-4">
                                    <p className="text-2xl font-bold text-primary">4.4 / 5.0</p>
                                    <p className="text-sm text-muted-foreground">Current average rating</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* ════════════ DETAIL MODALS ════════════ */}

            {/* Active Cases */}
            {activeModal === "active-cases" && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
                    <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-warning" />Active Cases — Details</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{activeCases.length} currently active cases</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)}><X className="w-5 h-5" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-4 rounded-xl bg-warning-light"><p className="text-2xl font-bold text-warning-foreground">{activeCases.length}</p><p className="text-xs text-muted-foreground">Active</p></div>
                                <div className="text-center p-4 rounded-xl bg-urgent-light"><p className="text-2xl font-bold text-urgent">{grievances.filter(g => g.urgency === "High").length}</p><p className="text-xs text-muted-foreground">High Priority</p></div>
                                <div className="text-center p-4 rounded-xl bg-success-light"><p className="text-2xl font-bold text-success">{grievances.filter(g => g.status === "Resolved").length}</p><p className="text-xs text-muted-foreground">Resolved</p></div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold">Active Grievances</h3>
                                {activeCases.map((g) => (
                                    <div key={g.id} className="p-4 rounded-xl border bg-muted/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-semibold">{g.category} Issue</p>
                                            <div className="flex gap-2">
                                                <Badge variant={g.status === "In Progress" ? "secondary" : "default"}>{g.status}</Badge>
                                                <Badge variant={g.urgency === "High" ? "urgent" : g.urgency === "Medium" ? "warning" : "success"}>{g.urgency}</Badge>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{g.description}</p>
                                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                            <span>{g.id.slice(0, 8)}</span>
                                            <span>{g.department_name}</span>
                                            <span>{formatDate(g.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                                {activeCases.length === 0 && (
                                    <div className="text-center p-8 text-muted-foreground">
                                        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-success" />
                                        <p className="font-semibold">All cases resolved!</p>
                                        <p className="text-sm">No active cases at the moment.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Footer />
        </div>
    );
}
