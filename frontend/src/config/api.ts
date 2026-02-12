// Backend API configuration
// When the backend is running, update this URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
    // Auth
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    REFRESH: "/api/v1/auth/refresh",
    ME: "/api/v1/auth/me",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",

    // Grievances
    SUBMIT_GRIEVANCE: "/api/v1/grievances/submit",
    LIST_GRIEVANCES: "/api/v1/grievances",
    GRIEVANCE_DETAIL: (id: string) => `/api/v1/grievances/${id}`,
    GRIEVANCE_TIMELINE: (id: string) => `/api/v1/grievances/${id}/timeline`,
    GRIEVANCE_COMMENT: (id: string) => `/api/v1/grievances/${id}/comment`,

    // Officer
    OFFICER_ASSIGNED: "/api/v1/officers/me/assigned",
    OFFICER_ACCEPT: (id: string) => `/api/v1/officers/${id}/accept`,
    OFFICER_IN_PROGRESS: (id: string) => `/api/v1/officers/${id}/mark-in-progress`,
    OFFICER_RESOLVE: (id: string) => `/api/v1/officers/${id}/resolve`,

    // Health
    HEALTH: "/api/v1/health",
} as const;
