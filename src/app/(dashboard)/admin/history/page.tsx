"use client"

import { useBooking } from "@/context/BookingContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { LayoutDashboard, Calendar, ClipboardCheck, History, LogOut } from "lucide-react"

export default function AdminHistoryPage() {
    const { bookings } = useBooking()
    const router = useRouter()
    const { logout } = useAuth()

    // Filter for completed bookings (Approved or Rejected)
    const historyBookings = bookings
        .filter(b => b.status !== "Menunggu")
        .sort((a, b) => {
            // Sort by date/time descending (newest first)
            const dateA = new Date(`${a.date}T${a.time}`)
            const dateB = new Date(`${b.date}T${b.time}`)
            return dateB.getTime() - dateA.getTime()
        })

    return (
        <div className="max-w-6xl mx-auto pt-4 p-4">
            {/* Navigation Bar - Updated with white palette and red accents */}
            <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard")}
                        className="rounded-full gap-2 hover:bg-slate-100"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Button>
                    <div className="w-px h-8 bg-border mx-2 self-center" />
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard?view=jadwal")}
                        className="rounded-full gap-2 hover:bg-slate-100"
                    >
                        <Calendar className="w-4 h-4" />
                        Jadwal Ruangan
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard?view=approval")}
                        className="rounded-full gap-2 hover:bg-slate-100"
                    >
                        <ClipboardCheck className="w-4 h-4" />
                        Daftar Persetujuan
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-full gap-2 bg-white border-2 border-slate-200 text-slate-800 shadow-sm"
                    >
                        <History className="w-4 h-4" />
                        Riwayat Peminjaman
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </Button>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                        <History className="w-5 h-5 text-[#b91c1c]" />
                        Semua Riwayat Peminjaman
                    </h2>
                </div>

                {(() => {
                    // 1. Filter Completed
                    const completedBookings = bookings.filter(b => b.status !== "Menunggu")

                    // 2. Sort for Grouping (Date ASC, Room, User, Time ASC)
                    completedBookings.sort((a, b) => {
                        if (a.date !== b.date) return a.date.localeCompare(b.date)
                        if (a.room !== b.room) return a.room.localeCompare(b.room)
                        if (a.user !== b.user) return a.user.localeCompare(b.user)
                        return a.time.localeCompare(b.time)
                    })

                    // 3. Grouping Logic
                    const groupedHistoryArray: any[] = []

                    completedBookings.forEach(booking => {
                        const hour = parseInt(booking.time.split(':')[0])
                        const lastGroup = groupedHistoryArray[groupedHistoryArray.length - 1]

                        const isSameRoom = lastGroup?.room === booking.room
                        const isSameDate = lastGroup?.date === booking.date
                        const isSameUser = lastGroup?.user === booking.user
                        const isSameStatus = lastGroup?.status === booking.status

                        // Check consecutive hours (e.g. 10 follows 9, or same hour if minutes differ)
                        const isConsecutive = lastGroup && (hour === lastGroup.lastHour + 1 || hour === lastGroup.lastHour)

                        if (isSameRoom && isSameDate && isSameUser && isSameStatus && isConsecutive) {
                            lastGroup.ids.push(booking.id)
                            lastGroup.lastHour = hour
                            const endH = hour + 1
                            lastGroup.endTime = `${endH.toString().padStart(2, '0')}:00`
                        } else {
                            const endH = hour + 1
                            groupedHistoryArray.push({
                                ids: [booking.id],
                                room: booking.room,
                                date: booking.date,
                                user: booking.user,
                                startTime: booking.time,
                                endTime: `${endH.toString().padStart(2, '0')}:00`,
                                status: booking.status,
                                tipePeminjam: booking.tipePeminjam,
                                organisasi: booking.organisasi,
                                details: booking.details,
                                alasanPenolakan: booking.alasanPenolakan,
                                lastHour: hour
                            })
                        }
                    })

                    // 4. Sort Groups for Display (Date DESC, StartTime DESC) - Newest First
                    groupedHistoryArray.sort((a, b) => {
                        const dateA = new Date(`${a.date}T${a.startTime}`)
                        const dateB = new Date(`${b.date}T${b.startTime}`)
                        return dateB.getTime() - dateA.getTime()
                    })

                    if (groupedHistoryArray.length === 0) {
                        return (
                            <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                Belum ada riwayat peminjaman yang selesai.
                            </div>
                        )
                    }

                    return (
                        <div className="grid gap-4">
                            {groupedHistoryArray.map((group, idx) => (
                                <Card key={`${group.ids[0]}-${idx}`} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-base text-slate-800">{group.room}</CardTitle>
                                                <div className="text-sm text-slate-500">
                                                    {group.date} | {group.startTime} - {group.endTime}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${group.status === "Disetujui"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                {group.status}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div className="space-y-1">
                                                <div><span className="font-medium text-slate-700">Peminjam:</span> <span className="text-slate-600">{group.user}</span></div>
                                                {group.organisasi && (
                                                    <div>
                                                        <span className="font-medium text-slate-700">
                                                            {group.tipePeminjam === "ukm" ? "Asal UKM:" : "Asal Himpunan:"}
                                                        </span>{" "}
                                                        <span className="text-slate-600">{group.organisasi}</span>
                                                    </div>
                                                )}
                                                <div><span className="font-medium text-slate-700">Keperluan:</span> <span className="text-slate-600">{group.details.keperluan}</span></div>
                                            </div>

                                            {group.status === "Ditolak" && group.alasanPenolakan && (
                                                <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-red-800">
                                                    <span className="font-medium block mb-1">Alasan Penolakan:</span>
                                                    {group.alasanPenolakan}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )
                })()}
            </div>
        </div>
    )
}
