import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusTimeline } from "@/components/StatusTimeline";
import {
  ClipboardList,
  AlertTriangle,
  Clock,
  CheckCircle2,
  MessageSquare,
  Building2,
  User,
  X,
  Hash,
  Calendar,
  FileText,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AssignedGrievance {
  id: string;
  title: string;
  description: string;
  category: string;
  citizen: string;
  citizenPhone: string;
  citizenEmail: string;
  location: string;
  status: "review" | "progress";
  urgency: "low" | "medium" | "high";
  submittedAt: Date;
  updatedAt: Date;
  department: string;
  notes: string[];
}

const mockAssignedGrievances: AssignedGrievance[] = [
  {
    id: "GRV-2024-001234",
    title: "Street Light Not Working on Main Road",
    description: "The street light near the intersection of Main Road and Park Avenue has been non-functional for the past two weeks. This creates a safety hazard for pedestrians and motorists, especially at night. Residents in the area have reported near-miss incidents due to poor visibility.",
    category: "Infrastructure",
    citizen: "Rahul Sharma",
    citizenPhone: "+91 98765 43210",
    citizenEmail: "rahul.s@email.com",
    location: "Main Road & Park Avenue Intersection, Ward 12",
    status: "progress",
    urgency: "medium",
    submittedAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-18"),
    department: "Public Works",
    notes: ["Site inspection completed on Jan 16", "Replacement parts ordered"],
  },
  {
    id: "GRV-2024-001230",
    title: "Water Supply Interruption in Block C",
    description: "Frequent water supply interruptions in the morning hours (6 AM–9 AM) affecting daily routines of over 200 families. The issue started after pipeline maintenance work was done last week. The water pressure is extremely low even when supply is available.",
    category: "Utilities",
    citizen: "Priya Mehta",
    citizenPhone: "+91 87654 32109",
    citizenEmail: "priya.m@email.com",
    location: "Greenview Apartments, Block C, Sector 15",
    status: "review",
    urgency: "high",
    submittedAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    department: "Water Authority",
    notes: [],
  },
  {
    id: "GRV-2024-001220",
    title: "Pothole on School Route",
    description: "Large pothole (approx 3ft wide) has developed on the road leading to the primary school near Gate No. 2. Several children have fallen while cycling to school. The pothole fills with water during rain making it invisible and extremely dangerous.",
    category: "Roads",
    citizen: "Amit Kumar",
    citizenPhone: "+91 76543 21098",
    citizenEmail: "amit.k@email.com",
    location: "Near Model Primary School, Gate 2, MG Road",
    status: "review",
    urgency: "high",
    submittedAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-13"),
    department: "Transport Authority",
    notes: ["Flagged as safety concern near school zone"],
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

  type StatFilter = "all" | "high-priority" | "pending-review" | "resolved" | null;
  const [statFilter, setStatFilter] = useState<StatFilter>(null);

  const highPriority = mockAssignedGrievances.filter(g => g.urgency === "high");
  const pendingReview = mockAssignedGrievances.filter(g => g.status === "review");

  const statFilterTitle = { "all": "All Assigned Grievances", "high-priority": "High Priority Grievances", "pending-review": "Pending Review Grievances", "resolved": "Recently Resolved Grievances" };
  const filteredList = statFilter === "high-priority" ? highPriority : statFilter === "pending-review" ? pendingReview : mockAssignedGrievances;

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

          {/* Stats — ALL clickable */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-soft cursor-pointer hover:shadow-card transition-all" onClick={() => setStatFilter("all")}>
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
            <Card className="shadow-soft bg-urgent-light border-urgent/20 cursor-pointer hover:shadow-card transition-all" onClick={() => setStatFilter("high-priority")}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold font-heading text-urgent">{highPriority.length}</p>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-urgent opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-warning-light border-warning/20 cursor-pointer hover:shadow-card transition-all" onClick={() => setStatFilter("pending-review")}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold font-heading text-warning-foreground">{pendingReview.length}</p>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                  <Clock className="w-8 h-8 text-warning opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-success-light border-success/20 cursor-pointer hover:shadow-card transition-all" onClick={() => setStatFilter("resolved")}>
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

          {/* Stat Filter Detail Modal */}
          {statFilter && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={(e) => e.target === e.currentTarget && setStatFilter(null)}>
              <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{statFilterTitle[statFilter]}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{statFilter === "resolved" ? "12 cases resolved this week" : `${filteredList.length} case(s) found`}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setStatFilter(null)}><X className="w-5 h-5" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary stats */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 rounded-lg bg-muted/30"><p className="text-xl font-bold">{mockAssignedGrievances.length}</p><p className="text-xs text-muted-foreground">Total</p></div>
                    <div className="text-center p-3 rounded-lg bg-urgent-light"><p className="text-xl font-bold text-urgent">{highPriority.length}</p><p className="text-xs text-muted-foreground">High</p></div>
                    <div className="text-center p-3 rounded-lg bg-warning-light"><p className="text-xl font-bold text-warning-foreground">{pendingReview.length}</p><p className="text-xs text-muted-foreground">Review</p></div>
                    <div className="text-center p-3 rounded-lg bg-success-light"><p className="text-xl font-bold text-success">12</p><p className="text-xs text-muted-foreground">Resolved</p></div>
                  </div>

                  {statFilter === "resolved" ? (
                    <div className="space-y-3">
                      <h3 className="font-semibold">Recently Resolved Cases</h3>
                      {[
                        { id: "GRV-2024-001210", title: "Broken Sidewalk on Elm Street", dept: "Public Works", date: "Jan 20, 2024", days: 3 },
                        { id: "GRV-2024-001205", title: "Faulty Traffic Light at Junction 5", dept: "Transport Authority", date: "Jan 19, 2024", days: 2 },
                        { id: "GRV-2024-001200", title: "Overflowing Garbage Bin in Ward 7", dept: "Municipal Services", date: "Jan 18, 2024", days: 1 },
                        { id: "GRV-2024-001195", title: "Leaking Fire Hydrant", dept: "Water Authority", date: "Jan 17, 2024", days: 4 },
                        { id: "GRV-2024-001190", title: "Damaged Park Bench", dept: "Municipal Services", date: "Jan 16, 2024", days: 2 },
                      ].map((item) => (
                        <div key={item.id} className="p-4 rounded-xl bg-muted/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.id} • {item.dept} • Resolved {item.date}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="success">Resolved</Badge>
                              <span className="text-xs text-muted-foreground">{item.days}d</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-semibold">Grievance Details</h3>
                      {filteredList.map((g) => (
                        <div key={g.id} className="p-4 rounded-xl border hover:shadow-soft cursor-pointer transition-all" onClick={() => { setStatFilter(null); setSelectedGrievance(g); }}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold">{g.title}</p>
                            <div className="flex gap-2">
                              <Badge variant={g.status === "review" ? "review" : "secondary"}>{g.status === "review" ? "Under Review" : "In Progress"}</Badge>
                              <Badge variant={urgencyConfig[g.urgency].variant}>{urgencyConfig[g.urgency].label}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{g.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{g.id}</span>
                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{g.citizen}</span>
                            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{g.department}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{g.location}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{g.submittedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

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

          {/* Detailed Report Modal */}
          {selectedGrievance && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
              onClick={(e) => e.target === e.currentTarget && setSelectedGrievance(null)}
            >
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Hash className="w-4 h-4" />
                        <span className="font-mono font-medium">{selectedGrievance.id}</span>
                      </div>
                      <CardTitle className="text-xl md:text-2xl">{selectedGrievance.title}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedGrievance(null)} className="shrink-0">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Status & Urgency */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={selectedGrievance.status === "review" ? "review" : "secondary"}>
                      {selectedGrievance.status === "review" ? "Under Review" : "In Progress"}
                    </Badge>
                    <Badge variant={urgencyConfig[selectedGrievance.urgency].variant}>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {urgencyConfig[selectedGrievance.urgency].label} Priority
                    </Badge>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Full Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-xl">
                      {selectedGrievance.description}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Building2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="font-medium">{selectedGrievance.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <FileText className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Category</p>
                        <p className="font-medium">{selectedGrievance.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Submitted On</p>
                        <p className="font-medium">{selectedGrievance.submittedAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Clock className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{selectedGrievance.updatedAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">{selectedGrievance.location}</p>
                    </div>
                  </div>

                  {/* Citizen Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Citizen Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p className="font-medium">{selectedGrievance.citizen}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium">{selectedGrievance.citizenPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity / Officer Notes */}
                  {selectedGrievance.notes.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Officer Notes
                      </h3>
                      <div className="space-y-2">
                        {selectedGrievance.notes.map((note, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                            <p className="text-sm text-muted-foreground">{note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress Timeline */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Progress Timeline</h3>
                    <div className="bg-muted/20 p-6 rounded-xl">
                      <StatusTimeline currentStatus={selectedGrievance.status} />
                    </div>
                  </div>

                  {/* Update Actions */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold">Update This Grievance</h3>
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Change Status</label>
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
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUpdateNote(e.target.value)}
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
