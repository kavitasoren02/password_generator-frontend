"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import PasswordGenerator from "@/components/PasswordGenerator"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function GeneratorPage() {
    const router = useRouter()
    const { user, loading, logout } = useAuth()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            <nav className="bg-card shadow-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <h1 className="text-xl font-bold text-foreground">Password Vault</h1>
                            <div className="flex gap-4">
                                <Link
                                    href="/vault"
                                    className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                                >
                                    Vault
                                </Link>
                                <Link href="/generator" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                                    Generator
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                            <button
                                onClick={() => {
                                    if (confirm("Are you sure you want to logout?")) {
                                        logout()
                                    }
                                }}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Password Generator</h2>
                        <p className="text-muted-foreground mt-1">Generate strong, secure passwords instantly</p>
                    </div>

                    <PasswordGenerator />
                </div>
            </main>
        </div>
    )
}
