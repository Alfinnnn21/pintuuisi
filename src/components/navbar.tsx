"use client"

import { BookOpen, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const { logout } = useAuth()

    return (
        <nav className="border-b bg-white dark:bg-slate-950 px-4 py-3 shadow-sm">
            <div className="container mx-auto flex items-center justify-center md:justify-between relative">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#b91c1c]/10 rounded-full">
                        <BookOpen className="h-6 w-6 text-[#b91c1c]" />
                    </div>
                    <span className="text-xl font-bold text-[#b91c1c]">
                        PINTU.UISI
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="absolute right-0 md:static text-slate-500 hover:text-red-600 hover:bg-red-50"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </nav>
    )
}
