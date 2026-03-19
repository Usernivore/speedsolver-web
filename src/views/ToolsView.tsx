import { cn } from '../lib/utils';
import { useAppStore } from '../store';
import { useTranslation } from 'react-i18next';

interface ToolCardProps {
    title: string;
    description: string;
    icon: string;
    category: string;
    discipline?: 'thermo' | 'dynamics' | 'statics' | 'circuits' | 'math' | 'general';
    isComingSoon?: boolean;
    onClick?: () => void;
}

const ToolCard = ({ title, description, icon, category, discipline = 'general', isComingSoon = true, onClick }: ToolCardProps) => {
    const { t } = useTranslation();

    const disciplineColors = {
        thermo: 'text-orange-500',
        dynamics: 'text-blue-500',
        statics: 'text-green-500',
        circuits: 'text-purple-500',
        math: 'text-red-500',
        general: 'text-zinc-500'
    };

    const disciplineGlows = {
        thermo: 'bg-orange-500/5 group-hover:bg-orange-500/10',
        dynamics: 'bg-blue-500/5 group-hover:bg-blue-500/10',
        statics: 'bg-green-500/5 group-hover:bg-green-500/10',
        circuits: 'bg-purple-500/5 group-hover:bg-purple-500/10',
        math: 'bg-red-500/5 group-hover:bg-red-500/10',
        general: 'bg-primary/5 group-hover:bg-primary/10'
    };

    const iconColor = disciplineColors[discipline];
    const glowColor = disciplineGlows[discipline];

    return (
        <div
            onClick={isComingSoon ? undefined : onClick}
            className={cn(
                "group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300",
                isComingSoon ? "opacity-60 cursor-not-allowed" : "hover:border-white/20 hover:bg-white/[0.08] cursor-pointer"
            )}>
            {/* Glow Effect */}
            <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl transition-all", glowColor)} />

            <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5 group-hover:border-white/10 transition-colors">
                        <span className={cn("material-symbols-outlined text-3xl", iconColor)}>{icon}</span>
                    </div>
                    {isComingSoon && (
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/10 px-2 py-1 rounded text-zinc-400">
                            {t('tools.coming_soon')}
                        </span>
                    )}
                </div>

                <div>
                    <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1 opacity-60", iconColor)}>{category}</p>
                    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                    <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-sm">terminal</span>
                    <span>{t('tools.ready_beta')}</span>
                </div>
            </div>
        </div>
    );
};

export const ToolsView = () => {
    const setView = useAppStore((state) => state.setView);
    const { t } = useTranslation();
    const tools: ToolCardProps[] = [
        {
            title: t('tools.interpolator_title'),
            description: t('tools.interpolator_desc'),
            icon: "analytics",
            discipline: 'math',
            category: t('tools.cat_general_math'),
            isComingSoon: false,
            onClick: () => setView('interpolator')
        },
        {
            title: t('tools.rankine_title'),
            description: t('tools.rankine_desc'),
            icon: "water_drop",
            discipline: 'thermo',
            category: t('tools.cat_thermo'),
            isComingSoon: false,
            onClick: () => setView('rankine')
        },
        {
            title: t('tools.unit_converter_title'),
            description: t('tools.unit_converter_desc'),
            icon: "sync_alt",
            discipline: 'general',
            category: t('tools.cat_general'),
            isComingSoon: false,
            onClick: () => setView('unit-converter')
        },
        {
            title: t('tools.vector_title'),
            description: t('tools.vector_desc'),
            icon: "dynamic_form",
            discipline: 'statics',
            category: t('tools.cat_statics_physics'),
            isComingSoon: false,
            onClick: () => setView('vector-calculator')
        },
        {
            title: t('tools.psychrometric_title'),
            description: t('tools.psychrometric_desc'),
            icon: "air",
            discipline: 'thermo',
            category: t('tools.cat_thermo'),
            isComingSoon: false,
            onClick: () => setView('psychrometric')
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 px-4 md:px-0">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase italic">
                    {t('tools.panel_title').split(' ')[0]} <span className="text-primary">{t('tools.panel_title').split(' ').slice(1).join(' ')}</span>
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
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{t('tools.operational')}</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase">
                    Build: SS-TOOLS-GRID-2024
                </div>
            </div>
        </div>
    );
};
