import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useAppStore } from '../store'
import { TopicSelector } from '../components/TopicSelector'
import { useTranslation } from 'react-i18next'

export const SetupView = () => {
    const startSession = useAppStore((state) => state.startSession)
    const [problemCount, setProblemCount] = useState(10)
    const [timeLimit, setTimeLimit] = useState<number | null>(2400) // Default to 40m
    const [activeMode, setActiveMode] = useState('standard')
    const { t, i18n } = useTranslation()
    const [selectedTopics, setSelectedTopics] = useState<string[]>(['properties', 'processes'])

    const toggleTopic = (id: string) => {
        setSelectedTopics(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    }

    const handleStart = () => {
        if (selectedTopics.length === 0) return;
        const currentLang = (i18n.language.split('-')[0] || 'es') as 'es' | 'en';
        startSession(problemCount, timeLimit, selectedTopics, currentLang);
    }

    const modes = [
        { id: 'zen', label: t('setup.modes.zen'), questions: 10, time: null, sub: t('setup.modes.no_limit') },
        { id: 'standard', label: t('setup.modes.standard'), questions: 10, time: 2400, sub: t('setup.modes.min_prob', { mins: 40, probs: 10 }) },
        { id: 'exam', label: t('setup.modes.exam'), questions: 20, time: 4800, sub: t('setup.modes.min_prob', { mins: 80, probs: 20 }) },
        { id: 'sudden_death', label: t('setup.modes.sudden_death'), questions: 40, time: 9600, sub: t('setup.modes.min_prob', { mins: 160, probs: 40 }) }
    ]

    const handleModeSelect = (mode: typeof modes[0]) => {
        setActiveMode(mode.id)
        setProblemCount(mode.questions)
        setTimeLimit(mode.time)
    }

    const handleSliderChange = (val: number) => {
        setProblemCount(val)
        setTimeLimit(val * 4 * 60)
        setActiveMode('custom')
    }

    const formatTimeDisplay = (seconds: number | null) => {
        if (seconds === null) return '∞'
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        if (hrs > 0) return `${hrs}h ${mins}m`
        return `${mins}m`
    }

    return (
        <Card>
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t('setup.title')}</h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-light italic">
                    {t('setup.subtitle')} • <span className="font-serif">ΔS ≥ 0</span>
                </p>
            </div>

            <div className="space-y-10">
                <section>
                    <TopicSelector
                        selectedTopics={selectedTopics}
                        onToggleTopic={toggleTopic}
                    />
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                        <h3 className="text-sm uppercase tracking-widest font-semibold text-zinc-400">{t('setup.time_pressure')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {modes.map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => handleModeSelect(mode)}
                                className={`flex flex-col items-center justify-center p-4 min-h-[80px] rounded-lg transition-all text-center border-2 ${activeMode === mode.id ? 'border-primary bg-primary/5' : 'bg-zinc-100 dark:bg-[#1E1E1E] border-transparent'}`}
                            >
                                <span className={`text-xs font-bold ${activeMode === mode.id ? 'text-primary' : 'text-zinc-500'}`}>{mode.label}</span>
                                <span className="text-[9px] text-zinc-400 uppercase mt-1">{mode.sub}</span>
                            </button>
                        ))}
                        {activeMode === 'custom' && (
                            <button
                                className="flex flex-col items-center justify-center p-4 min-h-[80px] rounded-lg transition-all text-center border-2 border-primary bg-primary/5"
                            >
                                <span className="text-xs font-bold text-primary">{t('setup.modes.custom')}</span>
                                <span className="text-[9px] text-zinc-400 uppercase mt-1">--</span>
                            </button>
                        )}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-zinc-400 text-sm">layers</span>
                            <h3 className="text-sm uppercase tracking-widest font-semibold text-zinc-400">{t('setup.volume_selector')}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-zinc-500">{formatTimeDisplay(timeLimit)}</span>
                            <span className="text-xl font-bold text-primary">{problemCount}</span>
                        </div>
                    </div>
                    <div className="px-2">
                        <input
                            className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer custom-slider"
                            max="40" min="5" step="5" type="range"
                            value={problemCount}
                            onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                        />
                        <div className="flex justify-between mt-2 text-[10px] font-bold text-zinc-500 uppercase">
                            <span>5 {t('results.topic').toLowerCase()}</span>
                            <span>10 {t('results.topic').toLowerCase()}</span>
                            <span>20 {t('results.topic').toLowerCase()}</span>
                            <span>40 {t('results.topic').toLowerCase()}</span>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <Button
                            icon="bolt"
                            onClick={handleStart}
                            className={`flex-1 ${selectedTopics.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedTopics.length === 0}
                            title={selectedTopics.length === 0 ? t('setup.select_topic_warning') : ""}
                        >
                            {t('setup.start_session')}
                        </Button>
                        <button
                            onClick={() => useAppStore.getState().setView('dashboard')}
                            className="px-6 border border-zinc-700 hover:border-zinc-500 rounded-lg text-xs font-bold tracking-widest text-zinc-400 transition-all uppercase"
                        >
                            {t('nav.stats')}
                        </button>
                    </div>
                    {selectedTopics.length === 0 && (
                        <p className="text-[10px] text-orange-500 font-bold animate-pulse text-center uppercase tracking-widest">
                            ⚠️ {t('setup.select_topic_warning')}
                        </p>
                    )}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                    <p className="text-[11px] text-zinc-400 font-medium tracking-wide">
                        <span className="text-primary font-bold uppercase mr-1">{t('setup.pro_tip')}</span>
                        {t('setup.pro_tip_desc')}
                    </p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-mono tracking-tighter">
                <span>{t('setup.build_version')}: 2.5.1-STABLE</span>
                <span>{t('setup.system_ready')}</span>
            </div>
        </Card>
    )
}
