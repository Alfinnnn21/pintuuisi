"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
            {/* Background Image - Campus UISI */}
            <div className="absolute inset-0">
                <Image
                    src="/campus-bg.jpg"
                    alt="Kampus UISI"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Dark overlay for better contrast */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-lg mx-4 sm:mx-auto">

                {/* Glass Login Card */}
                <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 sm:p-10">
                    {/* Welcome Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 drop-shadow-md">Selamat Datang</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-4" />
                        <p className="text-white/80 text-base">Login untuk Peminjaman Ruangan UISI</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email/NOU Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <input
                                id="email"
                                type="text"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-5 py-4 bg-white/15 backdrop-blur border border-white/30 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-base"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                className="w-full pl-14 pr-5 py-4 bg-white/15 backdrop-blur border border-white/30 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-base"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/30 backdrop-blur border border-red-400/50 rounded-xl py-3 px-4">
                                <p className="text-sm text-white text-center">{error}</p>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-lg rounded-xl transition-all shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Login
                        </button>
                    </form>

                    {/* Forgot Password */}
                    <div className="text-center mt-6">
                        <a href="#" className="text-white/70 hover:text-white text-sm transition-colors underline underline-offset-4">
                            Lupa Password?
                        </a>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-8 p-4 bg-black/20 backdrop-blur rounded-xl border border-white/20">
                        <p className="font-semibold text-white/90 text-sm mb-2">Demo Credentials:</p>
                        <ul className="space-y-1 text-sm text-white/70">
                            <li>• User: <code className="bg-white/20 px-2 py-0.5 rounded">mahasiswa1@gmail.com</code> | <code className="bg-white/20 px-2 py-0.5 rounded">mahasiswa1</code></li>
                            <li>• Admin: <code className="bg-white/20 px-2 py-0.5 rounded">admin@gmail.com</code> | <code className="bg-white/20 px-2 py-0.5 rounded">admin</code></li>
                        </ul>
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg border border-white/10">
                        {/* Engineering Management UISI Logo */}
                        <svg width="32" height="36" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="25" y="2" width="50" height="8" rx="4" fill="#dc2626" />
                            <rect x="22" y="14" width="56" height="8" rx="4" fill="#dc2626" />
                            <rect x="19" y="26" width="62" height="8" rx="4" fill="#f97316" />
                            <path d="M22 100 Q22 55 42 45 L50 53 L58 45 Q78 55 78 100"
                                stroke="#facc15" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-white text-sm font-medium">Pintu UISI Manajemen Rekayasa</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
