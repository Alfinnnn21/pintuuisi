"use client"

import Link from "next/link"
import { PlusCircle, History, ArrowRight, LogOut, Calendar, ClipboardCheck, LayoutDashboard, Clock, Building2, Users, FileText, ChevronRight, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useBooking } from "@/context/BookingContext"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { BookingGrid } from "@/components/booking/BookingGrid"
import { AdminPanel } from "@/components/admin/AdminPanel"

export default function DashboardPage() {
    const { user, logout } = useAuth()
    const { bookings } = useBooking()
    const searchParams = useSearchParams()
    const router = useRouter()

    // Get approved bookings for current user
    const approvedBookings = bookings.filter(
        b => b.user === user?.username && b.status === "Disetujui"
    )

    // Get rejected bookings for current user
    const rejectedBookings = bookings.filter(
        b => b.user === user?.username && b.status === "Ditolak"
    )

    // Get pending bookings for current user
    const pendingBookings = bookings.filter(
        b => b.user === user?.username && b.status === "Menunggu"
    )

    // Track seen approved bookings count in localStorage
    const [seenApprovedCount, setSeenApprovedCount] = useState<number>(0)
    // Track seen rejected bookings count in localStorage
    const [seenRejectedCount, setSeenRejectedCount] = useState<number>(0)

    useEffect(() => {
        if (user?.username) {
            const approvedKey = `seenApproved_${user.username}`
            const rejectedKey = `seenRejected_${user.username}`

            const savedApproved = localStorage.getItem(approvedKey)
            const savedRejected = localStorage.getItem(rejectedKey)

            if (savedApproved) {
                setSeenApprovedCount(parseInt(savedApproved, 10))
            }
            if (savedRejected) {
                setSeenRejectedCount(parseInt(savedRejected, 10))
            }
        }
    }, [user?.username])

    // Calculate unseen counts (new notifications)
    const unseenApprovedCount = Math.max(0, approvedBookings.length - seenApprovedCount)
    const unseenRejectedCount = Math.max(0, rejectedBookings.length - seenRejectedCount)

    // Function to mark all as seen
    const markAllAsSeen = () => {
        if (user?.username) {
            const approvedKey = `seenApproved_${user.username}`
            const rejectedKey = `seenRejected_${user.username}`

            localStorage.setItem(approvedKey, approvedBookings.length.toString())
            localStorage.setItem(rejectedKey, rejectedBookings.length.toString())

            setSeenApprovedCount(approvedBookings.length)
            setSeenRejectedCount(rejectedBookings.length)
        }
    }

    // State to handle active tab based on 'view' param
    const [activeTab, setActiveTab] = useState<string | null>(null)

    useEffect(() => {
        const view = searchParams.get("view")
        if (view === "jadwal") {
            setActiveTab("jadwal")
        } else if (view === "approval") {
            setActiveTab("approval")
        } else {
            setActiveTab(null)
        }
    }, [searchParams])

    // Admin tab views
    if (user?.role === "admin" && activeTab) {
        return (
            <div className="flex min-h-[calc(100vh-80px)]">
                {/* Sidebar - White */}
                <div className="w-72 bg-white border-r border-slate-200 rounded-2xl m-4 p-6 flex flex-col shadow-lg">
                    {/* New Request Button - RED */}
                    <button className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-full py-3 px-6 flex items-center justify-center gap-2 font-medium transition-all mb-8 shadow-md hover:shadow-lg">
                        <PlusCircle className="w-5 h-5" />
                        Tambah Ruangan
                    </button>

                    {/* Navigation - Active uses SLATE, not red */}
                    <nav className="flex-1 space-y-2">
                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${!activeTab ? 'bg-white border-2 border-slate-200 text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                            href="/dashboard?view=jadwal"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'jadwal' ? 'bg-white border-2 border-slate-200 text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
                        >
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">Jadwal Ruangan</span>
                        </Link>
                        <Link
                            href="/dashboard?view=approval"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'approval' ? 'bg-white border-2 border-slate-200 text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
                        >
                            <ClipboardCheck className="w-5 h-5" />
                            <span className="font-medium">Daftar Persetujuan</span>
                        </Link>
                        <Link
                            href="/admin/history"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all"
                        >
                            <History className="w-5 h-5" />
                            <span className="font-medium">Riwayat</span>
                        </Link>
                    </nav>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all mt-4"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 bg-slate-50">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            {activeTab === "jadwal" && <><Calendar className="w-7 h-7 text-[#b91c1c]" /> Jadwal Ruangan</>}
                            {activeTab === "approval" && <><ClipboardCheck className="w-7 h-7 text-[#b91c1c]" /> Daftar Persetujuan</>}
                        </h1>
                    </div>
                    {activeTab === "jadwal" && <BookingGrid />}
                    {activeTab === "approval" && <AdminPanel />}
                </div>
            </div>
        )
    }

    // Dashboard Home View
    return (
        <div className="flex min-h-[calc(100vh-80px)]">
            {/* Sidebar - White */}
            <div className="w-72 bg-white border-r border-slate-200 rounded-2xl m-4 p-6 flex flex-col shadow-lg">
                {/* New Request Button - RED */}
                <Link href={user?.role === "admin" ? "#" : "/loan/new"}>
                    <button className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-full py-3 px-6 flex items-center justify-center gap-2 font-medium transition-all mb-8 shadow-md hover:shadow-lg">
                        <PlusCircle className="w-5 h-5" />
                        {user?.role === "admin" ? "Tambah Ruangan" : "Peminjaman Baru"}
                    </button>
                </Link>

                {/* Navigation - Active uses SLATE for Dashboard */}
                <nav className="flex-1 space-y-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-800 shadow-sm transition-all"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    {user?.role === "admin" ? (
                        <>
                            <Link
                                href="/dashboard?view=jadwal"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all"
                            >
                                <Calendar className="w-5 h-5" />
                                <span className="font-medium">Jadwal Ruangan</span>
                            </Link>
                            <Link
                                href="/dashboard?view=approval"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all"
                            >
                                <ClipboardCheck className="w-5 h-5" />
                                <span className="font-medium">Daftar Persetujuan</span>
                            </Link>
                            <Link
                                href="/admin/history"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all"
                            >
                                <History className="w-5 h-5" />
                                <span className="font-medium">Riwayat</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/loan/new"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all"
                            >
                                <Building2 className="w-5 h-5" />
                                <span className="font-medium">Peminjaman</span>
                            </Link>
                            <Link
                                href="/loan/new?tab=history"
                                onClick={markAllAsSeen}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all relative"
                            >
                                <History className="w-5 h-5" />
                                <span className="font-medium">Riwayat Saya</span>
                                {(unseenApprovedCount > 0 || unseenRejectedCount > 0) && (
                                    <span className="absolute right-3 w-2 h-2 bg-[#b91c1c] rounded-full animate-pulse" />
                                )}
                            </Link>
                        </>
                    )}
                </nav>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all mt-4"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-slate-50">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            Selamat Datang
                            <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        </h1>
                        <p className="text-slate-500 mt-1">Hi, <span className="font-semibold text-slate-700">{user?.username}</span> • {user?.role === "admin" ? "Administrator" : "Mahasiswa"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100">
                            <Bell className="w-5 h-5 text-slate-600" />
                            {(unseenApprovedCount > 0 || unseenRejectedCount > 0) && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#b91c1c] text-white text-xs rounded-full flex items-center justify-center font-medium">
                                    {unseenApprovedCount + unseenRejectedCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Quick Access Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#b91c1c]" />
                        AKSES CEPAT
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {user?.role === "admin" ? (
                            <>
                                {/* Admin Quick Access Cards */}
                                <Link href="/dashboard?view=jadwal" className="group">
                                    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-[#b91c1c] rounded-xl">
                                                <Calendar className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-lg text-slate-800">Jadwal Ruangan</h3>
                                        <p className="text-slate-500 text-sm mt-1">Lihat ketersediaan ruangan</p>
                                    </div>
                                </Link>
                                <Link href="/dashboard?view=approval" className="group">
                                    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-[#dc6b6b] rounded-xl">
                                                <ClipboardCheck className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-lg text-slate-800">Persetujuan</h3>
                                        <p className="text-slate-500 text-sm mt-1">Konfirmasi pengajuan baru</p>
                                    </div>
                                </Link>
                                <Link href="/admin/history" className="group">
                                    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-[#f59e0b] rounded-xl">
                                                <History className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-lg text-slate-800">Riwayat</h3>
                                        <p className="text-slate-500 text-sm mt-1">Arsip peminjaman</p>
                                    </div>
                                </Link>
                                <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-slate-100 rounded-xl">
                                            <Users className="w-6 h-6 text-slate-600" />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-lg text-slate-800">Total Pengajuan</h3>
                                    <p className="text-3xl font-bold text-[#b91c1c] mt-2">{bookings.length}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Student Quick Access Cards */}
                                <Link href="/loan/new" className="group">
                                    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-[#b91c1c] rounded-xl">
                                                <PlusCircle className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-lg text-slate-800">Peminjaman Baru</h3>
                                        <p className="text-slate-500 text-sm mt-1">Ajukan peminjaman ruangan</p>
                                    </div>
                                </Link>
                                <Link href="/loan/new?tab=history" onClick={markAllAsSeen} className="group">
                                    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100 relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-[#dc6b6b] rounded-xl">
                                                <History className="w-6 h-6 text-white" />
                                            </div>
                                            {unseenApprovedCount > 0 && (
                                                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    +{unseenApprovedCount} Disetujui
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-lg text-slate-800">Riwayat Saya</h3>
                                        <p className="text-slate-500 text-sm mt-1">Lihat status peminjaman</p>
                                    </div>
                                </Link>
                                <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 relative">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-[#f59e0b] rounded-xl">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-lg text-slate-800">Menunggu</h3>
                                    <p className="text-3xl font-bold text-[#f59e0b] mt-2">{pendingBookings.length}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-green-500 rounded-xl">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-lg text-slate-800">Disetujui</h3>
                                    <p className="text-3xl font-bold text-green-600 mt-2">{approvedBookings.length}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#b91c1c]" />
                            Peminjaman Terbaru
                        </h2>
                        <Link href={user?.role === "admin" ? "/admin/history" : "/loan/new?tab=history"} className="text-[#b91c1c] hover:text-[#991b1b] text-sm font-medium flex items-center gap-1" onClick={user?.role !== "admin" ? markAllAsSeen : undefined}>
                            Lihat Semua <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {bookings.filter(b => user?.role === "admin" || b.user === user?.username).slice(0, 5).map((booking, idx) => (
                            <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${booking.status === "Disetujui" ? "bg-green-100" :
                                            booking.status === "Ditolak" ? "bg-red-100" : "bg-amber-100"
                                        }`}>
                                        <Building2 className={`w-6 h-6 ${booking.status === "Disetujui" ? "text-green-600" :
                                                booking.status === "Ditolak" ? "text-red-600" : "text-amber-600"
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">{booking.room}</p>
                                        <p className="text-sm text-slate-500">{booking.date} • {booking.time}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === "Disetujui" ? "bg-green-100 text-green-700" :
                                        booking.status === "Ditolak" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                        {bookings.filter(b => user?.role === "admin" || b.user === user?.username).length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                                <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                <p>Belum ada peminjaman</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
