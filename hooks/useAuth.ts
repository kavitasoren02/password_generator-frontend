"use client"

import { useState, useEffect } from "react"
import { authService, type User } from "@/lib/auth"

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const token = authService.getToken()
            if (token) {
                const { user } = await authService.verifyToken()
                setUser(user)
            }
        } catch (error) {
            authService.logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        const { token, user } = await authService.login(email, password)
        authService.setAuth(token, user)
        setUser(user)
    }

    const register = async (email: string, password: string) => {
        const { token, user } = await authService.register(email, password)
        authService.setAuth(token, user)
        setUser(user)
    }

    const logout = () => {
        authService.logout()
        setUser(null)
    }

    return { user, loading, login, register, logout }
}
