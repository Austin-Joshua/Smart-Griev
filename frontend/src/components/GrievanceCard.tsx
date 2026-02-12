import { Grievance } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, FileText, AlertTriangle } from "lucide-react";

interface GrievanceCardProps {
    grievance: Grievance;
    onClick?: () => void;
}

export function GrievanceCard({ grievance, onClick }: GrievanceCardProps) {
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return "Invalid Date";
        }
    };

    return (
        <Card className="shadow-sm hover:shadow-soft transition-shadow cursor-pointer border-l-4"
            style={{ borderLeftColor: grievance.status === "Resolved" ? "hsl(142, 72%, 29%)" : grievance.urgency === "High" ? "hsl(0, 84%, 60%)" : "hsl(215, 20%, 65%)" }}
            onClick={onClick}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                        <Badge variant={grievance.status === "Resolved" ? "success" : grievance.status === "In Progress" ? "secondary" : "default"}>
                            {grievance.status}
                        </Badge>
                        {grievance.urgency === "High" || grievance.urgency === "Critical" ? (
                            <Badge variant="urgent" className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {grievance.urgency}
                            </Badge>
                        ) : null}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{grievance.id.slice(0, 8)}</span>
                </div>

                <h3 className="font-semibold text-lg mb-1">{grievance.category} Issue</h3>

                <div className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {grievance.description}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(grievance.created_at)}
                    </span>
                    {grievance.department_name && (
                        <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {grievance.department_name}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
