import { createContext, useContext, useState, ReactNode } from "react";

export type NotificationType = "info" | "success" | "warning" | "urgent";

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: Date;
    read: boolean;
    link?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, "id" | "time" | "read">) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    // Mock initial notifications
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            type: "info",
            title: "Welcome to SmartGriev",
            message: "Get started by submitting your first grievance.",
            time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: false,
            link: "/submit"
        },
        {
            id: "2",
            type: "warning",
            title: "Profile Incomplete",
            message: "Please update your contact details in settings.",
            time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            read: true,
            link: "/settings"
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = (notification: Omit<Notification, "id" | "time" | "read">) => {
        const newNotif: Notification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            time: new Date(),
            read: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
