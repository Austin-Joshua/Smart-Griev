import React, { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Grievance, GrievanceStatus } from "@/types";
import { grievanceService, GrievanceFilters } from "@/services/grievance.service";
import { useAuth } from "@/contexts/AuthContext";
// import { toast } from "sonner"; // Assuming toast is available or can be added

interface GrievanceContextType {
    grievances: Grievance[];
    isLoading: boolean;
    refreshGrievances: () => Promise<void>;
    submitGrievance: (data: FormData) => Promise<any>;
    updateStatus: (id: string, status: GrievanceStatus, comment?: string) => Promise<void>;
    filters: GrievanceFilters;
    setFilters: (filters: GrievanceFilters) => void;
    getGrievanceById: (id: string) => Promise<Grievance | undefined>;
}

const GrievanceContext = createContext<GrievanceContextType | undefined>(undefined);

export const GrievanceProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [filters, setFilters] = useState<GrievanceFilters>({});
    const queryClient = useQueryClient();

    // Use React Query for fetching with polling
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['grievances', user?.id, filters],
        queryFn: async () => {
            if (!user) return { items: [], total: 0 };
            return await grievanceService.getAll(filters);
        },
        enabled: !!user,
        refetchInterval: 30000, // Poll every 30 seconds
    });

    const grievances = data?.items || [];

    const refreshGrievances = async () => {
        await refetch();
    };

    const submitGrievance = async (data: FormData) => {
        try {
            const response = await grievanceService.create(data);
            await queryClient.invalidateQueries({ queryKey: ['grievances'] });
            return response;
        } catch (error) {
            console.error("Failed to submit grievance", error);
            throw error;
        }
    };

    const updateStatus = async (id: string, status: GrievanceStatus, comment?: string) => {
        try {
            await grievanceService.updateStatus(id, status, comment);
            await queryClient.invalidateQueries({ queryKey: ['grievances'] });
        } catch (error) {
            console.error("Failed to update status", error);
            throw error;
        }
    };

    const getGrievanceById = async (id: string): Promise<Grievance | undefined> => {
        // Check if we have it in state, otherwise fetch
        const existing = grievances.find(g => g.id === id);
        if (existing) return existing;

        try {
            return await grievanceService.getById(id);
        } catch (error) {
            console.error("Failed to fetch grievance by ID", error);
            return undefined;
        }
    }

    return (
        <GrievanceContext.Provider value={{
            grievances,
            isLoading,
            refreshGrievances,
            submitGrievance,
            updateStatus,
            filters,
            setFilters,
            getGrievanceById
        }}>
            {children}
        </GrievanceContext.Provider>
    );
};

export const useGrievance = () => {
    const context = useContext(GrievanceContext);
    if (!context) {
        throw new Error("useGrievance must be used within GrievanceProvider");
    }
    return context;
};
