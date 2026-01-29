import React from 'react'
import { cn } from '../lib/utils'

interface ProgressBarProps {
    progress: number // 0 to 100
    className?: string
    colorClassName?: string
}

export const ProgressBar = ({ progress, className, colorClassName }: ProgressBarProps) => {
    return (
        <div className={cn("w-full h-1 bg-white/5 overflow-hidden", className)}>
            <div
                className={cn("h-full bg-accent-cyan/40 transition-all duration-300", colorClassName)}
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}
