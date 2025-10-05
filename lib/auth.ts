import { api } from "./api"

export interface User {
    id: string
    email: string
}

export interface AuthResponse {
    token: string
    user: User
    message: string
}

export const authService = {
    async register(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/register", {
            email,
            password,
        })
        return response.data
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/login", {
            email,
            password,
        })
        return response.data
    },

    async verifyToken(): Promise<{ user: User }> {
        const response = await api.get<{ user: User }>("/auth/verify")
        return response.data
    },

    logout(): void {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
    },

    getToken(): string | null {
        return localStorage.getItem("token")
    },

    getUser(): User | null {
        const userStr = localStorage.getItem("user")
        return userStr ? JSON.parse(userStr) : null
    },

    setAuth(token: string, user: User): void {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
    },
}
