import React, { useEffect } from 'react'
import { cn } from '../lib/utils'

interface ToastProps {
    message: string
    isVisible: boolean
    onClose: () => void
}

export const Toast = ({ message, isVisible, onClose }: ToastProps) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose])

    if (!isVisible) return null

    return (
        <div className={cn(
            "fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 bg-black border border-green-500/50 rounded-xl shadow-2xl shadow-green-500/10",
            "animate-in fade-in slide-in-from-bottom-4 duration-300"
        )}>
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <span className="text-white font-medium tracking-tight">{message}</span>
        </div>
    )
}
