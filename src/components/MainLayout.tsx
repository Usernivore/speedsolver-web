import React from 'react'
import { cn } from '../lib/utils'
import { useAppStore } from '../store'
import { Sidebar } from './Sidebar'
import { AVATARS } from '../lib/constants'

interface MainLayoutProps {
    children: React.ReactNode
    className?: string
    showNav?: boolean
}

export const MainLayout = ({ children, className, showNav = true }: MainLayoutProps) => {
    const setView = useAppStore((state) => state.setView)
    const currentView = useAppStore((state) => state.currentView)
    const userProfile = useAppStore((state) => state.userProfile)

    const isAppView = currentView === 'dashboard' || currentView === 'profile'

    return (
        <div className={cn(
            "min-h-screen w-full bg-[#121212] font-display text-white relative overflow-x-hidden selection:bg-primary/30 flex flex-col",
            className
        )}>
            {/* Global Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-grain opacity-[0.03] z-0"></div>

            {/* Header (Only if not in Quiz, Dashboard or Profile) */}
            {showNav && currentView !== 'quiz' && !isAppView && (
                <header className="relative z-20 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('setup')}>
                        <div className="text-primary flex items-center">
                            <span className="material-symbols-outlined text-3xl">thermostat</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight">
                            SpeedSolver <span className="text-zinc-500 font-light">//</span> <span className="italic font-serif">Termo</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-zinc-500 font-medium hidden sm:block uppercase">{userProfile.name}</span>
                        <div
                            onClick={() => setView('dashboard')}
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-white/5 cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundImage: `url("${AVATARS[userProfile.avatarId]}")` }}
                        />
                    </div>
                </header>
            )}

            {/* Content Area */}
            <div className={cn(
                "relative z-10 flex-1 flex w-full",
                isAppView ? "h-screen overflow-hidden" : "flex-col items-center justify-center max-w-7xl mx-auto px-4"
            )}>
                {isAppView && <Sidebar />}
                <main className={cn(
                    "flex-1",
                    isAppView ? "overflow-y-auto p-8" : "w-full flex flex-col items-center justify-center"
                )}>
                    {children}
                </main>
            </div>
        </div>
    )
}
