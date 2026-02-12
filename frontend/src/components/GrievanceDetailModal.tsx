import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusTimeline } from "@/components/StatusTimeline";
import type { Grievance } from "@/types";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import {
    X,
    Calendar,
    Building2,
    AlertTriangle,
    Hash,
    Clock,
    FileText,
    User,
} from "lucide-react";

interface GrievanceDetailModalProps {
    grievance: Grievance;
    onClose: () => void;
}

const urgencyConfig = {
    low: { label: "Low Priority", variant: "success" as const, color: "text-success" },
    medium: { label: "Medium Priority", variant: "warning" as const, color: "text-warning" },
    high: { label: "High Priority", variant: "urgent" as const, color: "text-urgent" },
};

const statusLabels = {
    submitted: "Submitted",
    review: "Under Review",
    progress: "In Progress",
    resolved: "Resolved",
};

export function GrievanceDetailModal({ grievance, onClose }: GrievanceDetailModalProps) {
    const urgency = urgencyConfig[grievance.urgency];

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Hash className="w-4 h-4" />
                                <span className="font-mono font-medium">{grievance.id}</span>
                            </div>
                            <CardTitle className="text-xl md:text-2xl">{grievance.title}</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Status & Urgency Badges */}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant={grievance.status === "resolved" ? "success" : grievance.status === "progress" ? "secondary" : grievance.status === "review" ? "review" : "default"}>
                            {statusLabels[grievance.status]}
                        </Badge>
                        <Badge variant={urgency.variant}>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {urgency.label}
                        </Badge>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Description
                        </h3>
                        <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-xl">
                            {grievance.description}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <Building2 className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Department</p>
                                <p className="font-medium">{grievance.department}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <FileText className="w-5 h-5 text-secondary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Category</p>
                                <p className="font-medium">{grievance.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <Calendar className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Submitted On</p>
                                <p className="font-medium">{grievance.submittedAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <Clock className="w-5 h-5 text-secondary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Last Updated</p>
                                <p className="font-medium">{grievance.updatedAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Citizen Info */}
                    {(grievance.citizenName || grievance.citizenEmail) && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <User className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Submitted By</p>
                                <p className="font-medium">
                                    {grievance.citizenName || "Anonymous"}
                                    {grievance.citizenEmail && <span className="text-muted-foreground ml-2">({grievance.citizenEmail})</span>}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Status Timeline */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">Progress Timeline</h3>
                        <div className="bg-muted/20 p-6 rounded-xl">
                            <StatusTimeline currentStatus={grievance.status} />
                        </div>
                    </div>

                    {/* Feedback for Resolved */}
                    {grievance.status === "resolved" && (
                        <div className="space-y-3">
                            <h3 className="font-semibold">Rate This Resolution</h3>
                            <FeedbackWidget grievanceId={grievance.id} />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end pt-2">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
