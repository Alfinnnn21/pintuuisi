"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { BookingGrid } from "@/components/booking/BookingGrid"
import { AdminPanel } from "@/components/admin/AdminPanel"
import { Button } from "@/components/ui/button"
import { useBooking } from "@/context/BookingContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, LayoutDashboard, Download, Calendar, History, ClipboardCheck, Check } from "lucide-react"

function LoanPageContent() {
    const { user, logout } = useAuth()
    const { bookings, cancelBooking } = useBooking()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"grid" | "history" | "admin">("grid")
    const [showToast, setShowToast] = useState(false)

    useEffect(() => {
        const tab = searchParams.get("tab")
        if (tab === "history" && user?.role === "mahasiswa") {
            setActiveTab("history")
        } else if (tab === "admin" && user?.role === "admin") {
            setActiveTab("admin")
        } else {
            setActiveTab("grid")
        }
    }, [searchParams, user])

    // Function to generate and download approval letter
    const downloadApprovalLetter = (group: {
        room: string
        date: string
        startTime: string
        endTime: string
        details: any
    }) => {
        const keperluan = group.details?.keperluan || '-'
        const alat = group.details?.alat || []

        // Format dates
        const bookingDateObj = new Date(group.date)
        const todayDate = new Date()

        const formatDateIndonesian = (date: Date) => {
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
            return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        }

        const formatDateShort = (date: Date) => {
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        }

        const bookingDate = formatDateIndonesian(bookingDateObj)
        const todayFormatted = formatDateShort(todayDate)
        const month = String(todayDate.getMonth() + 1).padStart(2, '0')
        const year = todayDate.getFullYear()

        // Generate nomor surat
        const nomorSurat = `03/KI.02/03-01.05.04/01.${String(Date.now()).slice(-2)}`

        // UISI Logo as base64 (simple text-based logo for HTML)
        const letterContent = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Korespondensi Intern - Peminjaman Ruangan</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 20mm; }
        body { 
            font-family: 'Times New Roman', Times, serif; 
            padding: 20px 40px; 
            line-height: 1.5;
            color: #000;
            font-size: 12pt;
            background: white;
        }
        .header { 
            display: flex;
            align-items: center;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .logo {
            width: 80px;
            margin-right: 15px;
        }
        .logo img {
            width: 100%;
        }
        .logo-placeholder {
            width: 70px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            color: #c00;
            border: 2px solid #c00;
            border-radius: 50%;
        }
        .header-text {
            flex: 1;
        }
        .header-text .foundation {
            font-size: 10pt;
            font-weight: bold;
        }
        .header-text .university {
            font-size: 14pt;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .document-title {
            text-align: center;
            margin: 20px 0;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
        }
        .document-title h2 {
            font-size: 12pt;
            text-decoration: underline;
            margin-bottom: 3px;
        }
        .document-title .nomor {
            font-size: 11pt;
        }
        .meta-table {
            width: 100%;
            margin-bottom: 15px;
        }
        .meta-table td {
            padding: 2px 5px;
            font-size: 12pt;
            vertical-align: top;
        }
        .meta-table td:first-child {
            width: 100px;
        }
        .content {
            text-align: justify;
            margin: 15px 0;
        }
        .content p {
            margin-bottom: 10px;
            text-indent: 40px;
        }
        .info-table {
            margin: 15px 0 15px 40px;
        }
        .info-table td {
            padding: 3px 5px;
            font-size: 12pt;
            vertical-align: top;
        }
        .info-table td:first-child {
            width: 120px;
        }
        .signature-section {
            margin-top: 30px;
            text-align: right;
            padding-right: 30px;
        }
        .signature-section p {
            font-size: 12pt;
            margin: 3px 0;
        }
        .signature-name {
            margin-top: 60px;
            font-weight: bold;
            text-decoration: underline;
        }
        .signature-nip {
            font-size: 11pt;
        }
        .disposisi-box {
            margin-top: 30px;
            border: 1px solid #000;
            padding: 10px;
        }
        .disposisi-box .label {
            font-weight: bold;
            margin-bottom: 50px;
        }
        .page-break {
            page-break-before: always;
        }
        .lampiran-title {
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 20px;
        }
        .lampiran-section {
            margin: 15px 0;
        }
        .lampiran-section .label {
            font-weight: bold;
        }
        .sarana-list {
            margin: 10px 0 10px 20px;
        }
        .sarana-list li {
            margin-bottom: 3px;
        }
        .pic-section {
            margin-top: 20px;
        }
        .stamp-approved {
            margin-top: 20px;
            display: inline-block;
            padding: 8px 20px;
            border: 3px solid #22c55e;
            color: #22c55e;
            font-weight: bold;
            font-size: 14pt;
            transform: rotate(-5deg);
        }
        @media print {
            body { padding: 0; }
            .page-break { page-break-before: always; }
        }
    </style>
</head>
<body>
    <!-- Page 1: Surat Utama -->
    <div class="header">
        <div class="logo">
            <div class="logo-placeholder">UISI</div>
        </div>
        <div class="header-text">
            <div class="foundation">YAYASAN SEMEN INDONESIA/SEMEN INDONESIA FOUNDATION</div>
            <div class="university">UNIVERSITAS INTERNASIONAL SEMEN INDONESIA</div>
        </div>
    </div>

    <div class="document-title">
        <h2>KORESPONDENSI INTERN</h2>
        <div class="nomor">Nomor: ${nomorSurat}</div>
    </div>

    <table class="meta-table">
        <tr>
            <td>Kepada Yth.</td>
            <td>: Kepala Bagian Sarana Prasarana dan Lingkungan Hijau</td>
        </tr>
        <tr>
            <td>Dari</td>
            <td>: ${user?.username || 'Pemohon'}</td>
        </tr>
        <tr>
            <td>Lampiran</td>
            <td>: 1 lampiran</td>
        </tr>
        <tr>
            <td>Perihal</td>
            <td>: <strong>Permohonan Peminjaman Ruangan dan Sarana Prasarana</strong></td>
        </tr>
    </table>

    <div class="content">
        <p>Dengan Hormat,</p>
        
        <p>Sehubungan dengan akan dilaksanakannya Kegiatan <strong>${keperluan}</strong>, maka dengan ini mengajukan Permintaan Peminjaman Ruangan dan Sarana Prasarana yang kami lampirkan pada:</p>

        <table class="info-table">
            <tr>
                <td>Hari, Tanggal</td>
                <td>: ${bookingDate}</td>
            </tr>
            <tr>
                <td>Waktu</td>
                <td>: ${group.startTime} - ${group.endTime} WIB</td>
            </tr>
            <tr>
                <td>Ruang</td>
                <td>: ${group.room}</td>
            </tr>
            <tr>
                <td>Agenda</td>
                <td>: ${keperluan}</td>
            </tr>
        </table>

        <p>Maka dengan ini mengajukan Permintaan Peminjaman Ruangan dan Sarana Prasarana yang kami lampirkan. Demikian surat permohonan ini kami sampaikan, atas perhatian dan terpenuhinya permohonan ini, kami ucapkan terima kasih.</p>
    </div>

    <div class="signature-section">
        <p>Gresik, ${todayFormatted}</p>
        <p>Pemohon</p>
        <p class="signature-name">${user?.username || 'Pemohon'}</p>
        <div class="stamp-approved">✓ DISETUJUI</div>
    </div>

    <div class="disposisi-box" style="clear: both; margin-top: 80px;">
        <div class="label">Disposisi :</div>
    </div>

    <!-- Page 2: Lampiran -->
    <div class="page-break"></div>
    
    <div class="lampiran-title">Lampiran</div>

    <div class="lampiran-section">
        <p><span class="label">Ruangan</span></p>
        <p>${group.room}</p>
    </div>

    <div class="lampiran-section">
        <p><span class="label">Tanggal</span></p>
        <p>${bookingDate}</p>
    </div>

    <div class="lampiran-section">
        <p><span class="label">Waktu</span></p>
        <p>${group.startTime} - ${group.endTime} WIB</p>
    </div>

    <div class="lampiran-section">
        <p><span class="label">Kegiatan</span></p>
        <p>${keperluan}</p>
    </div>

    ${alat && alat.length > 0 ? `
    <div class="lampiran-section">
        <p><span class="label">Sarana Prasarana</span></p>
        <ul class="sarana-list">
            ${alat.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <div class="pic-section">
        <p><span class="label">PIC Acara</span></p>
        <p>${user?.username || 'Pemohon'}</p>
    </div>

</body>
</html>
        `

        // Create blob and download
        const blob = new Blob([letterContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Korespondensi_Intern_${group.room.replace(/\s+/g, '_')}_${group.date}.html`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 4000)
    }

    if (!user) {
        return <div className="p-8 text-center text-slate-500">Silakan login terlebih dahulu.</div>
    }

    const myBookings = bookings.filter(b => b.user.toLowerCase() === user.username.toLowerCase())

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-4 md:space-y-6 pb-20 md:pb-4">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 md:bottom-4 md:top-auto z-50 animate-in slide-in-from-top md:slide-in-from-bottom fade-in duration-300">
                    <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                        <div className="bg-white/20 p-1 rounded-full">
                            <Check className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Download Berhasil</p>
                            <p className="text-xs text-green-100">Bukti telah disetujui oleh admin.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Tabs - Updated for Mobile Ergonomics (Scrollable) */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm md:static md:bg-transparent -mx-4 px-4 py-2 border-b border-slate-200 md:border-b md:pb-2">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 mask-linear-fade w-full md:w-auto">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/")}
                            className="rounded-full gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 flex-shrink-0"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Button>

                        <div className="w-px h-6 bg-slate-200 mx-1 self-center flex-shrink-0" />

                        <Button
                            variant={activeTab === "grid" ? "outline" : "ghost"}
                            onClick={() => setActiveTab("grid")}
                            className={`rounded-full gap-2 flex-shrink-0 ${activeTab === "grid" ? "bg-white border-slate-200 text-[#b91c1c] font-medium shadow-sm ring-1 ring-slate-100" : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"}`}
                        >
                            <Calendar className="w-4 h-4" />
                            Jadwal
                        </Button>

                        {user.role === "mahasiswa" && (
                            <Button
                                variant={activeTab === "history" ? "outline" : "ghost"}
                                onClick={() => setActiveTab("history")}
                                className={`rounded-full gap-2 flex-shrink-0 ${activeTab === "history" ? "bg-white border-slate-200 text-[#b91c1c] font-medium shadow-sm ring-1 ring-slate-100" : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"}`}
                            >
                                <History className="w-4 h-4" />
                                Riwayat
                            </Button>
                        )}

                        {user.role === "admin" && (
                            <>
                                <Button
                                    variant={activeTab === "admin" ? "outline" : "ghost"}
                                    onClick={() => setActiveTab("admin")}
                                    className={`rounded-full gap-2 flex-shrink-0 ${activeTab === "admin" ? "bg-white border-slate-200 text-[#b91c1c] font-medium shadow-sm ring-1 ring-slate-100" : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"}`}
                                >
                                    <ClipboardCheck className="w-4 h-4" />
                                    Approval
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => router.push("/admin/history")}
                                    className="rounded-full gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 flex-shrink-0"
                                >
                                    <History className="w-4 h-4" />
                                    Semua Riwayat
                                </Button>
                            </>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={logout}
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {activeTab === "grid" && (
                <div className="animate-in fade-in duration-500">
                    <BookingGrid />
                </div>
            )}

            {/* ... rest of components ... */}

            {activeTab === "admin" && user.role === "admin" && (
                <AdminPanel />
            )}

            {activeTab === "history" && user.role === "mahasiswa" && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                        <History className="w-5 h-5 text-[#b91c1c]" />
                        Riwayat Peminjaman Saya
                    </h2>
                    {(() => {
                        // Grouping Logic
                        const groupStudentBookings = (bookings: typeof myBookings) => {
                            const sorted = [...bookings].sort((a, b) => {
                                if (a.room !== b.room) return a.room.localeCompare(b.room)
                                if (a.date !== b.date) return a.date.localeCompare(b.date)
                                return a.time.localeCompare(b.time)
                            })

                            const groups: {
                                ids: string[]
                                room: string
                                date: string
                                startTime: string
                                endTime: string
                                status: string
                                details: any
                                alasanPenolakan?: string
                                lastHour: number
                            }[] = []

                            sorted.forEach(booking => {
                                const hour = parseInt(booking.time.split(':')[0])
                                const lastGroup = groups[groups.length - 1]

                                const isSameRoom = lastGroup && lastGroup.room === booking.room
                                const isSameDate = lastGroup && lastGroup.date === booking.date
                                // Allow same hour (multiple slots?) or consecutive (current == last + 1)
                                const isConsecutive = lastGroup && (hour === lastGroup.lastHour + 1 || hour === lastGroup.lastHour)

                                if (isSameRoom && isSameDate && isConsecutive) {
                                    lastGroup.ids.push(booking.id)
                                    lastGroup.lastHour = hour
                                    const endH = hour + 1
                                    lastGroup.endTime = `${endH.toString().padStart(2, '0')}:00`
                                } else {
                                    const endH = hour + 1
                                    groups.push({
                                        ids: [booking.id],
                                        room: booking.room,
                                        date: booking.date,
                                        startTime: booking.time,
                                        endTime: `${endH.toString().padStart(2, '0')}:00`,
                                        status: booking.status,
                                        details: booking.details,
                                        alasanPenolakan: booking.alasanPenolakan,
                                        lastHour: hour
                                    })
                                }
                            })
                            return groups
                        }

                        const groupedMyBookings = groupStudentBookings(myBookings)

                        const handleBulkCancel = async (ids: string[]) => {
                            if (confirm("Apakah Anda yakin ingin membatalkan peminjaman ini?")) {
                                await Promise.all(ids.map(id => cancelBooking(id)))
                            }
                        }

                        if (groupedMyBookings.length === 0) {
                            return (
                                <div className="text-center py-8 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                    Belum ada riwayat peminjaman.
                                </div>
                            )
                        }

                        return (
                            <div className="grid gap-4">
                                {groupedMyBookings.map((group, idx) => (
                                    <Card key={`${group.ids[0]}-${idx}`} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-base text-slate-800">{group.room}</CardTitle>
                                                    <div className="text-sm text-slate-500">
                                                        {group.date} | {group.startTime} - {group.endTime}
                                                    </div>
                                                </div>
                                                <div className={`text-xs px-3 py-1 rounded-full font-medium ${group.status === "Menunggu" ? "bg-amber-100 text-amber-800" :
                                                    group.status === "Disetujui" ? "bg-green-100 text-green-700" :
                                                        "bg-red-100 text-red-700"
                                                    }`}>
                                                    {group.status}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                <div className="space-y-1">
                                                    <div><span className="font-medium text-slate-700">Keperluan:</span> <span className="text-slate-600">{group.details.keperluan}</span></div>
                                                </div>

                                                <div className="flex justify-end items-start gap-2">
                                                    {group.status === "Menunggu" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleBulkCancel(group.ids)}
                                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            Batalkan Permintaan
                                                        </Button>
                                                    )}

                                                    {group.status === "Disetujui" && (
                                                        <Button
                                                            className="bg-[#b91c1c] hover:bg-[#991b1b] text-white flex gap-2 items-center"
                                                            size="sm"
                                                            onClick={() => downloadApprovalLetter(group)}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download Bukti Korin
                                                        </Button>
                                                    )}

                                                    {group.status === "Ditolak" && group.alasanPenolakan && (
                                                        <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-red-800 text-xs w-full text-left">
                                                            <span className="font-bold block mb-1">Catatan Admin:</span>
                                                            {group.alasanPenolakan}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )
                    })()}
                </div>
            )}
        </div>
    )
}

export default function LoanPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}>
            <LoanPageContent />
        </Suspense>
    )
}
