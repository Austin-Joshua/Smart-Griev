import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGrievances } from "@/contexts/GrievanceContext";
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
} from "recharts";
import {
    Shield,
    FileText,
    CheckCircle2,
    Clock,
    AlertTriangle,
    TrendingUp,
    Users,
    Globe,
    X,
    Building2,
} from "lucide-react";

const publicStats = {
    totalFiled: 15842,
    resolvedThisMonth: 312,
    avgResolutionDays: 2.8,
    activeDepartments: 12,
    citizenSatisfaction: 4.2,
    officersActive: 156,
};

const trendByMonth = [
    { month: "Jul", count: 1200 },
    { month: "Aug", count: 1450 },
    { month: "Sep", count: 1380 },
    { month: "Oct", count: 1520 },
    { month: "Nov", count: 1680 },
    { month: "Dec", count: 1610 },
    { month: "Jan", count: 1750 },
];

const statusBreakdown = [
    { name: "Resolved", value: 12340, color: "hsl(168, 76%, 42%)" },
    { name: "In Progress", value: 1890, color: "hsl(215, 72%, 53%)" },
    { name: "Under Review", value: 1120, color: "hsl(38, 92%, 55%)" },
    { name: "New", value: 492, color: "hsl(280, 65%, 55%)" },
];

const topCategories = [
    { category: "Infrastructure", count: 3240 },
    { category: "Utilities", count: 2870 },
    { category: "Sanitation", count: 2450 },
    { category: "Roads", count: 2180 },
    { category: "Health", count: 1560 },
    { category: "Environment", count: 890 },
];

const departmentList = [
    { name: "Public Works", officers: 32, pending: 145, resolved: 2840, rating: 4.3 },
    { name: "Water Authority", officers: 24, pending: 89, resolved: 1920, rating: 4.1 },
    { name: "Municipal Services", officers: 28, pending: 67, resolved: 3210, rating: 4.5 },
    { name: "Transport Authority", officers: 20, pending: 112, resolved: 1680, rating: 3.8 },
    { name: "Health Department", officers: 18, pending: 34, resolved: 1450, rating: 4.4 },
    { name: "Environmental Services", officers: 12, pending: 23, resolved: 890, rating: 4.2 },
    { name: "Education Board", officers: 10, pending: 18, resolved: 540, rating: 4.0 },
    { name: "Revenue Department", officers: 8, pending: 12, resolved: 380, rating: 3.9 },
    { name: "Housing Authority", officers: 14, pending: 41, resolved: 720, rating: 4.1 },
    { name: "Social Welfare", officers: 10, pending: 28, resolved: 610, rating: 4.3 },
    { name: "Fire Services", officers: 8, pending: 9, resolved: 280, rating: 4.6 },
    { name: "IT & Digital", officers: 6, pending: 6, resolved: 220, rating: 4.4 },
];

type StatModal = "total-filed" | "resolved-month" | "avg-days" | "departments" | "satisfaction" | "officers" | null;

