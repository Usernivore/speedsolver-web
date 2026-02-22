import { cn } from '../lib/utils';
import { useAppStore } from '../store';

interface ToolCardProps {
    title: string;
    description: string;
    icon: string;
    category: string;
    isComingSoon?: boolean;
    onClick?: () => void;
}

const ToolCard = ({ title, description, icon, category, isComingSoon = true, onClick }: ToolCardProps) => (
    <div
        onClick={isComingSoon ? undefined : onClick}
        className={cn(
            "group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300",
            isComingSoon ? "opacity-60 cursor-not-allowed" : "hover:border-primary/50 hover:bg-white/[0.08] cursor-pointer"
        )}>
        {/* Glow Effect */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />

        <div className="relative z-10 space-y-4">
            <div className="flex items-start justify-between">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5 group-hover:border-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
                </div>
                {isComingSoon && (
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/10 px-2 py-1 rounded text-zinc-400">
                        Coming Soon
                    </span>
                )}
            </div>

            <div>
                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1">{category}</p>
                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                <span className="material-symbols-outlined text-sm">terminal</span>
                <span>Ready for v2.6.0-beta</span>
            </div>
        </div>
    </div>
);

export const ToolsView = () => {
    const setView = useAppStore((state) => state.setView);
    const tools = [
        {
            title: "Linear Interpolator",
            description: "Herramienta de precisión para el cálculo de valores intermedios en tablas termodinámicas.",
            icon: "analytics",
            category: "General/Math",
            isComingSoon: false,
            onClick: () => setView('interpolator')
        },
        {
            title: "Rankine Cycle Analyzer",
            description: "Simulación de ciclos de potencia simples con cálculos de eficiencia y trabajo neto.",
            icon: "water_drop",
            category: "Termodinámica",
            isComingSoon: false,
            onClick: () => setView('rankine')
        },
        {
            title: "Vector Calculator",
            description: "Suma, resta y producto vectorial en 3D para análisis de estática y dinámica.",
            icon: "dynamic_form",
            category: "Estática/Física"
        },
        {
            title: "Unit Converter",
            description: "Conversión masiva de presiones, volúmenes, temperaturas y energías para ingeniería.",
            icon: "sync_alt",
            category: "General",
            isComingSoon: false,
            onClick: () => setView('unit-converter')
        },
        {
            title: "Psychrometric Pro",
            description: "Análisis de aire húmedo: humedad relativa, punto de rocío y entalpía.",
            icon: "air",
            category: "Termodinámica"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 px-4 md:px-0">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase italic">
                    Panel de <span className="text-primary">Herramientas</span>
                </h2>
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-white/10" />
                    <p className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-[0.2em]">
                        Engineering Grid // v2.6 Ready
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {tools.map((tool, index) => (
                    <ToolCard key={index} {...tool} />
                ))}
            </div>

            {/* Maintenance/Status Footer */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Calculators Engine: Operational</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase">
                    Build: SS-TOOLS-GRID-2024
                </div>
            </div>
        </div>
    );
};
