"use client"

import { useState, useEffect } from "react"
import { generatePassword, calculatePasswordStrength, type PasswordOptions } from "@/lib/passwordGenerator"

interface PasswordGeneratorProps {
    onPasswordGenerated?: (password: string) => void
    initialPassword?: string
}

export default function PasswordGenerator({ onPasswordGenerated, initialPassword = "" }: PasswordGeneratorProps) {
    const [password, setPassword] = useState(initialPassword)
    const [options, setOptions] = useState<PasswordOptions>({
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeLookAlikes: false,
    })
    const [copied, setCopied] = useState(false)
    const [copyTimeout, setCopyTimeout] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!initialPassword) {
            handleGenerate()
        }
    }, [])

    const handleGenerate = () => {
        try {
            const newPassword = generatePassword(options)
            setPassword(newPassword)
            if (onPasswordGenerated) {
                onPasswordGenerated(newPassword)
            }
        } catch (error) {
            alert("Please select at least one character type")
        }
    }

    const handleCopy = async () => {
        if (!password) return

        try {
            await navigator.clipboard.writeText(password)
            setCopied(true)

            if (copyTimeout) {
                clearTimeout(copyTimeout)
            }

            const timeout = setTimeout(() => {
                navigator.clipboard.writeText("")
                setCopied(false)
                setCopyTimeout(null)
            }, 15000)

            setCopyTimeout(timeout)
        } catch (error) {
            alert("Failed to copy password")
        }
    }

    const strength = password ? calculatePasswordStrength(password) : null

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Generated password"
                        readOnly
                    />
                    <button
                        onClick={handleCopy}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>

                {strength && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Password Strength:</span>
                            <span className="font-medium">{strength.label}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${strength.color}`}
                                style={{ width: `${(strength.score / 7) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {copied && (
                    <div className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                        Password will be cleared from clipboard in 15 seconds
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Length: {options.length}</label>
                    </div>
                    <input
                        type="range"
                        min="8"
                        max="64"
                        value={options.length}
                        onChange={(e) =>
                            setOptions({
                                ...options,
                                length: Number.parseInt(e.target.value),
                            })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>8</span>
                        <span>64</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options.includeUppercase}
                            onChange={(e) =>
                                setOptions({
                                    ...options,
                                    includeUppercase: e.target.checked,
                                })
                            }
                            className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">Include Uppercase Letters (A-Z)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options.includeLowercase}
                            onChange={(e) =>
                                setOptions({
                                    ...options,
                                    includeLowercase: e.target.checked,
                                })
                            }
                            className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">Include Lowercase Letters (a-z)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options.includeNumbers}
                            onChange={(e) =>
                                setOptions({
                                    ...options,
                                    includeNumbers: e.target.checked,
                                })
                            }
                            className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">Include Numbers (0-9)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options.includeSymbols}
                            onChange={(e) =>
                                setOptions({
                                    ...options,
                                    includeSymbols: e.target.checked,
                                })
                            }
                            className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">Include Symbols (!@#$%^&*)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options.excludeLookAlikes}
                            onChange={(e) =>
                                setOptions({
                                    ...options,
                                    excludeLookAlikes: e.target.checked,
                                })
                            }
                            className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">Exclude Look-alike Characters (il1Lo0O)</span>
                    </label>
                </div>
            </div>

            <button
                onClick={handleGenerate}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
                Generate Password
            </button>
        </div>
    )
}
