import { useAppStore } from '../store'
import { Button } from './Button'
import { cn } from '../lib/utils'

export const Sidebar = () => {
    const { setView, currentView, userProfile } = useAppStore()

    return (
        <aside className="w-full md:w-64 flex-shrink-0 bg-[#1E1E1E] border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between p-4 md:h-full">
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="bg-accent-cyan rounded-lg size-10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-background-dark font-bold">architecture</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-base font-bold leading-tight uppercase truncate max-w-[140px]">{userProfile.name.split(' ').pop()} Stats</h1>
                        <p className="text-primary/70 text-xs font-medium uppercase tracking-wider">Termodinámica</p>
                    </div>
                </div>
                <nav className="flex flex-col gap-1">
                    <button
                        onClick={() => setView('setup')}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                            currentView === 'setup' ? "bg-orange-500/10 text-orange-500" : "text-slate-400 hover:bg-orange-500/10 hover:text-orange-500"
                        )}
                    >
                        <span className="material-symbols-outlined transition-transform group-active:scale-95">thermometer</span>
                        <span className="text-sm font-bold uppercase tracking-tight">Termo</span>
                    </button>
                    <button
                        onClick={() => setView('dashboard')}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                            currentView === 'dashboard' ? "bg-accent-cyan/10 text-accent-cyan" : "text-slate-400 hover:bg-accent-cyan/10 hover:text-accent-cyan"
                        )}
                    >
                        <span className="material-symbols-outlined transition-transform group-active:scale-95" style={{ fontVariationSettings: currentView === 'dashboard' ? "'FILL' 1" : "" }}>analytics</span>
                        <span className="text-sm font-bold uppercase tracking-tight">Análisis</span>
                    </button>
                    <button
                        onClick={() => setView('profile')}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                            currentView === 'profile' ? "bg-zinc-100/10 text-white" : "text-slate-400 hover:bg-zinc-100/10 hover:text-white"
                        )}
                    >
                        <span className="material-symbols-outlined transition-transform group-active:scale-95" style={{ fontVariationSettings: currentView === 'profile' ? "'FILL' 1" : "" }}>person</span>
                        <span className="text-sm font-bold uppercase tracking-tight">Perfil</span>
                    </button>
                    <button
                        onClick={() => setView('tools')}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                            currentView === 'tools' ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"
                        )}
                    >
                        <span className="material-symbols-outlined transition-transform group-active:scale-95 sparkle-text" style={{ fontVariationSettings: currentView === 'tools' ? "'FILL' 1" : "" }}>handyman</span>
                        <span className="text-sm font-bold uppercase tracking-tight">Tools</span>
                    </button>
                </nav>
            </div>
            <div className="flex flex-col gap-4">
                <Button icon="add_circle" onClick={() => setView('setup')} className="py-2.5 text-sm bg-accent-cyan text-zinc-900 shadow-accent-cyan/20">
                    Nueva Sesión
                </Button>
            </div>
        </aside>
    )
}
