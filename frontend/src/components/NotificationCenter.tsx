import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    Check,
    CheckCheck,
    Info,
    CheckCircle2,
    AlertTriangle,
    AlertOctagon,
    Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const typeIcons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    urgent: AlertOctagon,
};

const typeColors = {
    info: "text-primary",
    success: "text-success",
    warning: "text-warning",
    urgent: "text-urgent",
};

export function NotificationCenter() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotifClick = (notif: typeof notifications[0]) => {
        markAsRead(notif.id);
        if (notif.link) {
            navigate(notif.link);
            setOpen(false);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
                onClick={() => setOpen(!open)}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-urgent text-urgent-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </Button>

            {open && (
                <div className="absolute right-0 top-12 w-96 bg-card border rounded-xl shadow-elevated z-50 animate-scale-in overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Notifications
                            {unreadCount > 0 && (
                                <Badge variant="default" className="text-xs">{unreadCount} new</Badge>
                            )}
                        </h3>
                        <div className="flex gap-1">
                            {unreadCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
                                    <CheckCheck className="w-3 h-3" />
                                    Read all
                                </Button>
                            )}
                            {notifications.length > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-7 text-muted-foreground">
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-12 text-center">
                                <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                <p className="text-sm text-muted-foreground">No notifications</p>
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const Icon = typeIcons[notif.type];
                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotifClick(notif)}
                                        className={`flex gap-3 p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted/30 transition-colors ${!notif.read ? "bg-primary-light/20" : ""
                                            }`}
                                    >
                                        <div className={`shrink-0 mt-0.5 ${typeColors[notif.type]}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm ${!notif.read ? "font-semibold" : "font-medium"}`}>
                                                    {notif.title}
                                                </p>
                                                {!notif.read && (
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">
                                                {formatDistanceToNow(notif.time, { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
