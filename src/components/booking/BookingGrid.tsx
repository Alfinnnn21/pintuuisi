"use client"

import { useState } from "react"
import { useBooking } from "@/context/BookingContext"
import { useAuth } from "@/context/AuthContext"
import { ROOM_LIST, OPERATIONAL_HOURS } from "@/lib/constants"
import { BookingModal } from "./BookingModal"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Info } from "lucide-react"

export function BookingGrid() {
    const { bookings, addBooking } = useBooking()
    const { user } = useAuth()
    const [selectedSlots, setSelectedSlots] = useState<{ room: string, time: string }[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Date navigation state
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    // Format date for display
    const formatDisplayDate = (date: Date) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    }

    // Format date for comparison (YYYY-MM-DD)
    const formatDateISO = (date: Date) => {
        return date.toISOString().split('T')[0]
    }

    // Check if selected date is today
    const isToday = formatDateISO(selectedDate) === formatDateISO(new Date())

    // Navigation functions
    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() - 1)
        setSelectedDate(newDate)
        setSelectedSlots([]) // Clear selection when changing date
    }

    const goToNextDay = () => {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() + 1)
        setSelectedDate(newDate)
        setSelectedSlots([]) // Clear selection when changing date
    }

    const goToToday = () => {
        setSelectedDate(new Date())
        setSelectedSlots([])
    }

    // Handle date input change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value)
        if (!isNaN(newDate.getTime())) {
            setSelectedDate(newDate)
            setSelectedSlots([])
        }
    }

    // Helper to find booking for a cell - using selected date
    const getBooking = (room: string, time: string) => {
        const dateStr = formatDateISO(selectedDate)
        return bookings.find(b =>
            b.room === room &&
            b.time === time &&
            b.date === dateStr &&
            b.status !== "Ditolak"
        )
    }

    // Check if the selected date is in the past
    const isPastDate = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const selected = new Date(selectedDate)
        selected.setHours(0, 0, 0, 0)
        return selected < today
    }

    const toggleSlotSelection = (room: string, time: string) => {
        if (!user || user.role !== "mahasiswa") return
        if (isPastDate()) return // Cannot book past dates

        const existingBooking = getBooking(room, time)
        if (existingBooking) return // Cannot select booked slots

        setSelectedSlots(prev => {
            const isSelected = prev.some(slot => slot.room === room && slot.time === time)
            if (isSelected) {
                return prev.filter(slot => !(slot.room === room && slot.time === time))
            } else {
                return [...prev, { room, time }]
            }
        })
    }

    const handleBookingTrigger = () => {
        if (selectedSlots.length === 0) {
            alert("Pilih fasilitas dan waktu terlebih dahulu")
            return
        }
        setIsModalOpen(true)
    }

    const handleBookingSubmit = (data: any) => {
        if (user && selectedSlots.length > 0) {
            // Sort slots to ensure we identify the first/earliest one correctly
            const sortedSlots = [...selectedSlots].sort((a, b) => a.time.localeCompare(b.time))

            const newBookings = sortedSlots.map((slot, index) => {
                const { tipePeminjam, organisasi, waktuMulai, ...details } = data

                // Use custom start time for the first slot, otherwise use slot time
                const paramsTime = (index === 0 && waktuMulai) ? waktuMulai : slot.time

                return {
                    room: slot.room,
                    time: paramsTime,
                    date: formatDateISO(selectedDate), // Use selected date instead of today
                    user: user.username,
                    tipePeminjam,
                    organisasi,
                    details
                }
            })

            addBooking(newBookings)
            setSelectedSlots([]) // Clear selection after booking
        }
    }

    // Helper to get room details (mock data based on name)
    const getRoomDetails = (name: string) => {
        let det = { capacity: "30-40 Orang", facilities: ["AC", "Proyektor", "Whiteboard"] }

        if (name.includes("LAB")) det = { capacity: "20-30 Orang", facilities: ["AC", "PC Workstation", "Proyektor"] }
        else if (name.includes("AUDITORIUM")) det = { capacity: "150+ Orang", facilities: ["AC Central", "Sound System", "Videotron"] }
        else if (name.includes("HALAMAN") || name.includes("LOBBY")) det = { capacity: "Area Terbuka", facilities: ["Listrik (Terbatas)", "Area Luas"] }
        else if (name.includes("TRANSPORTASI")) det = { capacity: "Sesuai Kendaraan", facilities: ["Driver", "BBM", "AC"] }

        return det
    }

    return (
        <div className="space-y-4 relative">
            {/* Date Navigation */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Date Display and Navigation */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToPreviousDay}
                            className="border-slate-200 hover:bg-slate-100"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl min-w-[280px] justify-center">
                            <Calendar className="w-5 h-5 text-[#b91c1c]" />
                            <span className="font-semibold text-slate-800">
                                {formatDisplayDate(selectedDate)}
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToNextDay}
                            className="border-slate-200 hover:bg-slate-100"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Date Picker and Today Button */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={formatDateISO(selectedDate)}
                            onChange={handleDateChange}
                            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b91c1c]/20 focus:border-[#b91c1c]"
                        />
                        {!isToday && (
                            <Button
                                variant="outline"
                                onClick={goToToday}
                                className="border-[#b91c1c] text-[#b91c1c] hover:bg-[#b91c1c]/10"
                            >
                                Hari Ini
                            </Button>
                        )}
                    </div>
                </div>

                {/* Past Date Warning */}
                {isPastDate() && (
                    <div className="mt-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm flex items-center gap-2">
                        <span>⚠️</span>
                        <span>Anda sedang melihat jadwal tanggal yang sudah lewat. Peminjaman tidak dapat dilakukan untuk tanggal ini.</span>
                    </div>
                )}
            </div>

            {/* Floating Action Button for Booking */}
            {user?.role === "mahasiswa" && !isPastDate() && (
                <div className="fixed bottom-6 right-6 z-50 md:sticky md:top-4 md:flex md:justify-end md:mb-4 pointer-events-none">
                    <Button
                        size="lg"
                        className="shadow-xl pointer-events-auto bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-full md:rounded-lg px-6"
                        onClick={handleBookingTrigger}
                    >
                        <span className="md:hidden">+</span>
                        <span className="hidden md:inline">Pesan Fasilitas ({selectedSlots.length})</span>
                    </Button>
                </div>
            )}

            <div className="flex items-center gap-4 text-sm mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-slate-200 rounded"></div>
                    <span className="text-slate-600">Tersedia</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                    <span className="text-slate-600">Dipilih</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-100 border border-amber-200 rounded"></div>
                    <span className="text-slate-600">Menunggu Konfirmasi</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#b91c1c]/20 border border-[#b91c1c]/30 rounded"></div>
                    <span className="text-slate-600">Terisi / Disetujui</span>
                </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 font-medium sticky left-0 bg-slate-50 z-10 w-32 min-w-[120px] md:w-64 md:min-w-[200px]">
                                    <div className="flex items-center gap-1">
                                        Fasilitas
                                        <Info className="w-3 h-3 text-slate-400" />
                                    </div>
                                </th>
                                {OPERATIONAL_HOURS.map(hour => (
                                    <th key={hour} className="px-4 py-3 font-medium text-center min-w-[80px]">
                                        {hour}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {ROOM_LIST.map(room => (
                                <tr key={room} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-medium text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-200 group relative">
                                        <div className="flex items-center justify-between">
                                            <span className="truncate" title={room}>{room}</span>
                                            <Info className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        {/* Hover Tooltip Card */}
                                        <div className="absolute left-full top-0 ml-2 z-50 w-64 bg-slate-800 text-white text-xs rounded-xl p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none translate-x-2 group-hover:translate-x-0">
                                            <div className="font-bold mb-1 border-b border-white/20 pb-1 text-white">{room}</div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Kapasitas:</span>
                                                    <span>{getRoomDetails(room).capacity}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block mb-0.5">Fasilitas:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {getRoomDetails(room).facilities.map(f => (
                                                            <span key={f} className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{f}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Arrow */}
                                            <div className="absolute top-4 -left-1 w-2 h-2 bg-slate-800 rotate-45"></div>
                                        </div>
                                    </td>
                                    {OPERATIONAL_HOURS.map(hour => {
                                        const booking = getBooking(room, hour)
                                        const isSelected = selectedSlots.some(s => s.room === room && s.time === hour)
                                        const isPast = isPastDate()

                                        let cellClass = isPast
                                            ? "bg-slate-100 cursor-not-allowed"
                                            : "bg-white hover:bg-slate-50 cursor-pointer"
                                        let cellContent = null

                                        if (booking) {
                                            if (booking.status === "Menunggu") {
                                                cellClass = "bg-amber-100 hover:bg-amber-200 cursor-not-allowed"
                                            } else if (booking.status === "Disetujui") {
                                                cellClass = "bg-[#b91c1c]/20 hover:bg-[#b91c1c]/30 cursor-not-allowed"
                                            }
                                            cellContent = (
                                                <div className="text-xs font-medium truncate max-w-[80px] mx-auto text-slate-700" title={booking.user}>
                                                    {booking.user}
                                                </div>
                                            )
                                        } else if (isSelected) {
                                            cellClass = "bg-blue-100 hover:bg-blue-200 cursor-pointer border-blue-300"
                                        }

                                        return (
                                            <td
                                                key={`${room}-${hour}`}
                                                className={cn("px-2 py-2 border-r border-slate-100 last:border-r-0 transition-colors text-center", cellClass)}
                                                onClick={() => !booking && !isPast && toggleSlotSelection(room, hour)}
                                            >
                                                {cellContent}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleBookingSubmit}
                selectedSlots={selectedSlots}
                selectedDate={formatDisplayDate(selectedDate)}
            />
        </div>
    )
}
