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
    const streak = useAppStore((state) => state.streak)
    const isLegalView = currentView === 'privacy' || currentView === 'terms'
    const isAppView = (currentView === 'dashboard' || currentView === 'profile' || currentView === 'tools' || currentView === 'rankine' || currentView === 'interpolator' || currentView === 'unit-converter') && !isLegalView

    return (
        <div className={cn(
            "min-h-screen w-full bg-[#121212] font-display text-white relative overflow-x-hidden selection:bg-primary/30 flex flex-col",
            className
        )}>
            {/* Global Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-grain opacity-[0.03] z-0"></div>

            {/* Header (Only if not in Quiz, Dashboard or Profile) */}
            {showNav && currentView !== 'quiz' && !isAppView && (
                <header className="relative z-20 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5 bg-[#121212]/80 backdrop-blur-xl">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('setup')}>
                            <div className="bg-orange-500 rounded-lg size-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(255,87,34,0.3)] overflow-hidden">
                                <img src="/logo-speed.png" alt="Logo" className="w-full h-full object-contain p-1.5" />
                            </div>
                            <h2 className="text-xl font-black tracking-tighter uppercase italic">
                                SpeedSolver
                            </h2>
                        </div>

                        <nav className="hidden md:flex items-center gap-6 border-l border-white/10 pl-8 ml-2">
                            <button
                                onClick={() => setView('setup')}
                                className="flex items-center gap-2 group transition-all"
                            >
                                <span className="material-symbols-outlined text-[#FF5722] text-xl">thermometer</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF5722]/70 group-hover:text-[#FF5722]">Termo</span>
                            </button>

                            <button className="flex items-center gap-2 opacity-30 cursor-not-allowed group">
                                <span className="material-symbols-outlined text-[#0D47A1] text-xl">motion_photos_on</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D47A1]">Dinámica</span>
                            </button>

                            <button className="flex items-center gap-2 opacity-30 cursor-not-allowed group">
                                <span className="material-symbols-outlined text-[#03A9F4] text-xl">account_tree</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#03A9F4]">Estática</span>
                            </button>

                            <button
                                onClick={() => setView('tools')}
                                className="flex items-center gap-2 group relative transition-all"
                            >
                                <span className="material-symbols-outlined text-white text-xl">handyman</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white sparkle-text">Tools</span>
                            </button>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-xs text-zinc-300 font-bold uppercase">{userProfile.name}</span>
                            {streak > 1 && (
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px] text-orange-500 font-black animate-pulse uppercase tracking-tighter">Flame Streak x{streak}</span>
                                    <span className="material-symbols-outlined text-orange-500 text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                                </div>
                            )}
                        </div>
                        <div className="relative group">
                            <div
                                onClick={() => setView('dashboard')}
                                className={cn(
                                    "bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-white/5 cursor-pointer hover:opacity-80 transition-all",
                                    streak > 1 && "ring-2 ring-orange-500 ring-offset-2 ring-offset-[#121212] shadow-[0_0_15px_rgba(249,115,22,0.4)] animate-pulse"
                                )}
                                style={{ backgroundImage: `url("${AVATARS[userProfile.avatarId]}")` }}
                            />
                            {streak > 1 && (
                                <div className="absolute -top-1 -right-1 size-4 bg-orange-500 rounded-full flex items-center justify-center border-2 border-[#121212]">
                                    <span className="material-symbols-outlined text-white text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            )}

            {/* Content Area */}
            <div className={cn(
                "relative z-10 flex-1 flex w-full",
                isAppView ? "flex-col md:flex-row h-screen md:overflow-hidden" : "flex-col items-center justify-center max-w-7xl mx-auto px-4 py-8 md:py-12"
            )}>
                {isAppView && <Sidebar />}
                <main className={cn(
                    "flex-1 w-full",
                    isAppView ? "overflow-y-auto p-4 md:p-8" : "flex flex-col items-center justify-center"
                )}>
                    {children}
                </main>
            </div>

            {/* Global Legal Footer */}
            {!isAppView && currentView !== 'quiz' && (
                <footer className="relative z-20 py-8 px-6 border-t border-white/5 bg-black/20 mt-auto">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-zinc-600">
                        <p>© {new Date().getFullYear()} SpeedSolver Engine. All Rights Reserved.</p>
                        <div className="flex gap-6">
                            <button onClick={() => setView('privacy')} className="hover:text-primary transition-colors">Privacy Policy</button>
                            <button onClick={() => setView('terms')} className="hover:text-primary transition-colors">Terms of Service</button>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    )
}
