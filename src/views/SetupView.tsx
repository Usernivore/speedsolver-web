import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useAppStore } from '../store'
import { TopicSelector } from '../components/TopicSelector'

export const SetupView = () => {
    const startSession = useAppStore((state) => state.startSession)
    const [problemCount, setProblemCount] = useState(10)
    const [timeLimit, setTimeLimit] = useState<number | null>(2400) // Default to 40m
    const [activeMode, setActiveMode] = useState('ESTÁNDAR')
    const [selectedTopics, setSelectedTopics] = useState<string[]>(['properties', 'processes'])

    const toggleTopic = (id: string) => {
        setSelectedTopics(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    }

    const handleStart = () => {
        const topics = selectedTopics.length > 0 ? selectedTopics : ['properties', 'processes', 'cycles', 'entropy'];
        startSession(problemCount, timeLimit, topics);
    }

    const modes = [
        { label: 'ZEN', questions: 10, time: null, sub: 'Sin límite' },
        { label: 'ESTÁNDAR', questions: 10, time: 2400, sub: '40 MIN / 10 PROB' },
        { label: 'EXAMEN', questions: 20, time: 4800, sub: '80 MIN / 20 PROB' },
        { label: 'MUERTE S.', questions: 40, time: 9600, sub: '160 MIN / 40 PROB' }
    ]

    const handleModeSelect = (mode: typeof modes[0]) => {
        setActiveMode(mode.label)
        setProblemCount(mode.questions)
        setTimeLimit(mode.time)
    }

    const handleSliderChange = (val: number) => {
        setProblemCount(val)
        setTimeLimit(val * 4 * 60)
        setActiveMode('CUSTOM')
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
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Configuración de Sesión</h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-light italic">
                    Entrenamiento de intuición ingenieril • <span className="font-serif">ΔS ≥ 0</span>
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
                        <h3 className="text-sm uppercase tracking-widest font-semibold text-zinc-400">Presión de Tiempo</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {modes.map((mode) => (
                            <button
                                key={mode.label}
                                onClick={() => handleModeSelect(mode)}
                                className={`flex flex-col items-center justify-center p-4 min-h-[80px] rounded-lg transition-all text-center border-2 ${activeMode === mode.label ? 'border-primary bg-primary/5' : 'bg-zinc-100 dark:bg-[#1E1E1E] border-transparent'}`}
                            >
                                <span className={`text-xs font-bold ${activeMode === mode.label ? 'text-primary' : 'text-zinc-500'}`}>{mode.label}</span>
                                <span className="text-[9px] text-zinc-400 uppercase mt-1">{mode.sub}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-zinc-400 text-sm">layers</span>
                            <h3 className="text-sm uppercase tracking-widest font-semibold text-zinc-400">Selector de Volumen</h3>
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
                            <span>5 prob.</span>
                            <span>10 prob.</span>
                            <span>20 prob.</span>
                            <span>40 prob.</span>
                        </div>
                    </div>
                </section>

                <div className="flex gap-4">
                    <Button icon="bolt" onClick={handleStart} className="flex-1">
                        INICIAR SESIÓN
                    </Button>
                    <button
                        onClick={() => useAppStore.getState().setView('dashboard')}
                        className="px-6 border border-zinc-700 hover:border-zinc-500 rounded-lg text-xs font-bold tracking-widest text-zinc-400 transition-all uppercase"
                    >
                        Stats
                    </button>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                    <p className="text-[11px] text-zinc-400 font-medium tracking-wide">
                        <span className="text-primary font-bold uppercase mr-1">Pro Tip:</span>
                        Use number keys <span className="text-zinc-200">1-4</span> to answer and <span className="text-zinc-200">Spacebar</span> to pause for maximum speed.
                    </p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-mono tracking-tighter">
                <span>BUILD VERSION: 2.5.1-STABLE</span>
                <span>SYSTEM READY // ENGINE IDLE</span>
            </div>
        </Card>
    )
}
