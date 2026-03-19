import React, { useEffect } from 'react'
import { useAppStore } from '../store'
import { Button } from '../components/Button'
import { formatDuration } from '../lib/utils'
import { useTranslation } from 'react-i18next'

export const ResultsView = () => {
    const { score, totalQuestions, answers, setView, resetSession, accumulateSessionStats } = useAppStore()
    const { t } = useTranslation()

    useEffect(() => {
        accumulateSessionStats()
    }, [])

    const answeredCount = answers.length
    const percentage = answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0
    const sessionTime = answers.reduce((acc, curr) => acc + curr.timeSpent, 0);

    // Calculate stroke-dashoffset for circular progress
    const circumference = 553
    const offset = circumference - (percentage / 100) * circumference

    return (
        <div className="w-full max-w-4xl mx-auto py-8 md:py-12 px-4">
            <section className="flex flex-col items-center mb-10 md:mb-16">
                <div className="relative flex items-center justify-center scale-75 md:scale-100">
                    <svg className="w-48 h-48 transform -rotate-90 text-zinc-800">
                        <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="8"></circle>
                        <circle
                            className="text-green-500 transition-all duration-1000 ease-out"
                            cx="96" cy="96" fill="transparent" r="88"
                            stroke="currentColor" strokeWidth="12"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black tracking-tighter text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">{percentage}%</span>
                        <span className="text-[11px] font-mono text-zinc-400 mt-2 uppercase tracking-[0.2em]">{formatDuration(sessionTime)}</span>
                    </div>
                </div>
                <div className="mt-6 text-center px-2">
                    <h2 className="text-xl md:text-3xl font-black mb-2 text-white uppercase tracking-tight">{t('results.mission_analysis')}</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-slate-500 text-[9px] md:text-xs font-mono uppercase tracking-widest">
                        <p><span className="text-green-500">{score}</span> {t('results.success')} // <span className="text-red-500">{answeredCount - score}</span> {t('results.failed')}</p>
                        <span className="hidden md:block text-white/5">|</span>
                        <p>{t('results.objective')}: {totalQuestions}</p>
                    </div>
                </div>
            </section>

            <section className="w-full bg-[#1E1E1E] rounded-xl border border-white/5 overflow-hidden mb-12">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{t('results.state')}</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{t('results.topic')}</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">{t('results.time')}</th>
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
                    {t('common.back_to_start')}
                </button>
                <Button
                    onClick={() => setView('dashboard')}
                    className="w-full sm:w-auto px-8 h-12 bg-accent-cyan text-zinc-900 hover:bg-accent-cyan/90 shadow-accent-cyan/20"
                >
                    {t('common.view_dashboard')}
                </Button>
            </footer>
        </div>
    )
}
