"use client"

import { BookOpen } from "lucide-react"

export function Navbar() {
    return (
        <nav className="border-b bg-white dark:bg-slate-950 px-4 py-3 shadow-sm">
            <div className="container mx-auto flex items-center justify-center md:justify-start">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#b91c1c]/10 rounded-full">
                        <BookOpen className="h-6 w-6 text-[#b91c1c]" />
                    </div>
                    <span className="text-xl font-bold text-[#b91c1c]">
                        PINTU.UISI
                    </span>
                </div>
            </div>
        </nav>
    )
}
