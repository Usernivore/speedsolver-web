import React, { useEffect } from 'react'
import { useAppStore } from '../store'
import { Button } from '../components/Button'

export const ResultsView = () => {
    const { score, totalQuestions, answers, setView, resetSession, saveSessionToHistory } = useAppStore()

    useEffect(() => {
        saveSessionToHistory()
    }, [])

    const answeredCount = answers.length
    const percentage = answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0

    // Calculate stroke-dashoffset for circular progress
    const circumference = 553
    const offset = circumference - (percentage / 100) * circumference

    return (
        <div className="w-full max-w-4xl mx-auto py-12">
            <section className="flex flex-col items-center mb-16">
                <div className="relative flex items-center justify-center">
                    <svg className="w-48 h-48 transform -rotate-90">
                        <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="8"></circle>
                        <circle
                            className="text-green-500 transition-all duration-1000 ease-out"
                            cx="96" cy="96" fill="transparent" r="88"
                            stroke="currentColor" strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                        ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-light tracking-tighter text-green-500">{percentage}%</span>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <h2 className="text-2xl font-semibold mb-1 text-white">Sesión Finalizada</h2>
                    <p className="text-slate-400 text-sm font-medium">
                        {score} Correctas / {answeredCount - score} Incorrectas
                        <span className="mx-2 text-white/10">|</span>
                        Objetivo: {totalQuestions}
                    </p>
                </div>
            </section>

            <section className="w-full bg-[#1E1E1E] rounded-xl border border-white/5 overflow-hidden mb-12">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Estado</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Tema</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Tiempo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {answers.map((result, i) => (
                                <tr key={i} className="hover:bg-accent-cyan/5 border-l-4 border-l-transparent hover:border-l-accent-cyan transition-all">
                                    <td className="px-6 py-4">
                                        <span className={`material-symbols-outlined ${result.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                            {result.isCorrect ? 'check_circle' : 'cancel'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white">{result.topic}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400 text-right tabular-nums">{result.timeSpent}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <footer className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center pb-12">
                <button
                    onClick={resetSession}
                    className="w-full sm:w-auto px-8 h-12 border border-white/20 hover:bg-white/5 rounded-lg text-sm font-bold tracking-wide transition-all uppercase text-white"
                >
                    Volver al Home
                </button>
                <Button
                    onClick={() => setView('dashboard')}
                    className="w-full sm:w-auto px-8 h-12 bg-accent-cyan text-zinc-900 hover:bg-accent-cyan/90 shadow-accent-cyan/20"
                >
                    Ver Dashboard
                </Button>
            </footer>
        </div>
    )
}
