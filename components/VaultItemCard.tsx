"use client"

import { useState } from "react"
import type { VaultItem } from "@/lib/vault"

interface VaultItemCardProps {
    item: VaultItem
    onEdit: (item: VaultItem) => void
    onDelete: (id: string) => void
    onDecrypt: (encryptedPassword: string) => string
}

export default function VaultItemCard({ item, onEdit, onDelete, onDecrypt }: VaultItemCardProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)

    const handleCopy = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(field)

            setTimeout(() => {
                navigator.clipboard.writeText("")
                setCopied(null)
            }, 15000)
        } catch (error) {
            alert("Failed to copy")
        }
    }

    const decryptedPassword = showPassword ? onDecrypt(item.encryptedPassword) : ""

    return (
        <div className="bg-background border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    {item.url && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-600 break-all"
                        >
                            {item.url}
                        </a>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this item?")) {
                                onDelete(item._id)
                            }
                        }}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Username</label>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-mono">{item.username}</span>
                        <button
                            onClick={() => handleCopy(item.username, "username")}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            {copied === "username" ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Password</label>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-mono">{showPassword ? decryptedPassword : "••••••••••••"}</span>
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                        {showPassword && (
                            <button
                                onClick={() => handleCopy(decryptedPassword, "password")}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                {copied === "password" ? "Copied!" : "Copy"}
                            </button>
                        )}
                    </div>
                </div>

                {item.notes && (
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Notes</label>
                        <p className="text-sm text-gray-700 mt-1">{item.notes}</p>
                    </div>
                )}
            </div>

            {copied && (
                <div className="mt-3 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded">
                    Clipboard will be cleared in 15 seconds
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                    Created: {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                </p>
            </div>
        </div>
    )
}
