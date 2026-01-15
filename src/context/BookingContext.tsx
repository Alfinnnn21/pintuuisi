"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export interface Booking {
    id: string
    room: string
    date: string // YYYY-MM-DD
    time: string // HH:00
    user: string
    status: "Menunggu" | "Disetujui" | "Ditolak"
    tipePeminjam: "individu" | "ukm" | "ormawa"
    organisasi?: string
    alasanPenolakan?: string
    details: {
        keperluan: string
        alat: string[]
        kakFile?: string
    }
}

interface BookingContextType {
    bookings: Booking[]
    addBooking: (booking: Omit<Booking, "id" | "status"> | Omit<Booking, "id" | "status">[]) => Promise<void>
    updateBookingStatus: (id: string, status: Booking["status"], reason?: string) => Promise<void>
    cancelBooking: (id: string) => Promise<void>
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [bookings, setBookings] = useState<Booking[]>([])

    // Fetch initial data
    const fetchBookings = async () => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('waktu_mulai', { ascending: false })

        if (error) {
            console.error('Error fetching bookings:', error)
            return
        }

        if (data) {
            const formattedBookings: Booking[] = data.map((item: any) => {
                const dateObj = new Date(item.waktu_mulai)
                const date = dateObj.toISOString().split('T')[0]
                const time = dateObj.toTimeString().slice(0, 5) // HH:MM

                return {
                    id: item.id,
                    room: item.ruangan,
                    date: date,
                    time: time,
                    user: item.nama_peminjam,
                    status: item.status,
                    tipePeminjam: item.tipe_peminjam,
                    organisasi: item.organisasi,
                    alasanPenolakan: item.alasan_penolakan,
                    details: {
                        keperluan: item.keperluan,
                        alat: item.alat || [],
                        kakFile: undefined // Not in DB
                    }
                }
            })
            setBookings(formattedBookings)
        }
    }

    useEffect(() => {
        fetchBookings()

        const channel = supabase
            .channel('bookings_channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookings' },
                (payload) => {
                    console.log('Realtime change received!', payload)
                    fetchBookings() // Refresh data on any change
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const addBooking = async (bookingData: Omit<Booking, "id" | "status"> | Omit<Booking, "id" | "status">[]) => {
        const newBookingsData = Array.isArray(bookingData) ? bookingData : [bookingData]

        const dbPayloads = newBookingsData.map(b => ({
            ruangan: b.room,
            waktu_mulai: `${b.date}T${b.time}:00`, // Combine date and time
            tipe_peminjam: b.tipePeminjam,
            nama_peminjam: b.user,
            nim_peminjam: "-", // Fallback as per instruction
            organisasi: b.organisasi,
            keperluan: b.details.keperluan,
            alat: b.details.alat,
            status: "Menunggu"
        }))

        const { error } = await supabase
            .from('bookings')
            .insert(dbPayloads)

        if (error) {
            console.error('Error adding booking:', error)
            alert('Gagal menambah booking: ' + error.message)
        }
    }

    const updateBookingStatus = async (id: string, status: Booking["status"], reason?: string) => {
        const { error } = await supabase
            .from('bookings')
            .update({
                status: status,
                alasan_penolakan: reason
            })
            .eq('id', id)

        if (error) {
            console.error('Error updating status:', error)
            alert('Gagal update status: ' + error.message)
        }
    }

    const cancelBooking = async (id: string) => {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting booking:', error)
            alert('Gagal menghapus booking: ' + error.message)
        }
    }

    return (
        <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, cancelBooking }}>
            {children}
        </BookingContext.Provider>
    )
}

export function useBooking() {
    const context = useContext(BookingContext)
    if (context === undefined) {
        throw new Error("useBooking must be used within a BookingProvider")
    }
    return context
}
