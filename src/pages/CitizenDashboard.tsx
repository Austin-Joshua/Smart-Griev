import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { GrievanceCard, Grievance } from "@/components/GrievanceCard";
import { Link } from "react-router-dom";
import { Plus, Bell, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Mock data for demonstration
const mockGrievances: Grievance[] = [
  {
    id: "GRV-2024-001234",
    title: "Street Light Not Working on Main Road",
    description: "The street light near the intersection of Main Road and Park Avenue has been non-functional for the past two weeks, creating safety concerns for pedestrians.",
    category: "Infrastructure",
    department: "Public Works",
    status: "progress",
    urgency: "medium",
    submittedAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "GRV-2024-001230",
    title: "Water Supply Interruption",
    description: "Frequent water supply interruptions in the morning hours affecting daily routines. This has been ongoing for the past week.",
    category: "Utilities",
    department: "Water Authority",
    status: "review",
    urgency: "high",
    submittedAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "GRV-2024-001225",
    title: "Garbage Collection Delay",
    description: "Regular garbage collection has not occurred in our neighborhood for the past three days. Waste is accumulating and causing hygiene issues.",
    category: "Sanitation",
    department: "Municipal Services",
    status: "resolved",
    urgency: "medium",
    submittedAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-13"),
  },
  {
    id: "GRV-2024-001220",
    title: "Pothole on School Route",
    description: "Large pothole has developed on the road leading to the primary school. It's dangerous for children walking to school.",
    category: "Roads",
    department: "Transport Authority",
    status: "submitted",
    urgency: "high",
    submittedAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
];

const notifications = [
  { id: 1, message: "Your water supply grievance has been assigned to an officer", time: "2 hours ago", read: false },
  { id: 2, message: "Street light issue is now being worked on", time: "1 day ago", read: true },
  { id: 3, message: "Garbage collection grievance has been resolved", time: "3 days ago", read: true },
];

export default function CitizenDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold">My Grievances</h1>
              <p className="text-muted-foreground">Track and manage all your submitted cases</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-urgent text-urgent-foreground text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-card border rounded-xl shadow-elevated z-50 animate-scale-in">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${!notif.read ? "bg-primary-light/30" : ""}`}
                        >
                          <p className="text-sm">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Button asChild variant="hero">
                <Link to="/submit">
                  <Plus className="w-4 h-4" />
                  New Grievance
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl p-4 border shadow-soft">
              <p className="text-2xl font-bold font-heading">{mockGrievances.length}</p>
              <p className="text-sm text-muted-foreground">Total Cases</p>
            </div>
            <div className="bg-card rounded-xl p-4 border shadow-soft">
              <p className="text-2xl font-bold font-heading text-primary">{mockGrievances.filter(g => g.status === "progress").length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="bg-card rounded-xl p-4 border shadow-soft">
              <p className="text-2xl font-bold font-heading text-warning">{mockGrievances.filter(g => g.status === "review").length}</p>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </div>
            <div className="bg-card rounded-xl p-4 border shadow-soft">
              <p className="text-2xl font-bold font-heading text-success">{mockGrievances.filter(g => g.status === "resolved").length}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="cursor-pointer px-4 py-2">All</Badge>
            <Badge variant="outline" className="cursor-pointer px-4 py-2 hover:bg-muted">Submitted</Badge>
            <Badge variant="outline" className="cursor-pointer px-4 py-2 hover:bg-muted">Under Review</Badge>
            <Badge variant="outline" className="cursor-pointer px-4 py-2 hover:bg-muted">In Progress</Badge>
            <Badge variant="outline" className="cursor-pointer px-4 py-2 hover:bg-muted">Resolved</Badge>
          </div>

          {/* Grievances List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockGrievances.map((grievance) => (
              <GrievanceCard key={grievance.id} grievance={grievance} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
