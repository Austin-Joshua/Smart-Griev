import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { downloadCSV } from "@/lib/csvExport";
import { useGrievances } from "@/contexts/GrievanceContext";
import { GrievanceDetailModal } from "@/components/GrievanceDetailModal";
import { useState } from "react";
import type { Grievance } from "@/types";
import {
  FileText,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Download,
  X,
  Mail,
  Phone,
  Shield,
  Settings,
  ToggleLeft,
  Hash,
} from "lucide-react";

/* ───────── Mock Data ───────── */

const departmentStats = [
  { name: "Public Works", pending: 24, resolved: 156, avgDays: 3.2 },
  { name: "Water Authority", pending: 18, resolved: 89, avgDays: 2.8 },
  { name: "Municipal Services", pending: 12, resolved: 234, avgDays: 1.5 },
  { name: "Transport Authority", pending: 31, resolved: 112, avgDays: 4.1 },
  { name: "Health Department", pending: 8, resolved: 67, avgDays: 2.2 },
];

interface Officer {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  activeCases: number;
  resolvedTotal: number;
  avgRating: number;
  status: "active" | "on-leave" | "inactive";
  joinedDate: Date;
}

const mockOfficers: Officer[] = [
  { id: "OFF-001", name: "Officer Priya Nair", email: "priya.n@gov.in", phone: "+91 94561 23456", department: "Public Works", role: "Senior Officer", activeCases: 8, resolvedTotal: 156, avgRating: 4.6, status: "active", joinedDate: new Date("2022-03-15") },
  { id: "OFF-002", name: "Officer Rajesh Gupta", email: "rajesh.g@gov.in", phone: "+91 93456 78901", department: "Water Authority", role: "Field Officer", activeCases: 5, resolvedTotal: 89, avgRating: 4.2, status: "active", joinedDate: new Date("2023-01-10") },
  { id: "OFF-003", name: "Officer Meena Kumari", email: "meena.k@gov.in", phone: "+91 92345 67890", department: "Municipal Services", role: "Senior Officer", activeCases: 3, resolvedTotal: 234, avgRating: 4.8, status: "active", joinedDate: new Date("2021-07-20") },
  { id: "OFF-004", name: "Officer Suresh Patel", email: "suresh.p@gov.in", phone: "+91 91234 56789", department: "Transport Authority", role: "Junior Officer", activeCases: 12, resolvedTotal: 45, avgRating: 3.8, status: "active", joinedDate: new Date("2023-08-05") },
  { id: "OFF-005", name: "Officer Divya Sharma", email: "divya.s@gov.in", phone: "+91 90123 45678", department: "Health Department", role: "Field Officer", activeCases: 0, resolvedTotal: 67, avgRating: 4.4, status: "on-leave", joinedDate: new Date("2022-11-12") },
];

interface DepartmentConfig {
  name: string;
  routingKeywords: string[];
  autoAssign: boolean;
  priorityEscalationDays: number;
  officerCount: number;
  head: string;
  email: string;
  description: string;
}

