import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "success" | "warning";
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary-light border-primary/20",
  secondary: "bg-secondary-light border-secondary/20",
  success: "bg-success-light border-success/20",
  warning: "bg-warning-light border-warning/20",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-card", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-heading font-bold">{value}</p>
              {trend && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.positive ? "text-success" : "text-urgent"
                  )}
                >
                  {trend.positive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconVariantStyles[variant])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
