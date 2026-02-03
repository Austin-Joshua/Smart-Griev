import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  BarChart3 
} from "lucide-react";

const departmentStats = [
  { name: "Public Works", pending: 24, resolved: 156, avgDays: 3.2 },
  { name: "Water Authority", pending: 18, resolved: 89, avgDays: 2.8 },
  { name: "Municipal Services", pending: 12, resolved: 234, avgDays: 1.5 },
  { name: "Transport Authority", pending: 31, resolved: 112, avgDays: 4.1 },
  { name: "Health Department", pending: 8, resolved: 67, avgDays: 2.2 },
];

export default function AdminDashboard() {
  const totalPending = departmentStats.reduce((acc, d) => acc + d.pending, 0);
  const totalResolved = departmentStats.reduce((acc, d) => acc + d.resolved, 0);
  const avgResolutionTime = (departmentStats.reduce((acc, d) => acc + d.avgDays, 0) / departmentStats.length).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">System-wide analytics and department overview</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Grievances"
              value={totalPending + totalResolved}
              description="All time submissions"
              icon={FileText}
              variant="primary"
              trend={{ value: 12, positive: true }}
            />
            <StatCard
              title="Pending Cases"
              value={totalPending}
              description="Awaiting resolution"
              icon={Clock}
              variant="warning"
            />
            <StatCard
              title="Resolved Cases"
              value={totalResolved}
              description="Successfully closed"
              icon={CheckCircle2}
              variant="success"
              trend={{ value: 8, positive: true }}
            />
            <StatCard
              title="Avg. Resolution"
              value={`${avgResolutionTime} days`}
              description="Average time to resolve"
              icon={TrendingUp}
              variant="secondary"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Active Officers"
              value={47}
              description="Handling cases"
              icon={Users}
            />
            <StatCard
              title="Departments"
              value={departmentStats.length}
              description="Connected departments"
              icon={Building2}
            />
            <StatCard
              title="High Priority"
              value={15}
              description="Require immediate attention"
              icon={AlertTriangle}
              variant="warning"
            />
          </div>

          {/* Department Overview */}
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
                    {departmentStats.map((dept) => (
                      <tr key={dept.name} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-medium">{dept.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant={dept.pending > 20 ? "urgent" : dept.pending > 10 ? "warning" : "success"}>
                            {dept.pending}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center font-medium">{dept.resolved}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={dept.avgDays > 3 ? "text-urgent" : "text-success"}>
                            {dept.avgDays} days
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant={dept.avgDays <= 2 ? "success" : dept.avgDays <= 3.5 ? "warning" : "urgent"}>
                            {dept.avgDays <= 2 ? "Excellent" : dept.avgDays <= 3.5 ? "Good" : "Needs Attention"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-soft hover:shadow-card transition-shadow cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Generate Report</h3>
                    <p className="text-sm text-muted-foreground">Export analytics data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft hover:shadow-card transition-shadow cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Manage Officers</h3>
                    <p className="text-sm text-muted-foreground">Add or reassign staff</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft hover:shadow-card transition-shadow cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success-light flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Department Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure routing rules</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
