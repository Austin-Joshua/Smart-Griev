import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "@/config/api";
import type { LoginCredentials, RegisterData, AuthTokens, User } from "@/types";

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthTokens> {
        // Backend expects form-data for OAuth2 login
        const formData = new FormData();
        formData.append("username", credentials.email);
        formData.append("password", credentials.password);
        const data = await apiClient.postForm<AuthTokens>(API_ENDPOINTS.LOGIN, formData);
        localStorage.setItem("access_token", data.accessToken);
        return data;
    },

    async register(data: RegisterData): Promise<User> {
        return apiClient.post<User>(API_ENDPOINTS.REGISTER, data);
    },

    async getMe(): Promise<User> {
        return apiClient.get<User>(API_ENDPOINTS.ME);
    },

    logout() {
        localStorage.removeItem("access_token");
    },
};
