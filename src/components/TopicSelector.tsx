// Path: src/components/TopicSelector.tsx
import React from 'react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

interface TopicOption {
    id: string;
    label: string;
    icon: string;
}

const TOPIC_OPTIONS = [
    { id: 'properties', icon: 'database' },
    { id: 'processes', icon: 'cyclone' },
    { id: 'cycles', icon: 'settings_backup_restore' },
    { id: 'entropy', icon: 'waves' }
];

interface TopicSelectorProps {
    selectedTopics: string[];
    onToggleTopic: (id: string) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ selectedTopics, onToggleTopic }) => {
    const { t } = useTranslation();
    return (
        <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-cyan text-sm">label_important</span>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">{t('topics.title')}</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-600">
                    {selectedTopics.length}/{TOPIC_OPTIONS.length} {t('topics.selected')}
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                {TOPIC_OPTIONS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic.id);
                    return (
                        <button
                            key={topic.id}
                            onClick={() => onToggleTopic(topic.id)}
                            className={cn(
                                "group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300",
                                isSelected
                                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                                    : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/[0.07] hover:text-zinc-200"
                            )}
                        >
                            <span className={cn(
                                "material-symbols-outlined text-lg transition-transform duration-300 group-hover:scale-110",
                                isSelected ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300"
                            )}>
                                {topic.icon}
                            </span>
                            <span className="text-xs font-bold tracking-wide">
                                {t(`topics.${topic.id}`)}
                            </span>
                            {isSelected && (
                                <span className="material-symbols-outlined text-sm font-bold animate-in zoom-in duration-300">
                                    check
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
