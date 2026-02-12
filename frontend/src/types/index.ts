import { GrievanceStatus } from "@/components/StatusTimeline";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "citizen" | "officer" | "admin";
  department?: string;
  phone?: string;
  memberSince: Date;
  isActive: boolean;
}

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  status: GrievanceStatus;
  urgency: "low" | "medium" | "high";
  submittedAt: Date;
  updatedAt: Date;
  citizenName?: string;
  citizenEmail?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role?: "citizen" | "officer" | "admin";
}

export interface DepartmentStats {
  name: string;
  pending: number;
  resolved: number;
  avgDays: number;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}