const mockDepartmentConfigs: DepartmentConfig[] = [
  { name: "Public Works", routingKeywords: ["road", "pothole", "street light", "bridge", "drain", "construction"], autoAssign: true, priorityEscalationDays: 3, officerCount: 12, head: "Dr. V. Ramachandran", email: "pw@municipal.gov.in", description: "Handles road infrastructure, street lighting, drainage systems, and public construction projects." },
  { name: "Water Authority", routingKeywords: ["water", "supply", "pipeline", "sewage", "drainage", "flood"], autoAssign: true, priorityEscalationDays: 2, officerCount: 8, head: "Ms. Lakshmi Devi", email: "water@municipal.gov.in", description: "Manages water supply, pipeline maintenance, sewage systems, and flood management." },
  { name: "Municipal Services", routingKeywords: ["garbage", "waste", "sanitation", "sweep", "clean", "park"], autoAssign: false, priorityEscalationDays: 2, officerCount: 15, head: "Mr. Arun Joshi", email: "municipal@municipal.gov.in", description: "Oversees solid waste management, sanitation, cleaning, and public park maintenance." },
  { name: "Transport Authority", routingKeywords: ["traffic", "signal", "bus", "parking", "transport", "vehicle"], autoAssign: true, priorityEscalationDays: 4, officerCount: 10, head: "Mr. Karthik Rao", email: "transport@municipal.gov.in", description: "Manages traffic signals, public transport, parking zones, and vehicle licensing." },
  { name: "Health Department", routingKeywords: ["health", "hospital", "clinic", "doctor", "medical", "disease"], autoAssign: false, priorityEscalationDays: 1, officerCount: 6, head: "Dr. Anita Singh", email: "health@municipal.gov.in", description: "Handles public health facilities, disease control, medical camps, and health inspections." },
];

/* ───────── Component ───────── */

type ModalType = "total-grievances" | "pending-cases" | "resolved-cases" | "avg-resolution" | "active-officers" | "departments" | "high-priority" | "manage-officers" | "officer-detail" | "department-settings" | "department-detail" | "grievance-detail" | null;

