import { CheckCircle2, Clock, FileSearch, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type GrievanceStatus = "submitted" | "review" | "progress" | "resolved";

interface TimelineStep {
  status: GrievanceStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const timelineSteps: TimelineStep[] = [
  {
    status: "submitted",
    label: "Submitted",
    description: "Your grievance has been received",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    status: "review",
    label: "Under Review",
    description: "AI is analyzing your complaint",
    icon: <FileSearch className="w-5 h-5" />,
  },
  {
    status: "progress",
    label: "In Progress",
    description: "Department is working on resolution",
    icon: <Loader2 className="w-5 h-5" />,
  },
  {
    status: "resolved",
    label: "Resolved",
    description: "Your grievance has been addressed",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
];

interface StatusTimelineProps {
  currentStatus: GrievanceStatus;
  className?: string;
  compact?: boolean;
}

const statusOrder: GrievanceStatus[] = ["submitted", "review", "progress", "resolved"];

export function StatusTimeline({ currentStatus, className, compact = false }: StatusTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("flex", compact ? "gap-2" : "justify-between")}>
        {timelineSteps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div
              key={step.status}
              className={cn(
                "flex flex-col items-center relative",
                compact ? "flex-1" : "w-1/4"
              )}
            >
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute top-5 right-1/2 w-full h-0.5 -z-10",
                    isCompleted || isCurrent ? "bg-primary" : "bg-border"
                  )}
                  style={{ transform: "translateX(50%)" }}
                />
              )}

              {/* Icon circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted && "bg-success text-success-foreground",
                  isCurrent && "bg-primary text-primary-foreground animate-pulse-soft",
                  isPending && "bg-muted text-muted-foreground"
                )}
              >
                {step.icon}
              </div>

              {/* Labels */}
              {!compact && (
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "font-medium text-sm",
                      isCurrent && "text-primary",
                      isPending && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">
                    {step.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
