// Path: src/views/QuizView.tsx
import React, { useState, useEffect } from 'react'
import { useAppStore } from '../store'
import { ProgressBar } from '../components/ProgressBar'
import { Button } from '../components/Button'
import { cn } from '../lib/utils'
import { MathText } from '../components/MathText'
import { UtilitiesPanel } from '../components/UtilitiesPanel'

export const QuizView = () => {
    const {
        addResult,
        setView,
        totalQuestions,
        finishSession,
        answers,
        currentQuestionIndex,
        nextQuestion,
        timeRemaining,
        updateTimeRemaining,
        questions
    } = useAppStore()

    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [hasAnswered, setHasAnswered] = useState(false)
    const [timeLeft, setTimeLeft] = useState<number | null>(timeRemaining)
    const [isPaused, setIsPaused] = useState(false)
    const [isUtilsOpen, setIsUtilsOpen] = useState(false)
    const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())

    const currentQuestion = questions[currentQuestionIndex]
    const correctCount = answers.filter(r => r.isCorrect).length
    const wrongCount = answers.filter(r => !r.isCorrect).length

    // Reset question start time when question changes
    useEffect(() => {
        setQuestionStartTime(Date.now())
    }, [currentQuestionIndex])

    // Timer Logic
    useEffect(() => {
        if (timeLeft === null || isPaused || hasAnswered) return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null) return null
                const next = prev <= 1 ? 0 : prev - 1
                if (next === 0) {
                    clearInterval(timer)
                    finishSession()
                }
                return next
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [timeLeft, finishSession, isPaused, hasAnswered])

    // Sync local timer to global store
    useEffect(() => {
        updateTimeRemaining(timeLeft)
    }, [timeLeft, updateTimeRemaining])

    const goToNextQuestion = () => {
        if (currentQuestionIndex + 1 >= totalQuestions) {
            finishSession()
        } else {
            nextQuestion()
            setSelectedOption(null)
            setIsCorrect(null)
            setHasAnswered(false)
        }
    }

    // Auto-advance logic
    useEffect(() => {
        if (!hasAnswered) return

        const timer = setTimeout(() => {
            goToNextQuestion()
        }, 3000)

        return () => clearTimeout(timer)
    }, [hasAnswered, currentQuestionIndex])

    const handleSelect = (index: number) => {
        if (hasAnswered || isPaused || !currentQuestion) return

        const correct = currentQuestion.options[index].isCorrect
        setSelectedOption(index)
        setIsCorrect(correct)
        setHasAnswered(true)

        const duration = Math.round((Date.now() - questionStartTime) / 1000)

        addResult({
            questionId: currentQuestion.id,
            topic: currentQuestion.topicId,
            isCorrect: correct,
            timeSpent: duration
        })
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' || e.key === 'K') {
                e.preventDefault()
                setIsUtilsOpen(prev => !prev)
                return
            }

            if (e.code === 'Space') {
                e.preventDefault()
                setIsPaused(prev => !prev)
                return
            }

            if (isPaused) return

            if (!hasAnswered) {
                if (e.key === '1') handleSelect(0)
                if (e.key === '2') handleSelect(1)
                if (e.key === '3') handleSelect(2)
                if (e.key === '4') handleSelect(3)
            } else {
                if (e.key === 'Enter') {
                    goToNextQuestion()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isPaused, hasAnswered, currentQuestionIndex, totalQuestions, currentQuestion])

    const formatTime = (seconds: number | null) => {
        if (seconds === null) return 'ZEN MODE'
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    if (!currentQuestion) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-dark">
                <div className="text-center space-y-4">
                    <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Generando Escenario...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full flex-col bg-background-dark">
            {/* Pause Overlay */}
            {isPaused && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#1E1E1E] rounded-2xl border border-white/5 shadow-2xl p-10 text-center">
                        <div className="flex flex-col items-center gap-8">
                            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-5xl">pause</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Sesión en Pausa</h2>
                                <p className="text-zinc-400 text-sm font-light italic">Tómate un respiro, ingeniero.</p>
                            </div>
                            <div className="w-full space-y-4">
                                <Button onClick={() => setIsPaused(false)} icon="play_arrow">
                                    REANUDAR
                                </Button>
                                <button
                                    onClick={() => setView('setup')}
                                    className="w-full py-4 text-xs font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em] border border-white/5 hover:bg-white/5 rounded-lg"
                                >
                                    Salir de la Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 md:px-8 md:py-6 border-b border-white/5 bg-background-dark/50 backdrop-blur-md relative z-20 gap-4 md:gap-0">
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                    <div className="flex items-center gap-3">
                        <span className="text-white/40 font-medium tracking-widest uppercase text-xs">Progress</span>
                        <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">Q {currentQuestionIndex + 1} / {totalQuestions}</h2>
                    </div>
                    {/* Compact stats for mobile header */}
                    <div className="flex md:hidden items-center gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white font-bold font-mono">
                        <span className="text-green-500">{correctCount}</span> : <span className="text-red-500">{wrongCount}</span>
                    </div>
                </div>

                <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex flex-col items-center">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/30 mb-0.5 md:mb-1">Time Remaining</span>
                    <div className={cn(
                        "text-xl md:text-3xl font-light font-mono",
                        timeLeft !== null && timeLeft < 60 ? "text-red-500 animate-pulse" : "text-white/50"
                    )}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="hidden md:flex items-center gap-4 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                        <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold">{correctCount}</span>
                            <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                        </div>
                        <div className="w-px h-4 bg-white/10"></div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold">{wrongCount}</span>
                            <span className="material-symbols-outlined text-red-500 text-sm">cancel</span>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setIsUtilsOpen(true)}
                            className={cn(
                                "flex-1 md:flex-none flex size-9 items-center justify-center rounded-lg border transition-all h-10 md:h-9",
                                isUtilsOpen ? "bg-primary text-background-dark border-primary" : "bg-white/5 border-white/5 hover:bg-white/10 text-white/60"
                            )}
                            title="Herramientas de Ingeniería (K)"
                        >
                            <span className="material-symbols-outlined text-lg">science</span>
                            <span className="md:hidden ml-2 text-[10px] font-bold uppercase tracking-widest">Tools</span>
                        </button>
                        <button
                            onClick={() => setIsPaused(true)}
                            className="flex-1 md:flex-none flex size-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors h-10 md:h-9"
                        >
                            <span className="material-symbols-outlined text-lg">pause</span>
                            <span className="md:hidden ml-2 text-[10px] font-bold uppercase tracking-widest">Pause</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col p-4 md:p-6 gap-4 md:gap-6 max-w-7xl mx-auto w-full relative z-10 overflow-y-auto custom-scrollbar">
                <section className="shrink-0 flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="w-full bg-[#1E1E1E] rounded-2xl border border-white/5 flex flex-col md:flex-row overflow-hidden shadow-2xl">
                        <div className="w-full md:w-1/3 bg-black/20 flex items-center justify-center p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/5 relative h-24 md:h-auto shrink-0">
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
                            <div className="flex flex-row md:flex-col items-center gap-4">
                                <span className="material-symbols-outlined text-primary/20 text-4xl md:text-8xl">science</span>
                                <span className="text-[9px] text-accent-cyan/40 font-mono tracking-widest uppercase">Scenario</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center p-6 md:p-12 overflow-hidden">
                            <span className="text-primary font-bold tracking-[0.3em] text-[10px] mb-3 md:mb-4 uppercase shrink-0">Intuition Drill // {currentQuestion.difficulty}</span>
                            <h1 className="text-sm md:text-lg lg:text-2xl font-medium leading-relaxed text-white/90 break-words [overflow-wrap:anywhere] [word-break:break-word] [hyphens:auto]">
                                <MathText text={currentQuestion.questionLatex} />
                            </h1>
                        </div>
                    </div>
                </section>

                {/* Explanation UI */}
                {hasAnswered && currentQuestion.explanation && (
                    <div className={cn(
                        "p-6 rounded-xl border animate-in fade-in slide-in-from-top-4 duration-500",
                        isCorrect
                            ? "bg-green-500/5 border-green-500/20 text-green-400"
                            : "bg-red-500/5 border-red-500/20 text-red-400"
                    )}>
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined mt-0.5">lightbulb</span>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Explicación</p>
                                <div className="text-sm leading-relaxed text-white/80">
                                    <MathText text={currentQuestion.explanation} />
                                </div>
                                <p className="text-[10px] pt-2 opacity-40 italic">Presiona ENTER para continuar</p>
                            </div>
                        </div>
                    </div>
                )}

                <section className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-6 mt-4">
                    {currentQuestion.options.map((option, i) => {
                        const isSelected = selectedOption === i
                        const isCorrectOption = option.isCorrect

                        let borderClass = "border-white/10"
                        let textClass = "group-hover:text-primary"
                        let bgClass = "hover:bg-white/[0.02]"

                        if (hasAnswered) {
                            if (isCorrectOption) {
                                borderClass = "border-green-500/50"
                                textClass = "text-green-500"
                                bgClass = "bg-green-500/5"
                            } else if (isSelected) {
                                borderClass = "border-red-500/50"
                                textClass = "text-red-500"
                                bgClass = "bg-red-500/5"
                            }
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelect(i)}
                                disabled={hasAnswered}
                                className={cn(
                                    "group relative flex flex-col items-center justify-center bg-[#1E1E1E] border rounded-2xl transition-all duration-300 active:scale-[0.98] min-h-[120px]",
                                    borderClass,
                                    bgClass
                                )}
                            >
                                <div className={cn(
                                    "absolute top-4 left-6 font-bold text-4xl transition-colors",
                                    !hasAnswered ? "text-white/10 group-hover:text-primary/20" : (isCorrectOption ? "text-green-500/20" : "text-red-500/20")
                                )}>
                                    {String.fromCharCode(65 + i)}
                                </div>

                                {/* Hotkey Badge */}
                                <div className="absolute top-4 right-6 px-1.5 py-0.5 rounded border border-white/10 text-[10px] font-mono text-white/20 group-hover:text-primary/40 transition-colors">
                                    {i + 1}
                                </div>

                                <span className={cn("text-2xl font-light tracking-tight transition-colors px-12 text-center", textClass)}>
                                    <MathText text={option.label} />
                                </span>
                                <div className={cn(
                                    "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 transition-all duration-300",
                                    !hasAnswered ? "bg-primary group-hover:w-1/3" : (isCorrectOption ? "bg-green-500 w-1/3" : "bg-red-500 w-1/3")
                                )}></div>
                            </button>
                        )
                    })}
                </section>
            </main>

            <ProgressBar
                progress={((currentQuestionIndex + 1) / totalQuestions) * 100}
                className="h-1"
                colorClassName="bg-accent-cyan/40"
            />

            <UtilitiesPanel
                isOpen={isUtilsOpen}
                onClose={() => setIsUtilsOpen(false)}
            />
        </div>
    )
}
