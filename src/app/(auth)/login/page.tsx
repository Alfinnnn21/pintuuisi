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
        <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Left Side - Artistic Background */}
            <div className="hidden lg:flex lg:w-1/2 relative p-6">
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/cosmic-bg.png')" }}
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Top Navigation */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
                        <h2 className="text-white text-xl font-semibold tracking-wide">Selected Works</h2>
                        <div className="flex items-center gap-3">
                            <button className="text-white/80 hover:text-white transition-colors px-4 py-2 text-sm font-medium">
                                Sign Up
                            </button>
                            <button className="bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg">
                                Join Us
                            </button>
                        </div>
                    </div>

                    {/* Bottom Profile & Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                                U
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">PINTUUISI</h3>
                                <p className="text-white/60 text-sm">Sistem Peminjaman Ruangan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                            </button>
                            <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white lg:rounded-l-[3rem]">
                <div className="w-full max-w-md px-8 py-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-wide">PINTUUISI</h1>
                        <div className="flex items-center gap-2 border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-600">
                            <span>🇮🇩</span>
                            <span>ID</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">Hi There</h2>
                        <p className="text-slate-500 text-lg">Welcome to PINTUUISI</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}


                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 mt-2"
                        >
                            Login
                        </button>
                    </form>


                    {/* Demo Credentials */}
                    <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="font-semibold text-slate-700 text-sm mb-2">Demo Credentials:</p>
                        <ul className="space-y-1 text-xs text-slate-500">
                            <li>• User: <code className="bg-slate-200 px-1 rounded">mahasiswa1@gmail.com</code> | Pass: <code className="bg-slate-200 px-1 rounded">mahasiswa1</code></li>
                            <li>• Admin: <code className="bg-slate-200 px-1 rounded">admin@gmail.com</code> | Pass: <code className="bg-slate-200 px-1 rounded">admin</code></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
