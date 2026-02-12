import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { User } from "@/types";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default mock user for demonstration
const defaultUser: User = {
    id: "usr-001",
    email: "admin@smartgriev.gov.in",
    fullName: "Rajesh Kumar",
    role: "admin",
    department: "Central Administration",
    phone: "+91 98765 43210",
    memberSince: new Date("2023-06-15"),
    isActive: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("smartgriev-user");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                parsed.memberSince = new Date(parsed.memberSince);
                return parsed;
            } catch {
                return defaultUser;
            }
        }
        return defaultUser;
    });

    const login = useCallback((userData: User, token: string) => {
        setUser(userData);
        localStorage.setItem("access_token", token);
        localStorage.setItem("smartgriev-user", JSON.stringify(userData));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("smartgriev-user");
    }, []);

    const updateUser = useCallback((userData: User) => {
        setUser(userData);
        localStorage.setItem("smartgriev-user", JSON.stringify(userData));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
