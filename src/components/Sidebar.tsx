import { useAppStore } from '../store'
import { Button } from './Button'

export const Sidebar = () => {
    const { setView, currentView, userProfile } = useAppStore()

    return (
        <aside className="w-64 flex-shrink-0 bg-[#1E1E1E] border-r border-white/5 flex flex-col justify-between p-4 h-full">
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
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-accent-cyan/10 hover:text-accent-cyan transition-colors"
                    >
                        <span className="material-symbols-outlined">home</span>
                        <span className="text-sm font-medium">Inicio</span>
                    </button>
                    <button
                        onClick={() => setView('dashboard')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-slate-400 hover:bg-accent-cyan/10 hover:text-accent-cyan'}`}
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: currentView === 'dashboard' ? "'FILL' 1" : "" }}>analytics</span>
                        <span className="text-sm font-medium">Análisis & Stats</span>
                    </button>
                    <button
                        onClick={() => setView('profile')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'profile' ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-slate-400 hover:bg-accent-cyan/10 hover:text-accent-cyan'}`}
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: currentView === 'profile' ? "'FILL' 1" : "" }}>person</span>
                        <span className="text-sm font-medium">Mi Perfil</span>
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
