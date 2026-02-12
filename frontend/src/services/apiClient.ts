import { API_BASE_URL } from "@/config/api";

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        const token = localStorage.getItem("access_token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return headers;
    }

    async get<T>(endpoint: string): Promise<T> {
        const res = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "GET",
            headers: this.getHeaders(),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(error.detail || "Request failed");
        }
        return res.json();
    }

    async post<T>(endpoint: string, body?: unknown): Promise<T> {
        const res = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers: this.getHeaders(),
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(error.detail || "Request failed");
        }
        return res.json();
    }

    async postForm<T>(endpoint: string, formData: FormData): Promise<T> {
        const headers: Record<string, string> = {};
        const token = localStorage.getItem("access_token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers,
            body: formData,
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(error.detail || "Request failed");
        }
        return res.json();
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