export default function AdminDashboard() {
  const { toast } = useToast();
  const { grievances } = useGrievances();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentConfig | null>(null);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

  const totalPending = departmentStats.reduce((acc, d) => acc + d.pending, 0);
  const totalResolved = departmentStats.reduce((acc, d) => acc + d.resolved, 0);
  const avgResolutionTime = (departmentStats.reduce((acc, d) => acc + d.avgDays, 0) / departmentStats.length).toFixed(1);
  const highPriorityGrievances = grievances.filter(g => g.urgency === "high");

  const handleGenerateReport = () => {
    const deptData = departmentStats.map((d) => ({
      Department: d.name,
      "Pending Cases": d.pending,
      "Resolved Cases": d.resolved,
      "Avg Resolution Days": d.avgDays,
      Status: d.avgDays <= 2 ? "Excellent" : d.avgDays <= 3.5 ? "Good" : "Needs Attention",
    }));
    downloadCSV(deptData, `SmartGriev_Department_Report_${new Date().toISOString().split("T")[0]}`);
    const grievanceData = grievances.map((g) => ({
      "Case ID": g.id,
      Title: g.title,
      Category: g.category,
      Department: g.department,
      Status: g.status,
      Urgency: g.urgency,
      "Submitted Date": g.submittedAt.toLocaleDateString(),
      "Last Updated": g.updatedAt.toLocaleDateString(),
      Description: g.description,
    }));
    downloadCSV(grievanceData, `SmartGriev_Grievances_Report_${new Date().toISOString().split("T")[0]}`);
    toast({ title: "Reports Downloaded", description: "Department performance and grievance reports have been exported as CSV files." });
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedOfficer(null);
    setSelectedDepartment(null);
    setSelectedGrievance(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">System-wide analytics and department overview</p>
          </div>

          {/* Key Metrics — ALL clickable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Grievances" value={totalPending + totalResolved} description="All time submissions" icon={FileText} variant="primary" trend={{ value: 12, positive: true }} onClick={() => setModalType("total-grievances")} />
            <StatCard title="Pending Cases" value={totalPending} description="Awaiting resolution" icon={Clock} variant="warning" onClick={() => setModalType("pending-cases")} />
            <StatCard title="Resolved Cases" value={totalResolved} description="Successfully closed" icon={CheckCircle2} variant="success" trend={{ value: 8, positive: true }} onClick={() => setModalType("resolved-cases")} />
            <StatCard title="Avg. Resolution" value={`${avgResolutionTime} days`} description="Average time to resolve" icon={TrendingUp} variant="secondary" onClick={() => setModalType("avg-resolution")} />
          </div>

          {/* Secondary Stats — ALL clickable */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Active Officers" value={mockOfficers.filter(o => o.status === "active").length} description="Handling cases" icon={Users} onClick={() => setModalType("manage-officers")} />
            <StatCard title="Departments" value={departmentStats.length} description="Connected departments" icon={Building2} onClick={() => setModalType("department-settings")} />
            <StatCard title="High Priority" value={highPriorityGrievances.length || 15} description="Require immediate attention" icon={AlertTriangle} variant="warning" onClick={() => setModalType("high-priority")} />
          </div>

          {/* Department Performance Table — rows clickable */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Pending</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Resolved</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Avg. Days</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentStats.map((dept) => {
                      const config = mockDepartmentConfigs.find(d => d.name === dept.name);
                      return (
                        <tr key={dept.name} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => { setSelectedDepartment(config || null); setModalType("department-detail"); }}>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></div>
                              <span className="font-medium">{dept.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center"><Badge variant={dept.pending > 20 ? "urgent" : dept.pending > 10 ? "warning" : "success"}>{dept.pending}</Badge></td>
                          <td className="py-4 px-4 text-center font-medium">{dept.resolved}</td>
                          <td className="py-4 px-4 text-center"><span className={dept.avgDays > 3 ? "text-urgent" : "text-success"}>{dept.avgDays} days</span></td>
                          <td className="py-4 px-4 text-center"><Badge variant={dept.avgDays <= 2 ? "success" : dept.avgDays <= 3.5 ? "warning" : "urgent"}>{dept.avgDays <= 2 ? "Excellent" : dept.avgDays <= 3.5 ? "Good" : "Needs Attention"}</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-soft hover:shadow-card transition-shadow cursor-pointer group" onClick={handleGenerateReport}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center group-hover:scale-110 transition-transform"><Download className="w-6 h-6 text-primary" /></div>
                  <div><h3 className="font-semibold">Generate Report</h3><p className="text-sm text-muted-foreground">Download CSV reports</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft hover:shadow-card transition-shadow cursor-pointer group" onClick={() => setModalType("manage-officers")}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center group-hover:scale-110 transition-transform"><Users className="w-6 h-6 text-secondary" /></div>
                  <div><h3 className="font-semibold">Manage Officers</h3><p className="text-sm text-muted-foreground">Add or reassign staff</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft hover:shadow-card transition-shadow cursor-pointer group" onClick={() => setModalType("department-settings")}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success-light flex items-center justify-center group-hover:scale-110 transition-transform"><Building2 className="w-6 h-6 text-success" /></div>
                  <div><h3 className="font-semibold">Department Settings</h3><p className="text-sm text-muted-foreground">Configure routing rules</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* ════════════════════ MODALS ════════════════════ */}

      {/* Total Grievances Detail */}
      {modalType === "total-grievances" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2"><FileText className="w-6 h-6 text-primary" />Total Grievances — Detailed Report</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{totalPending + totalResolved} total cases across all departments</p>
                </div>
                <Button variant="ghost" size="icon" onClick={closeModal}><X className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-4 rounded-xl bg-primary-light"><p className="text-2xl font-bold">{totalPending + totalResolved}</p><p className="text-xs text-muted-foreground">Total</p></div>
                <div className="text-center p-4 rounded-xl bg-warning-light"><p className="text-2xl font-bold text-warning-foreground">{totalPending}</p><p className="text-xs text-muted-foreground">Pending</p></div>
                <div className="text-center p-4 rounded-xl bg-success-light"><p className="text-2xl font-bold text-success">{totalResolved}</p><p className="text-xs text-muted-foreground">Resolved</p></div>
                <div className="text-center p-4 rounded-xl bg-muted"><p className="text-2xl font-bold">{((totalResolved / (totalPending + totalResolved)) * 100).toFixed(1)}%</p><p className="text-xs text-muted-foreground">Resolution Rate</p></div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Breakdown by Department</h3>
                {departmentStats.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-primary" />
                      <span className="font-medium">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">{dept.pending + dept.resolved} total</span>
                      <Badge variant="warning">{dept.pending} pending</Badge>
                      <Badge variant="success">{dept.resolved} resolved</Badge>
                    </div>
                  </div>
                ))}
              </div>
              {/* All grievances list */}
              <div className="space-y-3">
                <h3 className="font-semibold">Recent Grievances</h3>
                {grievances.slice(0, 5).map((g) => (
                  <div key={g.id} className="p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => { setSelectedGrievance(g); setModalType("grievance-detail"); }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{g.title}</p>
                        <p className="text-xs text-muted-foreground">{g.id} • {g.department} • {g.submittedAt.toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={g.status === "resolved" ? "success" : g.status === "progress" ? "secondary" : g.status === "review" ? "review" : "default"}>{g.status}</Badge>
                        <Badge variant={g.urgency === "high" ? "urgent" : g.urgency === "medium" ? "warning" : "success"}>{g.urgency}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending Cases Detail */}
      {modalType === "pending-cases" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2"><Clock className="w-6 h-6 text-warning" />Pending Cases — Detailed Report</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{totalPending} cases awaiting resolution</p>
                </div>
                <Button variant="ghost" size="icon" onClick={closeModal}><X className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Pending by Department</h3>
                {departmentStats.sort((a, b) => b.pending - a.pending).map((dept) => (
                  <div key={dept.name} className="p-4 rounded-xl bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{dept.name}</span>
                      <Badge variant={dept.pending > 20 ? "urgent" : dept.pending > 10 ? "warning" : "success"}>{dept.pending} pending</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className={`h-2 rounded-full ${dept.pending > 20 ? "bg-urgent" : dept.pending > 10 ? "bg-warning" : "bg-success"}`} style={{ width: `${(dept.pending / 35) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Avg resolution: {dept.avgDays} days • {dept.resolved} resolved historically</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Pending Grievances</h3>
                {grievances.filter(g => g.status !== "resolved").slice(0, 5).map((g) => (
                  <div key={g.id} className="p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => { setSelectedGrievance(g); setModalType("grievance-detail"); }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{g.title}</p>
                        <p className="text-xs text-muted-foreground">{g.id} • {g.department}</p>
                      </div>
                      <Badge variant={g.urgency === "high" ? "urgent" : g.urgency === "medium" ? "warning" : "success"}>{g.urgency}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resolved Cases Detail */}
      {modalType === "resolved-cases" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-success" />Resolved Cases — Detailed Report</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{totalResolved} cases successfully closed</p>
                </div>
                <Button variant="ghost" size="icon" onClick={closeModal}><X className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 rounded-xl bg-success-light"><p className="text-2xl font-bold text-success">{totalResolved}</p><p className="text-xs text-muted-foreground">Total Resolved</p></div>
                <div className="text-center p-4 rounded-xl bg-muted"><p className="text-2xl font-bold">{((totalResolved / (totalPending + totalResolved)) * 100).toFixed(1)}%</p><p className="text-xs text-muted-foreground">Resolution Rate</p></div>
                <div className="text-center p-4 rounded-xl bg-primary-light"><p className="text-2xl font-bold">{avgResolutionTime}d</p><p className="text-xs text-muted-foreground">Avg Time</p></div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Resolved by Department</h3>
                {departmentStats.sort((a, b) => b.resolved - a.resolved).map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-success" />
                      <span className="font-medium">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-bold text-success">{dept.resolved}</span>
                      <span className="text-muted-foreground">in avg {dept.avgDays} days</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Recently Resolved</h3>
                {grievances.filter(g => g.status === "resolved").slice(0, 5).map((g) => (
                  <div key={g.id} className="p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => { setSelectedGrievance(g); setModalType("grievance-detail"); }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{g.title}</p>
                        <p className="text-xs text-muted-foreground">{g.id} • {g.department} • Resolved {g.updatedAt.toLocaleDateString()}</p>
                      </div>
                      <Badge variant="success">Resolved</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Avg Resolution Time Detail */}
      {modalType === "avg-resolution" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2"><TrendingUp className="w-6 h-6 text-secondary" />Resolution Time — Detailed Report</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Average time to resolve: {avgResolutionTime} days</p>
                </div>
                <Button variant="ghost" size="icon" onClick={closeModal}><X className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Resolution Time by Department</h3>
                {departmentStats.sort((a, b) => a.avgDays - b.avgDays).map((dept) => (
                  <div key={dept.name} className="p-4 rounded-xl bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{dept.name}</span>
                      <span className={`font-bold ${dept.avgDays <= 2 ? "text-success" : dept.avgDays <= 3.5 ? "text-warning-foreground" : "text-urgent"}`}>{dept.avgDays} days</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className={`h-3 rounded-full ${dept.avgDays <= 2 ? "bg-success" : dept.avgDays <= 3.5 ? "bg-warning" : "bg-urgent"}`} style={{ width: `${(dept.avgDays / 5) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{dept.resolved} resolved</span>
                      <Badge variant={dept.avgDays <= 2 ? "success" : dept.avgDays <= 3.5 ? "warning" : "urgent"} className="text-xs">{dept.avgDays <= 2 ? "Excellent" : dept.avgDays <= 3.5 ? "Good" : "Needs Attention"}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* High Priority Detail */}
      {modalType === "high-priority" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-urgent" />High Priority Cases — Detailed Report</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{highPriorityGrievances.length || 15} cases requiring immediate attention</p>
                </div>
                <Button variant="ghost" size="icon" onClick={closeModal}><X className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 rounded-xl bg-urgent-light"><p className="text-2xl font-bold text-urgent">{highPriorityGrievances.length || 15}</p><p className="text-xs text-muted-foreground">High Priority</p></div>
                <div className="text-center p-4 rounded-xl bg-warning-light"><p className="text-2xl font-bold text-warning-foreground">{grievances.filter(g => g.urgency === "medium").length || 38}</p><p className="text-xs text-muted-foreground">Medium Priority</p></div>
                <div className="text-center p-4 rounded-xl bg-success-light"><p className="text-2xl font-bold text-success">{grievances.filter(g => g.urgency === "low").length || 40}</p><p className="text-xs text-muted-foreground">Low Priority</p></div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">High Priority Grievances</h3>
                {(highPriorityGrievances.length > 0 ? highPriorityGrievances : grievances).slice(0, 6).map((g) => (
                  <div key={g.id} className="p-3 rounded-lg border border-urgent/20 bg-urgent-light/30 hover:bg-urgent-light/60 cursor-pointer transition-colors" onClick={() => { setSelectedGrievance(g); setModalType("grievance-detail"); }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{g.title}</p>
                        <p className="text-xs text-muted-foreground">{g.id} • {g.department} • {g.submittedAt.toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={g.status === "resolved" ? "success" : g.status === "progress" ? "secondary" : "default"}>{g.status}</Badge>
                        <Badge variant="urgent"><AlertTriangle className="w-3 h-3 mr-1" />{g.urgency}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manage Officers Modal */}
      {modalType === "manage-officers" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2"><Users className="w-6 h-6 text-primary" />Manage Officers</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{mockOfficers.length} officers across {departmentStats.length} departments</p>
                </div>
                <Button variant="ghost" size="icon" onClick={closeModal}><X className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-success-light"><p className="text-2xl font-bold text-success">{mockOfficers.filter(o => o.status === "active").length}</p><p className="text-xs text-muted-foreground">Active</p></div>
                <div className="text-center p-3 rounded-lg bg-warning-light"><p className="text-2xl font-bold text-warning-foreground">{mockOfficers.filter(o => o.status === "on-leave").length}</p><p className="text-xs text-muted-foreground">On Leave</p></div>
                <div className="text-center p-3 rounded-lg bg-muted"><p className="text-2xl font-bold">{mockOfficers.reduce((s, o) => s + o.activeCases, 0)}</p><p className="text-xs text-muted-foreground">Active Cases</p></div>
              </div>
              <div className="space-y-3">
                {mockOfficers.map((officer) => (
                  <div key={officer.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border hover:shadow-soft transition-all cursor-pointer" onClick={() => { setSelectedOfficer(officer); setModalType("officer-detail"); }}>
                    <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold shrink-0">{officer.name.split(" ").slice(1).map(n => n[0]).join("").slice(0, 2)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">{officer.name}</p>
                        <Badge variant={officer.status === "active" ? "success" : "warning"} className="text-xs">{officer.status === "active" ? "Active" : "On Leave"}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{officer.department} • {officer.role}</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center"><p className="font-bold">{officer.activeCases}</p><p className="text-xs text-muted-foreground">Active</p></div>
                      <div className="text-center"><p className="font-bold">{officer.resolvedTotal}</p><p className="text-xs text-muted-foreground">Resolved</p></div>
                      <div className="text-center"><p className="font-bold">{officer.avgRating}</p><p className="text-xs text-muted-foreground">Rating</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Officer Detail Modal */}
      {modalType === "officer-detail" && selectedOfficer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold text-lg">{selectedOfficer.name.split(" ").slice(1).map(n => n[0]).join("").slice(0, 2)}</div>
                  <div><CardTitle className="text-xl">{selectedOfficer.name}</CardTitle><p className="text-sm text-muted-foreground">{selectedOfficer.role}</p></div>
                </div>
                <Button variant="ghost" size="icon" onClick={closeModal}><X className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant={selectedOfficer.status === "active" ? "success" : "warning"}>{selectedOfficer.status === "active" ? "Active" : "On Leave"}</Badge>
                <Badge variant="outline"><Hash className="w-3 h-3 mr-1" />{selectedOfficer.id}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"><Mail className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium text-sm">{selectedOfficer.email}</p></div></div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"><Phone className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium text-sm">{selectedOfficer.phone}</p></div></div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"><Building2 className="w-5 h-5 text-secondary" /><div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium text-sm">{selectedOfficer.department}</p></div></div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"><Clock className="w-5 h-5 text-secondary" /><div><p className="text-xs text-muted-foreground">Joined</p><p className="font-medium text-sm">{selectedOfficer.joinedDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p></div></div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Performance</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 rounded-xl bg-muted/30"><p className="text-2xl font-bold text-primary">{selectedOfficer.activeCases}</p><p className="text-xs text-muted-foreground">Active Cases</p></div>
                  <div className="text-center p-4 rounded-xl bg-muted/30"><p className="text-2xl font-bold text-success">{selectedOfficer.resolvedTotal}</p><p className="text-xs text-muted-foreground">Total Resolved</p></div>
                  <div className="text-center p-4 rounded-xl bg-muted/30"><p className="text-2xl font-bold text-warning-foreground">{selectedOfficer.avgRating}/5</p><p className="text-xs text-muted-foreground">Avg Rating</p></div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => { toast({ title: "Cases Reassigned", description: `Cases reassigned for ${selectedOfficer.name}` }); closeModal(); }}>Reassign Cases</Button>
                <Button variant="outline" onClick={() => { setSelectedOfficer(null); setModalType("manage-officers"); }}>Back to List</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Department Settings Modal */}
      {modalType === "department-settings" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2"><Settings className="w-6 h-6 text-primary" />Department Settings</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Configure routing rules & escalation policies</p>
                </div>
                <Button variant="ghost" size="icon" onClick={closeModal}><X className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockDepartmentConfigs.map((dept) => (
                <div key={dept.name} className="p-4 rounded-xl border hover:shadow-soft transition-all cursor-pointer" onClick={() => { setSelectedDepartment(dept); setModalType("department-detail"); }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></div>
                      <div><p className="font-semibold">{dept.name}</p><p className="text-xs text-muted-foreground">Head: {dept.head}</p></div>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant={dept.autoAssign ? "success" : "outline"}><ToggleLeft className="w-3 h-3 mr-1" />Auto-Assign: {dept.autoAssign ? "ON" : "OFF"}</Badge>
                      <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Escalate: {dept.priorityEscalationDays}d</Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {dept.routingKeywords.map((kw) => (<span key={kw} className="px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground">{kw}</span>))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Department Detail Modal */}
      {modalType === "department-detail" && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center"><Building2 className="w-6 h-6 text-primary-foreground" /></div>
                  <div><CardTitle className="text-xl">{selectedDepartment.name}</CardTitle><p className="text-sm text-muted-foreground">Department Configuration</p></div>
                </div>
                <Button variant="ghost" size="icon" onClick={closeModal}><X className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />About</h3>
                <p className="text-muted-foreground text-sm leading-relaxed bg-muted/30 p-4 rounded-xl">{selectedDepartment.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"><Shield className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">Department Head</p><p className="font-medium text-sm">{selectedDepartment.head}</p></div></div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"><Mail className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">Contact</p><p className="font-medium text-sm">{selectedDepartment.email}</p></div></div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"><Users className="w-5 h-5 text-secondary" /><div><p className="text-xs text-muted-foreground">Officers Assigned</p><p className="font-medium text-sm">{selectedDepartment.officerCount} officers</p></div></div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"><Clock className="w-5 h-5 text-secondary" /><div><p className="text-xs text-muted-foreground">Escalation Threshold</p><p className="font-medium text-sm">{selectedDepartment.priorityEscalationDays} days</p></div></div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Routing Configuration</h3>
                <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm font-medium">Auto-Assign</span><Badge variant={selectedDepartment.autoAssign ? "success" : "outline"}>{selectedDepartment.autoAssign ? "Enabled" : "Disabled"}</Badge></div>
                  <div><p className="text-sm font-medium mb-2">Routing Keywords</p><div className="flex flex-wrap gap-2">{selectedDepartment.routingKeywords.map((kw) => (<Badge key={kw} variant="outline" className="text-xs">{kw}</Badge>))}</div></div>
                </div>
              </div>
              {(() => {
                const stats = departmentStats.find(d => d.name === selectedDepartment.name); if (!stats) return null; return (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Current Performance</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-4 rounded-xl bg-muted/30"><p className="text-2xl font-bold text-warning-foreground">{stats.pending}</p><p className="text-xs text-muted-foreground">Pending</p></div>
                      <div className="text-center p-4 rounded-xl bg-muted/30"><p className="text-2xl font-bold text-success">{stats.resolved}</p><p className="text-xs text-muted-foreground">Resolved</p></div>
                      <div className="text-center p-4 rounded-xl bg-muted/30"><p className={`text-2xl font-bold ${stats.avgDays > 3 ? "text-urgent" : "text-success"}`}>{stats.avgDays}d</p><p className="text-xs text-muted-foreground">Avg Days</p></div>
                    </div>
                  </div>);
              })()}
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => { toast({ title: "Settings Saved", description: `Settings for ${selectedDepartment.name} updated.` }); closeModal(); }}>Save Changes</Button>
                <Button variant="outline" onClick={() => { setSelectedDepartment(null); setModalType("department-settings"); }}>Back to List</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grievance Detail Modal (from clicking individual grievance rows) */}
      {modalType === "grievance-detail" && selectedGrievance && (
        <GrievanceDetailModal grievance={selectedGrievance} onClose={closeModal} />
      )}

      <Footer />
    </div>
  );
}
