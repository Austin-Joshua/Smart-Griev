import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Grievance } from "@/types";
import { MapPin, Calendar, User, Building2, AlertTriangle, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { FeedbackWidget } from "@/components/FeedbackWidget";

interface GrievanceDetailModalProps {
    grievance: Grievance;
    onClose: () => void;
}

export function GrievanceDetailModal({ grievance, onClose }: GrievanceDetailModalProps) {
    if (!grievance) return null;

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return "Invalid Date";
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <div className="flex items-center justify-between pr-8">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-sm px-2 py-1">#{grievance.id.slice(0, 8)}</Badge>
                            <DialogTitle className="text-xl">{grievance.category} Issue</DialogTitle>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant={grievance.status === "Resolved" ? "success" : grievance.status === "In Progress" ? "secondary" : grievance.status === "Rejected" ? "destructive" : "default"}>
                                {grievance.status}
                            </Badge>
                            <Badge variant={grievance.urgency === "Critical" ? "destructive" : grievance.urgency === "High" ? "urgent" : grievance.urgency === "Medium" ? "warning" : "success"}>
                                {grievance.urgency} Priority
                            </Badge>
                        </div>
                    </div>
                    <DialogDescription className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-4">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Filed {formatDate(grievance.created_at)}</span>
                        {grievance.department_name && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {grievance.department_name}</span>}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {/* Description Section */}
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Description</h3>
                            <div className="p-4 bg-muted/40 rounded-lg text-sm leading-relaxed">
                                {grievance.description}
                            </div>
                        </div>

                        {/* AI Analysis (if available) */}
                        {grievance.ai_analysis && (
                            <div className="space-y-3">
                                <h3 className="font-semibold flex items-center gap-2 text-primary"><span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">AI Insight</span> Analysis</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 border rounded-lg bg-card">
                                        <p className="text-xs text-muted-foreground mb-1">Summary</p>
                                        <p className="text-sm">{grievance.ai_analysis.summary}</p>
                                    </div>
                                    <div className="p-3 border rounded-lg bg-card">
                                        <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${grievance.ai_analysis.sentiment === 'Negative' ? 'bg-red-500' : 'bg-green-500'}`} />
                                            <p className="text-sm font-medium">{grievance.ai_analysis.sentiment}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Location & Media */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {grievance.location && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</h3>
                                    <p className="text-sm text-muted-foreground break-all">{grievance.location}</p>
                                    {/* Placeholder for map integration */}
                                    <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">Map Preview Unavailable</div>
                                </div>
                            )}

                            {grievance.image_url && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> Attachment</h3>
                                    <div className="relative aspect-video rounded-md overflow-hidden bg-muted border">
                                        <img src={grievance.image_url} alt="Grievance evidence" className="object-cover w-full h-full" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Timeline */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4" /> Activity Timeline</h3>
                            <div className="space-y-4 pl-2 border-l-2 border-muted ml-2">
                                {/* Creation Event */}
                                <div className="relative pl-6 pb-2">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                                    <p className="text-sm font-medium">Grievance Filed</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(grievance.created_at)}</p>
                                </div>

                                {/* Processed Timeline Events */}
                                {grievance.timeline?.map((event, index) => (
                                    <div key={index} className="relative pl-6 pb-2">
                                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-background ${event.event_type === 'Resolved' ? 'bg-green-500' : 'bg-blue-500'
                                            }`} />
                                        <p className="text-sm font-medium">{event.event_type} - <span className="font-normal text-muted-foreground">{event.description}</span></p>
                                        <p className="text-xs text-muted-foreground">{formatDate(event.created_at)}</p>
                                        {event.created_by && <p className="text-xs text-muted-foreground mt-0.5">by {event.created_by}</p>}
                                    </div>
                                ))}

                                {/* Current Status Indicator if no timeline */}
                                {(!grievance.timeline || grievance.timeline.length === 0) && (
                                    <div className="relative pl-6">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-muted border-4 border-background" />
                                        <p className="text-sm text-muted-foreground">No additional activity recorded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Feedback Section - Only shows if Resolved */}
                        {grievance.status === "Resolved" && (
                            <div className="pt-4">
                                <FeedbackWidget grievanceId={grievance.id} onSubmit={() => { }} />
                            </div>
                        )}

                    </div>
                </ScrollArea>
                <DialogFooter className="p-4 border-t bg-muted/20">
                    <Button onClick={onClose} variant="outline">Close Details</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
