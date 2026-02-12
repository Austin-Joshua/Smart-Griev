export type UserRole = "citizen" | "officer" | "admin";

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    department_id?: string;
    phone?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    full_name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export type GrievanceStatus = "Pending" | "In Progress" | "Resolved" | "Rejected";
export type GrievanceUrgency = "Low" | "Medium" | "High" | "Critical";
export type GrievanceCategory = "Civic" | "Utilities" | "Safety" | "Environment" | "Transport" | "Other";

export interface Grievance {
    id: string;
    citizen_id: string;
    department_id?: string;
    category: GrievanceCategory;
    urgency: GrievanceUrgency;
    description: string;
    image_url?: string;
    location?: string;
    status: GrievanceStatus;
    ai_analysis?: {
        summary: string;
        sentiment: string;
        category: GrievanceCategory;
        urgency: GrievanceUrgency;
    };
    created_at: string;
    updated_at: string;
    officer_id?: string;
    department_name?: string;
    timeline?: TimelineEvent[];
}

export interface TimelineEvent {
    id: string;
    grievance_id: string;
    event_type: string;
    description: string;
    created_at: string;
    created_by: string;
    is_visible_to_citizen: boolean;
}

export interface GrievanceResponse extends Grievance {
    // Backend might return slightly different fields or wrapper
}
