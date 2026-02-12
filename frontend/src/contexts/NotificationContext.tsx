import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: Date;
    read: boolean;
    type: "info" | "success" | "warning" | "urgent";
    link?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (n: Omit<Notification, "id" | "time" | "read">) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
    {
        id: "notif-1",
        title: "Grievance Assigned",
        message: "Your water supply complaint has been assigned to Officer Priya from Water Authority.",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        type: "info",
        link: "/dashboard",
    },
    {
        id: "notif-2",
        title: "Status Update",
        message: "Street light issue (GRV-2024-001234) is now being actively worked on.",
        time: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: false,
        type: "success",
        link: "/dashboard",
    },
    {
        id: "notif-3",
        title: "Grievance Resolved",
        message: "Garbage collection grievance (GRV-2024-001225) has been resolved successfully.",
        time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
        type: "success",
        link: "/dashboard",
    },
    {
        id: "notif-4",
        title: "High Priority Alert",
        message: "A pothole on the school route has been reported as high priority and escalated.",
        time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        read: true,
        type: "warning",
    },
];

let nextNotifId = 5;

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const addNotification = useCallback(
        (n: Omit<Notification, "id" | "time" | "read">) => {
            const newNotif: Notification = {
                ...n,
                id: `notif-${nextNotifId++}`,
                time: new Date(),
                read: false,
            };
            setNotifications((prev) => [newNotif, ...prev]);
        },
        []
    );

    const markAsRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within NotificationProvider");
    return context;
}
