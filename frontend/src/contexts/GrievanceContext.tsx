import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { Grievance } from "@/types";

interface GrievanceContextType {
    grievances: Grievance[];
    addGrievance: (g: Omit<Grievance, "id" | "status" | "submittedAt" | "updatedAt" | "department" | "category" | "urgency">) => Grievance;
}

const GrievanceContext = createContext<GrievanceContextType | undefined>(undefined);

// AI mock: assigns category, department, urgency based on keywords
function analyzeGrievance(text: string): { category: string; department: string; urgency: "low" | "medium" | "high" } {
    const lower = text.toLowerCase();
    if (lower.includes("water") || lower.includes("supply") || lower.includes("pipeline")) {
        return { category: "Utilities", department: "Water Authority", urgency: "high" };
    }
    if (lower.includes("road") || lower.includes("pothole") || lower.includes("traffic")) {
        return { category: "Roads", department: "Transport Authority", urgency: "high" };
    }
    if (lower.includes("garbage") || lower.includes("waste") || lower.includes("sanitation")) {
        return { category: "Sanitation", department: "Municipal Services", urgency: "medium" };
    }
    if (lower.includes("light") || lower.includes("electricity") || lower.includes("power")) {
        return { category: "Infrastructure", department: "Public Works", urgency: "medium" };
    }
    if (lower.includes("health") || lower.includes("hospital") || lower.includes("medical")) {
        return { category: "Health", department: "Health Department", urgency: "high" };
    }
    if (lower.includes("park") || lower.includes("garden") || lower.includes("tree")) {
        return { category: "Environment", department: "Municipal Services", urgency: "low" };
    }
    return { category: "General", department: "Central Administration", urgency: "medium" };
}

const initialGrievances: Grievance[] = [
    {
        id: "GRV-2024-001234",
        title: "Street Light Not Working on Main Road",
        description: "The street light near the intersection of Main Road and Park Avenue has been non-functional for the past two weeks, creating safety concerns for pedestrians.",
        category: "Infrastructure",
        department: "Public Works",
        status: "progress",
        urgency: "medium",
        submittedAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-18"),
    },
    {
        id: "GRV-2024-001230",
        title: "Water Supply Interruption",
        description: "Frequent water supply interruptions in the morning hours affecting daily routines. This has been ongoing for the past week.",
        category: "Utilities",
        department: "Water Authority",
        status: "review",
        urgency: "high",
        submittedAt: new Date("2024-01-14"),
        updatedAt: new Date("2024-01-15"),
    },
    {
        id: "GRV-2024-001225",
        title: "Garbage Collection Delay",
        description: "Regular garbage collection has not occurred in our neighborhood for the past three days. Waste is accumulating and causing hygiene issues.",
        category: "Sanitation",
        department: "Municipal Services",
        status: "resolved",
        urgency: "medium",
        submittedAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-13"),
    },
    {
        id: "GRV-2024-001220",
        title: "Pothole on School Route",
        description: "Large pothole has developed on the road leading to the primary school. It's dangerous for children walking to school.",
        category: "Roads",
        department: "Transport Authority",
        status: "submitted",
        urgency: "high",
        submittedAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-12"),
    },
];

let nextId = 1235;

export function GrievanceProvider({ children }: { children: ReactNode }) {
    const [grievances, setGrievances] = useState<Grievance[]>(initialGrievances);

    const addGrievance = useCallback((data: Omit<Grievance, "id" | "status" | "submittedAt" | "updatedAt" | "department" | "category" | "urgency">): Grievance => {
        const analysis = analyzeGrievance(`${data.title} ${data.description}`);
        const now = new Date();
        const id = `GRV-2024-${String(nextId++).padStart(6, "0")}`;
        const newGrievance: Grievance = {
            ...data,
            id,
            status: "submitted",
            submittedAt: now,
            updatedAt: now,
            ...analysis,
        };
        setGrievances((prev) => [newGrievance, ...prev]);
        return newGrievance;
    }, []);

    return (
        <GrievanceContext.Provider value={{ grievances, addGrievance }}>
            {children}
        </GrievanceContext.Provider>
    );
}

export function useGrievances() {
    const context = useContext(GrievanceContext);
    if (!context) throw new Error("useGrievances must be used within GrievanceProvider");
    return context;
}
