"use client"

import { useState } from "react"
import { useBooking } from "@/context/BookingContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ClipboardCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function AdminPanel() {
    const { bookings, updateBookingStatus } = useBooking()
    const [rejectIds, setRejectIds] = useState<string[] | null>(null)
    const [rejectReason, setRejectReason] = useState("")

    const pendingBookings = bookings.filter(b => b.status === "Menunggu")

    // Group bookings logic
    const groupBookings = (bookings: typeof pendingBookings) => {
        const groups: Record<string, {
            ids: string[],
            times: string[],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            details: any,
            user: string,
            date: string,
            room: string,
            tipePeminjam: string,
            organisasi?: string
        }> = {}

        bookings.forEach(booking => {
            const key = `${booking.date}-${booking.room}-${booking.user}-${booking.details.keperluan}`

            if (!groups[key]) {
                groups[key] = {
                    ids: [],
                    times: [],
                    details: booking.details,
                    user: booking.user,
                    date: booking.date,
                    room: booking.room,
                    tipePeminjam: booking.tipePeminjam,
                    organisasi: booking.organisasi
                }
            }
            groups[key].ids.push(booking.id)
            groups[key].times.push(booking.time)
        })

        return Object.values(groups).map(group => {
            const sortedTimes = group.times.sort()
            const startTime = sortedTimes[0]
            // Simple logic: last time + 1 hour. 
            // Assumption: slots are hourly "HH:00". 
            // If time is "08:00", end is "09:00".
            const lastTime = sortedTimes[sortedTimes.length - 1]
            const [lastHour] = lastTime.split(':')
            const endHour = parseInt(lastHour) + 1
            const endTime = `${endHour.toString().padStart(2, '0')}:00`

            return {
                ...group,
                startTime,
                endTime
            }
        })
    }

    const groupedBookings = groupBookings(pendingBookings)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const safeRenderAlat = (alat: any) => {
        if (!alat) return '-'
        if (Array.isArray(alat)) return alat.join(', ')
        if (typeof alat === 'string') {
            if (alat.startsWith('[')) {
                try {
                    const parsed = JSON.parse(alat)
                    return Array.isArray(parsed) ? parsed.join(', ') : parsed
                } catch {
                    return alat
                }
            }
            return alat
        }
        return '-'
    }


    const handleRejectClick = (ids: string[]) => {
        setRejectIds(ids)
        setRejectReason("")
    }

    const confirmReject = async () => {
        if (rejectIds && rejectReason.trim()) {
            // Process all rejections
            await Promise.all(rejectIds.map(id =>
                updateBookingStatus(id, "Ditolak", rejectReason)
            ))
            setRejectIds(null)
        }
    }

    const handleBulkApprove = async (ids: string[]) => {
        await Promise.all(ids.map(id =>
            updateBookingStatus(id, "Disetujui")
        ))
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#b91c1c]" />
                Daftar Persetujuan Peminjaman
            </h2>
            {groupedBookings.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    Tidak ada permintaan peminjaman yang menunggu persetujuan.
                </div>
            ) : (
                <div className="grid gap-4">
                    {groupedBookings.map((group, index) => (
                        <Card key={`${group.date}-${group.room}-${index}`} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-base text-slate-800">{group.room}</CardTitle>
                                        <CardDescription className="text-slate-500">
                                            {group.date} | {group.startTime} - {group.endTime}
                                        </CardDescription>
                                    </div>
                                    <div className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-medium">
                                        Menunggu ({group.ids.length} Slot)
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium text-slate-700">Peminjam:</span> <span className="text-slate-600">{group.user}</span>
                                    </div>
                                    {group.tipePeminjam === "ukm" && (
                                        <div>
                                            <span className="font-medium text-slate-700">Asal UKM:</span> <span className="text-slate-600">{group.organisasi}</span>
                                        </div>
                                    )}
                                    {group.tipePeminjam === "ormawa" && (
                                        <div>
                                            <span className="font-medium text-slate-700">Asal Himpunan:</span> <span className="text-slate-600">{group.organisasi}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-medium text-slate-700">Keperluan:</span> <span className="text-slate-600">{group.details.keperluan}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-700">Alat:</span> <span className="text-slate-600">{safeRenderAlat(group.details.alat)}</span>
                                    </div>
                                    {group.details.kakFile && (
                                        <div>
                                            <span className="font-medium text-slate-700">File KAK:</span> <span className="text-slate-600">{group.details.kakFile}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRejectClick(group.ids)}
                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4 mr-1" /> Tolak
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleBulkApprove(group.ids)}
                                    >
                                        <Check className="w-4 h-4 mr-1" /> Setujui
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!rejectIds} onOpenChange={(open) => !open && setRejectIds(null)}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-slate-800">Masukkan Alasan Penolakan</DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Jelaskan mengapa permohonan ini ditolak (akan diterapkan pada {rejectIds?.length} slot yang dipilih).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-slate-700">Alasan</Label>
                            <Textarea
                                id="reason"
                                placeholder="Contoh: Ruangan sedang direnovasi, Jadwal bentrok dengan kegiatan fakultas, dll."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="border-slate-200 focus:border-[#b91c1c] focus:ring-[#b91c1c]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectIds(null)} className="border-slate-200">Batal</Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={confirmReject}
                            disabled={!rejectReason.trim()}
                        >
                            Kirim Penolakan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
