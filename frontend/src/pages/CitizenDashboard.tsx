import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { GrievanceCard } from "@/components/GrievanceCard";
import { GrievanceDetailModal } from "@/components/GrievanceDetailModal";
import { Link } from "react-router-dom";
import { Plus, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useGrievances } from "@/contexts/GrievanceContext";
import type { Grievance } from "@/types";

const notifications = [
  { id: 1, message: "Your water supply grievance has been assigned to an officer", time: "2 hours ago", read: false },
  { id: 2, message: "Street light issue is now being worked on", time: "1 day ago", read: true },
  { id: 3, message: "Garbage collection grievance has been resolved", time: "3 days ago", read: true },
];

export default function CitizenDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const unreadCount = notifications.filter(n => !n.read).length;
  const { grievances } = useGrievances();

  const filteredGrievances = activeFilter === "all"
    ? grievances
    : grievances.filter(g => g.status === activeFilter);

  const filters = [
    { key: "all", label: "All" },
    { key: "submitted", label: "Submitted" },
    { key: "review", label: "Under Review" },
    { key: "progress", label: "In Progress" },
    { key: "resolved", label: "Resolved" },
  ];

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
              <p className="text-2xl font-bold font-heading">{grievances.length}</p>
              <p className="text-sm text-muted-foreground">Total Cases</p>
            </div>
            <div className="bg-card rounded-xl p-4 border shadow-soft">
              <p className="text-2xl font-bold font-heading text-primary">{grievances.filter(g => g.status === "progress").length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="bg-card rounded-xl p-4 border shadow-soft">
              <p className="text-2xl font-bold font-heading text-warning">{grievances.filter(g => g.status === "review").length}</p>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </div>
            <div className="bg-card rounded-xl p-4 border shadow-soft">
              <p className="text-2xl font-bold font-heading text-success">{grievances.filter(g => g.status === "resolved").length}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <Badge
                key={f.key}
                variant={activeFilter === f.key ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 hover:bg-muted"
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
                {f.key !== "all" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({grievances.filter(g => g.status === f.key).length})
                  </span>
                )}
              </Badge>
            ))}
          </div>

          {/* Grievances List */}
          {filteredGrievances.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No grievances found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredGrievances.map((grievance) => (
                <GrievanceCard
                  key={grievance.id}
                  grievance={grievance}
                  onClick={() => setSelectedGrievance(grievance)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedGrievance && (
        <GrievanceDetailModal
          grievance={selectedGrievance}
          onClose={() => setSelectedGrievance(null)}
        />
      )}

      <Footer />
    </div>
  );
}
