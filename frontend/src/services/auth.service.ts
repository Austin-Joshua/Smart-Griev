import api from "@/services/api";
import { LoginCredentials, RegisterData, AuthResponse, User } from "@/types";
import { jwtDecode } from "jwt-decode";

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/login", {
            email: credentials.email,
            password: credentials.password,
        });

        if (response.data.access_token) {
            localStorage.setItem("token", response.data.access_token);
            // Decode user info if not provided in response, or fetch user profile
            const user = await this.getCurrentUser();
            localStorage.setItem("user", JSON.stringify(user));
            return { ...response.data, user };
        }

        return response.data;
    },

    async register(data: RegisterData): Promise<User> {
        const response = await api.post<User>("/auth/register", data);
        return response.data;
    },

    async logout(): Promise<void> {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>("/users/me");
        return response.data;
    },

    getCurrentUserFromStorage(): User | null {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    },

    isTokenValid(): boolean {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp > currentTime;
        } catch (e) {
            return false;
        }
    }
};
