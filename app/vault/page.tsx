"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { vaultService, type VaultItem, type VaultItemInput } from "@/lib/vault"
import { cryptoService } from "@/lib/crypto"
import VaultItemCard from "@/components/VaultItemCard"
import VaultItemModal from "@/components/VaultItemModal"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function VaultPage() {
    const router = useRouter()
    const { user, loading: authLoading, logout } = useAuth()
    const [items, setItems] = useState<VaultItem[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState("")
    const [searchInput, setSearchInput] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<VaultItem | null>(null)
    const [masterKey, setMasterKey] = useState<string>("")

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login")
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (user) {
            const key = cryptoService.generateKey(user.email, user.id)
            setMasterKey(key)
        }
    }, [user])

    const loadItems = useCallback(async () => {
        if (!user) return

        try {
            setLoading(true)
            const response = await vaultService.getItems(page, 10, search)
            setItems(response.items)
            setTotalPages(response.pagination.totalPages)
        } catch (error) {
            console.error("Failed to load items:", error)
        } finally {
            setLoading(false)
        }
    }, [user, page, search])

    useEffect(() => {
        if (user && masterKey) {
            loadItems()
        }
    }, [user, masterKey, loadItems])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setSearch(searchInput)
        setPage(1)
    }

    const handleSave = async (itemInput: VaultItemInput) => {
        const encryptedPassword = cryptoService.encrypt(itemInput.encryptedPassword, masterKey)

        const encryptedItem = {
            ...itemInput,
            encryptedPassword,
        }

        if (editingItem) {
            await vaultService.updateItem(editingItem._id, encryptedItem)
        } else {
            await vaultService.createItem(encryptedItem)
        }

        await loadItems()
        setEditingItem(null)
    }

    const handleEdit = (item: VaultItem) => {
        setEditingItem(item)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            await vaultService.deleteItem(id)
            await loadItems()
        } catch (error) {
            alert("Failed to delete item")
        }
    }

    const handleDecrypt = (encryptedPassword: string): string => {
        try {
            return cryptoService.decrypt(encryptedPassword, masterKey)
        } catch (error) {
            return "Decryption failed"
        }
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <nav className="bg-card shadow-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <h1 className="text-xl font-bold text-foreground">Password Vault</h1>
                            <div className="flex gap-4">
                                <Link href="/vault" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                                    Vault
                                </Link>
                                <Link
                                    href="/generator"
                                    className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                                >
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Your Vault</h2>
                        <p className="text-muted-foreground mt-1">Securely stored passwords</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingItem(null)
                            setIsModalOpen(true)
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Add New Item
                    </button>
                </div>

                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by title, username, or URL..."
                            className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-foreground"
                        />
                        <button
                            type="submit"
                            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                            Search
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("")
                                    setSearchInput("")
                                    setPage(1)
                                }}
                                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-6 rounded-lg transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading vault items...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-lg border border-border">
                        <p className="text-foreground text-lg">No items found</p>
                        <p className="text-muted-foreground mt-2">
                            {search ? "Try a different search term" : "Add your first password to get started"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                                <VaultItemCard
                                    key={item._id}
                                    item={item}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onDecrypt={handleDecrypt}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-foreground">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <VaultItemModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingItem(null)
                }}
                onSave={handleSave}
                item={editingItem}
                onDecrypt={handleDecrypt}
            />
        </div>
    )
}
