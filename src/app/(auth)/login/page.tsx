"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const success = login(email, password)
        if (success) {
            router.push("/")
        } else {
            setError("Email atau password salah!")
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-white to-orange-50" />

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Building silhouette - left side */}
                <div className="absolute left-0 bottom-0 w-1/3 h-2/3 opacity-20">
                    <svg viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <rect x="50" y="200" width="120" height="400" fill="#64748b" />
                        <rect x="60" y="220" width="25" height="35" fill="#94a3b8" />
                        <rect x="95" y="220" width="25" height="35" fill="#94a3b8" />
                        <rect x="130" y="220" width="25" height="35" fill="#94a3b8" />
                        <rect x="60" y="270" width="25" height="35" fill="#94a3b8" />
                        <rect x="95" y="270" width="25" height="35" fill="#94a3b8" />
                        <rect x="130" y="270" width="25" height="35" fill="#94a3b8" />
                        <rect x="200" y="150" width="150" height="450" fill="#475569" />
                        <rect x="210" y="170" width="30" height="40" fill="#94a3b8" />
                        <rect x="250" y="170" width="30" height="40" fill="#94a3b8" />
                        <rect x="290" y="170" width="30" height="40" fill="#94a3b8" />
                        <circle cx="320" cy="450" r="40" fill="#22c55e" opacity="0.5" />
                        <circle cx="100" cy="180" r="60" fill="#22c55e" opacity="0.4" />
                    </svg>
                </div>

                {/* Office/Campus scene - right side */}
                <div className="absolute right-0 bottom-0 w-1/3 h-2/3 opacity-20 hidden lg:block">
                    <svg viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <rect x="100" y="250" width="250" height="350" fill="#f97316" opacity="0.3" />
                        <rect x="150" y="300" width="150" height="100" fill="#fbbf24" opacity="0.5" />
                        <rect x="130" y="280" width="40" height="50" fill="#dc2626" opacity="0.4" />
                        <rect x="250" y="280" width="40" height="50" fill="#dc2626" opacity="0.4" />
                        <circle cx="200" cy="200" r="30" fill="#64748b" opacity="0.3" />
                    </svg>
                </div>

                {/* Calendar decoration */}
                <div className="absolute left-10 lg:left-20 bottom-20 w-24 lg:w-32 h-24 lg:h-32 opacity-30 hidden md:block">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="20" width="80" height="70" rx="5" fill="white" stroke="#64748b" strokeWidth="2" />
                        <rect x="10" y="20" width="80" height="20" rx="5" fill="#dc2626" />
                        <rect x="20" y="50" width="15" height="10" fill="#e5e7eb" />
                        <rect x="40" y="50" width="15" height="10" fill="#22c55e" />
                        <rect x="60" y="50" width="15" height="10" fill="#e5e7eb" />
                        <rect x="20" y="65" width="15" height="10" fill="#e5e7eb" />
                        <rect x="40" y="65" width="15" height="10" fill="#e5e7eb" />
                        <rect x="60" y="65" width="15" height="10" fill="#22c55e" />
                    </svg>
                </div>

                {/* Clock decoration */}
                <div className="absolute right-5 lg:right-20 top-20 w-16 lg:w-20 h-16 lg:h-20 opacity-30 hidden md:block">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" fill="white" stroke="#64748b" strokeWidth="2" />
                        <line x1="50" y1="50" x2="50" y2="25" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="50" y1="50" x2="70" y2="50" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="3" fill="#1e293b" />
                    </svg>
                </div>
            </div>

            {/* Left Side - Logo (hidden on mobile, shown on lg) */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative z-10 p-8">
                <div className="text-center">
                    {/* UISI Logo */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        {/* Logo Icon */}
                        <div className="relative">
                            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* House shape */}
                                <path d="M20 50 L50 20 L80 50 L80 85 L20 85 Z" fill="#dc2626" />
                                {/* Window/door */}
                                <rect x="40" y="55" width="20" height="30" fill="white" />
                                {/* Leaf decoration */}
                                <ellipse cx="25" cy="75" rx="8" ry="15" fill="#22c55e" transform="rotate(-30 25 75)" />
                            </svg>
                        </div>
                        {/* UISI Text */}
                        <div className="text-left">
                            <h1 className="text-5xl font-bold text-[#dc2626] tracking-tight">UISI</h1>
                        </div>
                    </div>
                    <p className="text-[#dc2626] text-xl font-medium tracking-wide">Peminjaman Ruangan Mahasiswa</p>
                </div>
            </div>

            {/* Right Side / Mobile Full - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10 min-h-screen lg:min-h-0 px-4 py-8">
                {/* Mobile Logo - shown only on mobile */}
                <div className="lg:hidden absolute top-8 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-2">
                        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 50 L50 20 L80 50 L80 85 L20 85 Z" fill="#dc2626" />
                            <rect x="40" y="55" width="20" height="30" fill="white" />
                            <ellipse cx="25" cy="75" rx="8" ry="15" fill="#22c55e" transform="rotate(-30 25 75)" />
                        </svg>
                        <span className="text-2xl font-bold text-[#dc2626]">UISI</span>
                    </div>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-200/50 p-6 sm:p-8 mt-16 lg:mt-0">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Selamat Datang</h2>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-3"></div>
                        <p className="text-slate-500 text-sm">Login untuk Peminjaman Ruangan UISI</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* NOU / Email Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <input
                                id="email"
                                type="text"
                                placeholder="NOU / Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm sm:text-base"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm sm:text-base"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center bg-red-50 py-2 rounded-lg">{error}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold rounded-lg transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 text-sm sm:text-base"
                        >
                            Login
                        </button>
                    </form>

                    {/* Forgot Password Link */}
                    <div className="text-center mt-4">
                        <a href="#" className="text-slate-500 hover:text-[#dc2626] text-sm transition-colors">
                            Lupa Password?
                        </a>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="font-semibold text-slate-700 text-xs mb-2">Demo Credentials:</p>
                        <ul className="space-y-1 text-xs text-slate-500">
                            <li>• User: <code className="bg-slate-200 px-1 rounded text-xs">mahasiswa1@gmail.com</code> | <code className="bg-slate-200 px-1 rounded text-xs">mahasiswa1</code></li>
                            <li>• Admin: <code className="bg-slate-200 px-1 rounded text-xs">admin@gmail.com</code> | <code className="bg-slate-200 px-1 rounded text-xs">admin</code></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
