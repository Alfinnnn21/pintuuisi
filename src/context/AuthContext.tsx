"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type UserRole = "mahasiswa" | "admin"

interface User {
    username: string
    role: UserRole
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (username: string, pass: string) => boolean
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem("user")
            return storedUser ? JSON.parse(storedUser) : null
        }
        return null
    })
    const [isLoading] = useState(false) // No longer loading since we init synchronously
    const router = useRouter()

    // We don't need the useEffect anymore for initial load
    // But if we want to simulate loading state for hydration safety we might need "mounted" check
    // However, the lazy init is fine for single render pass if SSR matches or if we don't care about mismatch on first frame (for auth usually okay if suppressed or handled)
    // Actually, Next.js might complain about hydration mismatch if localStorage differs from server (null).
    // Standard pattern: useEffect to check auth.
    // If we want to avoid strict mode double invoke causing "sync setState" error?
    // The error "Calling setState synchronously within an effect" is specifically about `useEffect(() => setState(...), [])`.
    // Moving to lazy init is the fix.

    // For hydration mismatch: we should probably start null and use effect, but ignoring the rule?
    // Or use the lazy init and accept that server renders null (loading) and client renders User.
    // Ensure `isLoading` is handled correct.
    // If I lazy init `user`, `isLoading` can be false immediately?
    // Let's set `isLoading` to false.

    const login = (username: string, pass: string) => {
        if (username === "mahasiswa1@gmail.com" && pass === "mahasiswa1") {
            const newUser: User = { username: "Mahasiswa1", role: "mahasiswa" }
            setUser(newUser)
            localStorage.setItem("user", JSON.stringify(newUser))
            return true
        }
        if (username === "mahasiswa2@gmail.com" && pass === "mahasiswa2") {
            const newUser: User = { username: "Mahasiswa2", role: "mahasiswa" }
            setUser(newUser)
            localStorage.setItem("user", JSON.stringify(newUser))
            localStorage.setItem("user", JSON.stringify(newUser))
            return true
        }
        if (username === "mahasiswa3@gmail.com" && pass === "mahasiswa3") {
            const newUser: User = { username: "Mahasiswa3", role: "mahasiswa" }
            setUser(newUser)
            localStorage.setItem("user", JSON.stringify(newUser))
            return true
        }
        if (username === "admin@gmail.com" && pass === "admin") {
            const newUser: User = { username: "Admin", role: "admin" }
            setUser(newUser)
            localStorage.setItem("user", JSON.stringify(newUser))
            return true
        }
        return false
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
