import api from "./api";
import { Grievance, GrievanceStatus } from "../types";

export interface GrievanceFilters {
    status?: GrievanceStatus;
    limit?: number;
    skip?: number;
}

export const grievanceService = {
    async getAll(filters?: GrievanceFilters): Promise<{ items: Grievance[], total: number }> {
        const response = await api.get<{ items: Grievance[], total: number }>("/grievances", {
            params: filters,
        });
        return response.data;
    },

    async getById(id: string): Promise<Grievance> {
        const response = await api.get<Grievance>(`/grievances/${id}`);
        return response.data;
    },

    async create(data: FormData): Promise<Grievance> {
        // Note: data should be FormData to support file uploads
        const response = await api.post<Grievance>("/grievances/submit", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    async updateStatus(id: string, status: GrievanceStatus, comment?: string): Promise<Grievance> {
        const response = await api.put<Grievance>(`/grievances/${id}/status`, {
            status,
            comment
        });
        return response.data;
    },

    async addComment(id: string, comment: string): Promise<void> {
        await api.post(`/grievances/${id}/comment`, { comment });
    },

    async getTimeline(id: string): Promise<any[]> {
        const response = await api.get(`/grievances/${id}/timeline`);
        return response.data.events;
    }
};
