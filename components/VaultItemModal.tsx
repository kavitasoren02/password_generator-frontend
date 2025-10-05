"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { VaultItem, VaultItemInput } from "@/lib/vault"
import PasswordGenerator from "./PasswordGenerator"

interface VaultItemModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (item: VaultItemInput) => Promise<void>
    item?: VaultItem | null
    onDecrypt?: (encryptedPassword: string) => string
}

export default function VaultItemModal({ isOpen, onClose, onSave, item, onDecrypt }: VaultItemModalProps) {
    const [title, setTitle] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [url, setUrl] = useState("")
    const [notes, setNotes] = useState("")
    const [loading, setLoading] = useState(false)
    const [showGenerator, setShowGenerator] = useState(false)

    useEffect(() => {
        if (item) {
            setTitle(item.title)
            setUsername(item.username)
            setPassword(onDecrypt ? onDecrypt(item.encryptedPassword) : "")
            setUrl(item.url || "")
            setNotes(item.notes || "")
        } else {
            setTitle("")
            setUsername("")
            setPassword("")
            setUrl("")
            setNotes("")
        }
    }, [item, onDecrypt])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await onSave({
                title,
                username,
                encryptedPassword: password,
                url: url || undefined,
                notes: notes || undefined,
            })
            onClose()
        } catch (error) {
            alert("Failed to save item")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-background border-2 border-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{item ? "Edit Item" : "Add New Item"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="e.g., Gmail Account"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username *
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="e.g., user@example.com"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password *
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowGenerator(!showGenerator)}
                                className="text-sm text-blue-500 hover:text-blue-600"
                            >
                                {showGenerator ? "Hide Generator" : "Generate Password"}
                            </button>
                        </div>

                        {showGenerator ? (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <PasswordGenerator
                                    onPasswordGenerated={(pwd) => {
                                        setPassword(pwd)
                                        setShowGenerator(false)
                                    }}
                                    initialPassword={password}
                                />
                            </div>
                        ) : (
                            <input
                                id="password"
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                                placeholder="Enter or generate a password"
                            />
                        )}
                    </div>

                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                            URL
                        </label>
                        <input
                            id="url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                            placeholder="Additional notes..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : "Save Item"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
