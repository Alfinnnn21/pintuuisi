"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, History, ArrowRight, LogOut, Calendar, ClipboardCheck, LayoutDashboard } from "lucide-react"
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

    const mahasiswaMenu = [
        {
            title: "Peminjaman Baru",
            description: "Ajukan peminjaman ruangan atau alat untuk kegiatan.",
            icon: PlusCircle,
            href: "/loan/new",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            onClick: undefined as (() => void) | undefined,
            notificationCount: undefined as number | undefined,
            rejectedNotificationCount: undefined as number | undefined,
        },
        {
            title: "Riwayat Saya",
            description: "Lihat status dan riwayat peminjaman Anda.",
            icon: History,
            href: "/loan/new?tab=history",
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
            notificationCount: unseenApprovedCount,
            rejectedNotificationCount: unseenRejectedCount,
            onClick: markAllAsSeen,
        },
    ]

    // Modified hrefs to use 'view' param
    const adminMenu = [
        {
            title: "Jadwal Ruangan",
            description: "Cek ketersediaan ruangan.",
            icon: Calendar,
            href: "/dashboard?view=jadwal",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            notificationCount: undefined as number | undefined,
            rejectedNotificationCount: undefined as number | undefined,
            onClick: undefined as (() => void) | undefined,
        },
        {
            title: "Daftar Persetujuan",
            description: "Konfirmasi pengajuan baru.",
            icon: ClipboardCheck,
            href: "/dashboard?view=approval",
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
            notificationCount: undefined as number | undefined,
            rejectedNotificationCount: undefined as number | undefined,
            onClick: undefined as (() => void) | undefined,
        },
        {
            title: "Riwayat Peminjaman",
            description: "Arsip semua peminjaman (Selesai/Ditolak).",
            icon: History,
            href: "/admin/history",
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            notificationCount: undefined as number | undefined,
            rejectedNotificationCount: undefined as number | undefined,
            onClick: undefined as (() => void) | undefined,
        },
    ]

    const menuItems = user?.role === "admin" ? adminMenu : mahasiswaMenu

    // Consistent Navigation for Admin
    const AdminNavigation = () => (
        <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="flex gap-2 overflow-x-auto pb-1">
                <Button
                    variant={!activeTab ? "default" : "ghost"}
                    onClick={() => router.push("/dashboard")}
                    className="rounded-full gap-2"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </Button>
                <div className="w-px h-8 bg-border mx-2 self-center" />
                <Button
                    variant={activeTab === "jadwal" ? "default" : "ghost"}
                    onClick={() => router.push("/dashboard?view=jadwal")}
                    className="rounded-full gap-2"
                >
                    <Calendar className="w-4 h-4" />
                    Jadwal Ruangan
                </Button>
                <Button
                    variant={activeTab === "approval" ? "default" : "ghost"}
                    onClick={() => router.push("/dashboard?view=approval")}
                    className="rounded-full gap-2"
                >
                    <ClipboardCheck className="w-4 h-4" />
                    Daftar Persetujuan
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => router.push("/admin/history")}
                    className="rounded-full gap-2"
                >
                    <History className="w-4 h-4" />
                    Riwayat Peminjaman
                </Button>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
            >
                <LogOut className="w-4 h-4" />
                Logout
            </Button>
        </div>
    )

    if (user?.role === "admin" && activeTab) {
        return (
            <div className="max-w-6xl mx-auto pt-4 p-4">
                <AdminNavigation />
                {activeTab === "jadwal" && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Calendar className="w-5 h-5" /> Jadwal Ruangan
                        </h2>
                        <BookingGrid />
                    </div>
                )}
                {activeTab === "approval" && <AdminPanel />}
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pt-10 relative">
            {/* Only show Logout button if NOT in Admin Tab View (which has its own navbar now) */}
            <div className={`absolute top-0 right-0 ${user?.role === 'admin' && activeTab ? 'hidden' : ''}`}>
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </Button>
            </div>

            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                    Hi, {user?.username}
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Selamat datang di Sistem Peminjaman Ruangan & Alat Universitas. Silakan pilih menu di bawah ini.
                </p>
            </div>

            <div className={`grid gap-6 mx-auto ${user?.role === 'admin' ? 'md:grid-cols-3 max-w-5xl' : 'md:grid-cols-2 max-w-3xl'}`}>
                {menuItems.map((item) => (
                    <Link key={item.href} href={item.href} className="block group h-full" onClick={item.onClick}>
                        <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 cursor-pointer">
                            <CardHeader className="text-center pb-2">
                                <div className="relative w-16 h-16 mx-auto mb-4">
                                    <div className={`w-16 h-16 rounded-2xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon className={`h-8 w-8 ${item.color}`} />
                                    </div>
                                    {/* Green badge for approved */}
                                    {item.notificationCount && item.notificationCount > 0 && (
                                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white animate-pulse">
                                            {item.notificationCount}
                                        </div>
                                    )}
                                    {/* Red badge for rejected */}
                                    {item.rejectedNotificationCount && item.rejectedNotificationCount > 0 && (
                                        <div className={`absolute -top-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white animate-pulse ${item.notificationCount && item.notificationCount > 0 ? '-left-2' : '-right-2'}`}>
                                            {item.rejectedNotificationCount}
                                        </div>
                                    )}
                                </div>
                                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground mb-6">
                                    {item.description}
                                </p>
                                <div className="inline-flex items-center text-sm font-medium text-primary bg-primary/5 px-4 py-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                    Buka Menu <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
