import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusTimeline, GrievanceStatus } from "@/components/StatusTimeline";
import { Calendar, Building2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  status: GrievanceStatus;
  urgency: "low" | "medium" | "high";
  submittedAt: Date;
  updatedAt: Date;
}

interface GrievanceCardProps {
  grievance: Grievance;
  onClick?: () => void;
  showTimeline?: boolean;
}

const urgencyConfig = {
  low: { label: "Low Priority", variant: "success" as const },
  medium: { label: "Medium Priority", variant: "warning" as const },
  high: { label: "High Priority", variant: "urgent" as const },
};

export function GrievanceCard({ grievance, onClick, showTimeline = true }: GrievanceCardProps) {
  const urgency = urgencyConfig[grievance.urgency];

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-card cursor-pointer group",
        "border-l-4",
        grievance.status === "resolved" && "border-l-success",
        grievance.status === "progress" && "border-l-secondary",
        grievance.status === "review" && "border-l-warning",
        grievance.status === "submitted" && "border-l-primary"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h3 className="font-heading font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {grievance.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {grievance.description}
            </p>
          </div>
          <Badge variant={urgency.variant} className="shrink-0">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {urgency.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            <span>{grievance.department}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{grievance.submittedAt.toLocaleDateString()}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {grievance.category}
          </Badge>
        </div>

        {showTimeline && (
          <div className="pt-2">
            <StatusTimeline currentStatus={grievance.status} compact />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
