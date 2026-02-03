import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ClipboardList, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  MessageSquare,
  Building2,
  User
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AssignedGrievance {
  id: string;
  title: string;
  description: string;
  category: string;
  citizen: string;
  status: "review" | "progress";
  urgency: "low" | "medium" | "high";
  submittedAt: Date;
  department: string;
}

const mockAssignedGrievances: AssignedGrievance[] = [
  {
    id: "GRV-2024-001234",
    title: "Street Light Not Working on Main Road",
    description: "The street light near the intersection of Main Road and Park Avenue has been non-functional for the past two weeks.",
    category: "Infrastructure",
    citizen: "Rahul S.",
    status: "progress",
    urgency: "medium",
    submittedAt: new Date("2024-01-15"),
    department: "Public Works",
  },
  {
    id: "GRV-2024-001230",
    title: "Water Supply Interruption",
    description: "Frequent water supply interruptions in the morning hours affecting daily routines.",
    category: "Utilities",
    citizen: "Priya M.",
    status: "review",
    urgency: "high",
    submittedAt: new Date("2024-01-14"),
    department: "Water Authority",
  },
  {
    id: "GRV-2024-001220",
    title: "Pothole on School Route",
    description: "Large pothole has developed on the road leading to the primary school.",
    category: "Roads",
    citizen: "Amit K.",
    status: "review",
    urgency: "high",
    submittedAt: new Date("2024-01-12"),
    department: "Transport Authority",
  },
];

const urgencyConfig = {
  low: { label: "Low", variant: "success" as const, icon: Clock },
  medium: { label: "Medium", variant: "warning" as const, icon: AlertTriangle },
  high: { label: "High", variant: "urgent" as const, icon: AlertTriangle },
};

export default function OfficerDashboard() {
  const [selectedGrievance, setSelectedGrievance] = useState<AssignedGrievance | null>(null);
  const [updateNote, setUpdateNote] = useState("");
  const { toast } = useToast();

  const handleStatusUpdate = (newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Grievance ${selectedGrievance?.id} has been updated to ${newStatus}.`,
    });
    setSelectedGrievance(null);
    setUpdateNote("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold">Officer Dashboard</h1>
              <p className="text-muted-foreground">Manage assigned grievances</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Building2 className="w-3 h-3" />
                Public Works Department
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold font-heading">{mockAssignedGrievances.length}</p>
                    <p className="text-sm text-muted-foreground">Assigned</p>
                  </div>
                  <ClipboardList className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-urgent-light border-urgent/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold font-heading text-urgent">{mockAssignedGrievances.filter(g => g.urgency === "high").length}</p>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-urgent opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-warning-light border-warning/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold font-heading text-warning-foreground">{mockAssignedGrievances.filter(g => g.status === "review").length}</p>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                  <Clock className="w-8 h-8 text-warning opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-success-light border-success/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold font-heading text-success">12</p>
                    <p className="text-sm text-muted-foreground">Resolved (This Week)</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-success opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grievances Table */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Assigned Grievances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAssignedGrievances.map((grievance) => {
                  const urgency = urgencyConfig[grievance.urgency];
                  return (
                    <div
                      key={grievance.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border hover:shadow-soft transition-all cursor-pointer group"
                      onClick={() => setSelectedGrievance(grievance)}
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <Badge variant={urgency.variant} className="shrink-0">
                            <urgency.icon className="w-3 h-3 mr-1" />
                            {urgency.label}
                          </Badge>
                          <div>
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {grievance.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {grievance.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {grievance.citizen}
                          </span>
                          <span>{grievance.id}</span>
                          <span>{grievance.submittedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-4">
                        <Badge variant={grievance.status === "review" ? "review" : "progress"}>
                          {grievance.status === "review" ? "Under Review" : "In Progress"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Update Modal/Panel */}
          {selectedGrievance && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
              <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Update Grievance</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedGrievance.id}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedGrievance(null)}>
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">{selectedGrievance.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedGrievance.description}</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Update Status</label>
                    <Select onValueChange={handleStatusUpdate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="review">Under Review</SelectItem>
                        <SelectItem value="progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Add Note for Citizen
                    </label>
                    <Textarea
                      placeholder="Provide an update for the citizen..."
                      value={updateNote}
                      onChange={(e) => setUpdateNote(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={() => handleStatusUpdate("progress")}>
                      Save Update
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedGrievance(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