export default function PublicTracker() {
    const { grievances } = useGrievances();
    const [activeModal, setActiveModal] = useState<StatModal>(null);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <div className="w-14 h-14 rounded-2xl hero-gradient flex items-center justify-center mx-auto shadow-soft">
                            <Globe className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <h1 className="font-heading text-2xl md:text-3xl font-bold">
                            Public Grievance Tracker
                        </h1>
                        <p className="text-muted-foreground">
                            Transparency in governance — track how grievances are being addressed across all departments
                        </p>
                        <Badge variant="outline" className="gap-1">
                            <Shield className="w-3 h-3" />
                            Data anonymized for privacy
                        </Badge>
                    </div>

                    {/* Stats Grid — ALL clickable */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <Card className="shadow-soft text-center cursor-pointer hover:shadow-card transition-all" onClick={() => setActiveModal("total-filed")}>
                            <CardContent className="pt-6 pb-4">
                                <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-2xl font-bold font-heading">{publicStats.totalFiled.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Total Filed</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-soft text-center cursor-pointer hover:shadow-card transition-all" onClick={() => setActiveModal("resolved-month")}>
                            <CardContent className="pt-6 pb-4">
                                <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-2" />
                                <p className="text-2xl font-bold font-heading">{publicStats.resolvedThisMonth}</p>
                                <p className="text-xs text-muted-foreground">Resolved This Month</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-soft text-center cursor-pointer hover:shadow-card transition-all" onClick={() => setActiveModal("avg-days")}>
                            <CardContent className="pt-6 pb-4">
                                <Clock className="w-6 h-6 text-secondary mx-auto mb-2" />
                                <p className="text-2xl font-bold font-heading">{publicStats.avgResolutionDays}</p>
                                <p className="text-xs text-muted-foreground">Avg Days to Resolve</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-soft text-center cursor-pointer hover:shadow-card transition-all" onClick={() => setActiveModal("departments")}>
                            <CardContent className="pt-6 pb-4">
                                <AlertTriangle className="w-6 h-6 text-warning mx-auto mb-2" />
                                <p className="text-2xl font-bold font-heading">{publicStats.activeDepartments}</p>
                                <p className="text-xs text-muted-foreground">Active Departments</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-soft text-center cursor-pointer hover:shadow-card transition-all" onClick={() => setActiveModal("satisfaction")}>
                            <CardContent className="pt-6 pb-4">
                                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-2xl font-bold font-heading">{publicStats.citizenSatisfaction}/5</p>
                                <p className="text-xs text-muted-foreground">Citizen Satisfaction</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-soft text-center cursor-pointer hover:shadow-card transition-all" onClick={() => setActiveModal("officers")}>
                            <CardContent className="pt-6 pb-4">
                                <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
                                <p className="text-2xl font-bold font-heading">{publicStats.officersActive}</p>
                                <p className="text-xs text-muted-foreground">Active Officers</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Trend */}
                        <Card className="shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-lg">Grievances Filed Over Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={trendByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 85%)" />
                                        <XAxis dataKey="month" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                                        <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                background: "hsl(var(--card))",
                                                border: "1px solid hsl(var(--border))",
                                                borderRadius: "12px",
                                            }}
                                        />
                                        <Bar dataKey="count" fill="hsl(215, 72%, 53%)" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Status Breakdown */}
                        <Card className="shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-lg">Current Status Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={statusBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={85}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {statusBreakdown.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    {statusBreakdown.map((s) => (
                                        <div key={s.name} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                                            <span className="text-sm text-muted-foreground">{s.name}</span>
                                            <span className="text-sm font-semibold ml-auto">{s.value.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Categories */}
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle className="text-lg">Top Grievance Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topCategories.map((cat) => (
                                    <div key={cat.category} className="flex items-center gap-4">
                                        <span className="text-sm font-medium w-28 shrink-0">{cat.category}</span>
                                        <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                                            <div
                                                className="h-full hero-gradient rounded-full transition-all duration-1000"
                                                style={{ width: `${(cat.count / topCategories[0].count) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-semibold w-16 text-right">{cat.count.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* ════════════ DETAIL MODALS ════════════ */}

            {/* Total Filed */}
            {activeModal === "total-filed" && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2"><FileText className="w-6 h-6 text-primary" />Total Grievances Filed</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{publicStats.totalFiled.toLocaleString()} grievances across all departments</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)}><X className="w-5 h-5" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {statusBreakdown.map((s) => (
                                    <div key={s.name} className="text-center p-3 rounded-xl bg-muted/30">
                                        <p className="text-xl font-bold" style={{ color: s.color }}>{s.value.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">{s.name}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold">By Category</h3>
                                {topCategories.map((cat) => (
                                    <div key={cat.category} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="font-medium">{cat.category}</span>
                                        <span className="font-bold">{cat.count.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold">Monthly Filing Trend</h3>
                                {trendByMonth.map((m) => (
                                    <div key={m.month} className="flex items-center gap-3">
                                        <span className="text-sm w-10">{m.month}</span>
                                        <div className="flex-1 bg-muted rounded-full h-3">
                                            <div className="h-3 rounded-full bg-primary" style={{ width: `${(m.count / 1800) * 100}%` }}></div>
                                        </div>
                                        <span className="text-sm font-semibold w-16 text-right">{m.count.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Resolved This Month */}
            {activeModal === "resolved-month" && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-success" />Resolved This Month</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{publicStats.resolvedThisMonth} cases resolved in the current month</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)}><X className="w-5 h-5" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-4 rounded-xl bg-success-light"><p className="text-2xl font-bold text-success">312</p><p className="text-xs text-muted-foreground">Resolved</p></div>
                                <div className="text-center p-4 rounded-xl bg-muted"><p className="text-2xl font-bold">78%</p><p className="text-xs text-muted-foreground">Resolution Rate</p></div>
                                <div className="text-center p-4 rounded-xl bg-primary-light"><p className="text-2xl font-bold">2.8d</p><p className="text-xs text-muted-foreground">Avg Resolution</p></div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold">Resolved by Department (This Month)</h3>
                                {departmentList.slice(0, 6).map((dept) => (
                                    <div key={dept.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-3">
                                            <Building2 className="w-5 h-5 text-success" />
                                            <span className="font-medium">{dept.name}</span>
                                        </div>
                                        <Badge variant="success">{Math.round(dept.resolved / 42)} resolved</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Avg Days */}
            {activeModal === "avg-days" && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2"><Clock className="w-6 h-6 text-secondary" />Average Resolution Time</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{publicStats.avgResolutionDays} days average across all departments</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)}><X className="w-5 h-5" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <h3 className="font-semibold">Resolution Time by Department</h3>
                                {[
                                    { name: "Municipal Services", days: 1.5 },
                                    { name: "Health Department", days: 2.2 },
                                    { name: "Water Authority", days: 2.8 },
                                    { name: "Public Works", days: 3.2 },
                                    { name: "Transport Authority", days: 4.1 },
                                ].sort((a, b) => a.days - b.days).map((dept) => (
                                    <div key={dept.name} className="p-4 rounded-xl bg-muted/30 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">{dept.name}</span>
                                            <span className={`font-bold ${dept.days <= 2 ? "text-success" : dept.days <= 3.5 ? "text-warning-foreground" : "text-urgent"}`}>{dept.days} days</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3">
                                            <div className={`h-3 rounded-full ${dept.days <= 2 ? "bg-success" : dept.days <= 3.5 ? "bg-warning" : "bg-urgent"}`} style={{ width: `${(dept.days / 5) * 100}%` }}></div>
                                        </div>
                                        <Badge variant={dept.days <= 2 ? "success" : dept.days <= 3.5 ? "warning" : "urgent"} className="text-xs">{dept.days <= 2 ? "Excellent" : dept.days <= 3.5 ? "Good" : "Needs Attention"}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Active Departments */}
            {activeModal === "departments" && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
                    <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2"><Building2 className="w-6 h-6 text-primary" />Active Departments</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{publicStats.activeDepartments} departments currently handling grievances</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)}><X className="w-5 h-5" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {departmentList.map((dept) => (
                                <div key={dept.name} className="p-4 rounded-xl bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></div>
                                        <div>
                                            <p className="font-semibold">{dept.name}</p>
                                            <p className="text-xs text-muted-foreground">{dept.officers} officers</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Badge variant="warning">{dept.pending} pending</Badge>
                                        <Badge variant="success">{dept.resolved.toLocaleString()} resolved</Badge>
                                        <Badge variant="outline">⭐ {dept.rating}</Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Citizen Satisfaction */}
            {activeModal === "satisfaction" && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2"><TrendingUp className="w-6 h-6 text-primary" />Citizen Satisfaction</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">Overall rating: {publicStats.citizenSatisfaction}/5</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)}><X className="w-5 h-5" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center p-6 rounded-2xl bg-primary-light">
                                <p className="text-5xl font-bold text-primary">{publicStats.citizenSatisfaction}</p>
                                <p className="text-muted-foreground mt-1">out of 5.0</p>
                                <div className="flex justify-center gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <span key={i} className={`text-2xl ${i <= Math.round(publicStats.citizenSatisfaction) ? "" : "opacity-30"}`}>⭐</span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold">Satisfaction by Department</h3>
                                {departmentList.sort((a, b) => b.rating - a.rating).slice(0, 6).map((dept) => (
                                    <div key={dept.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="font-medium">{dept.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">⭐</span>
                                            <span className="font-bold">{dept.rating}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Active Officers */}
            {activeModal === "officers" && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2"><Users className="w-6 h-6 text-secondary" />Active Officers</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{publicStats.officersActive} officers handling cases across all departments</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)}><X className="w-5 h-5" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-4 rounded-xl bg-primary-light"><p className="text-2xl font-bold">{publicStats.officersActive}</p><p className="text-xs text-muted-foreground">Total Officers</p></div>
                                <div className="text-center p-4 rounded-xl bg-success-light"><p className="text-2xl font-bold text-success">{publicStats.activeDepartments}</p><p className="text-xs text-muted-foreground">Departments</p></div>
                                <div className="text-center p-4 rounded-xl bg-muted"><p className="text-2xl font-bold">{Math.round(publicStats.officersActive / publicStats.activeDepartments)}</p><p className="text-xs text-muted-foreground">Avg per Dept</p></div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold">Officers by Department</h3>
                                {departmentList.sort((a, b) => b.officers - a.officers).map((dept) => (
                                    <div key={dept.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-secondary" />
                                            <span className="font-medium">{dept.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold">{dept.officers} officers</span>
                                            <Badge variant="outline">{dept.pending} cases</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Footer />
        </div>
    );
}
