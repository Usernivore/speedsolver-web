import React, { useState, useEffect } from 'react'
import { cn, linearInterpolate } from '../lib/utils'
import { MathText } from './MathText'
import { useTranslation } from 'react-i18next'

interface UtilitiesPanelProps {
    isOpen: boolean
    onClose: () => void
}

const getConstants = (t: any) => [
    { name: t('constants.universal_gas'), value: '8.3144', unit: 'J/(mol·K)' },
    { name: t('constants.air_gas'), value: '0.287', unit: 'kJ/(kg·K)' },
    { name: t('constants.gravity'), value: '9.80665', unit: 'm/s²' },
    { name: t('constants.std_pressure'), value: '101.325', unit: 'kPa' },
    { name: t('constants.water_heat'), value: '4.186', unit: 'kJ/(kg·K)' },
    { name: t('constants.water_density'), value: '1000', unit: 'kg/m³' },
]

export const UtilitiesPanel = ({ isOpen, onClose }: UtilitiesPanelProps) => {
    const { t } = useTranslation()
    const CONSTANTS = getConstants(t)
    // Linear Interpolator State
    const [x0, setX0] = useState('')
    const [y0, setY0] = useState('')
    const [x1, setX1] = useState('')
    const [y1, setY1] = useState('')
    const [targetX, setTargetX] = useState('')
    const [result, setResult] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Auto-calculate effect
    useEffect(() => {
        const vx0 = parseFloat(x0)
        const vy0 = parseFloat(y0)
        const vx1 = parseFloat(x1)
        const vy1 = parseFloat(y1)
        const tx = parseFloat(targetX)

        if ([vx0, vy0, vx1, vy1, tx].some(isNaN)) {
            setResult(null)
            setError(null)
            return
        }

        if (Math.abs(vx1 - vx0) < 1e-10) {
            setResult(null)
            setError(t('interpolator.error_divide_zero'))
            return
        }

        setError(null)
        const y = vy0 + ((tx - vx0) * (vy1 - vy0)) / (vx1 - vx0)
        setResult(Number(y.toFixed(6)))
    }, [x0, y0, x1, y1, targetX])

    const clearCalculator = () => {
        setX0('')
        setY0('')
        setX1('')
        setY1('')
        setTargetX('')
        setResult(null)
        setError(null)
    }

    return (
        <div className={cn(
            "fixed inset-y-0 right-0 w-80 md:w-96 bg-[#181818] border-l border-white/10 shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out flex flex-col",
            isOpen ? "translate-x-0" : "translate-x-full"
        )}>
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-white">{t('utilities.title')}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="size-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Constants Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-zinc-500 text-xs">book</span>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('utilities.constants')}</h3>
                    </div>
                    <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <tbody className="divide-y divide-white/5">
                                {CONSTANTS.map((c, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-3">
                                            <p className="text-[10px] text-zinc-400 font-medium">{c.name}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-xs font-mono font-bold text-primary">{c.value}</span>
                                                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">{c.unit}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Calculator Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-zinc-500 text-xs">calculate</span>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('interpolator.title')}</h3>
                        </div>
                        <button onClick={clearCalculator} className="text-[9px] uppercase font-bold text-primary hover:underline">{t('interpolator.clear_short')}</button>
                    </div>
                    <div className="bg-black/20 rounded-xl border border-white/5 p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-zinc-600 uppercase ml-1">X0</label>
                                <input
                                    type="number"
                                    value={x0}
                                    onChange={e => setX0(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-primary/50 transition-all"
                                    placeholder="0.0"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-zinc-600 uppercase ml-1">Y0</label>
                                <input
                                    type="number"
                                    value={y0}
                                    onChange={e => setY0(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-primary/50 transition-all"
                                    placeholder="0.0"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-zinc-600 uppercase ml-1">X1</label>
                                <input
                                    type="number"
                                    value={x1}
                                    onChange={e => setX1(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-primary/50 transition-all"
                                    placeholder="1.0"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-zinc-600 uppercase ml-1">Y1</label>
                                <input
                                    type="number"
                                    value={y1}
                                    onChange={e => setY1(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-primary/50 transition-all"
                                    placeholder="1.0"
                                />
                            </div>
                        </div>
                        <div className="pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-accent-cyan uppercase ml-1">{t('interpolator.target_symbol')}</label>
                                <input
                                    type="number"
                                    value={targetX}
                                    onChange={e => setTargetX(e.target.value)}
                                    className="w-full bg-zinc-900 border border-accent-cyan/20 rounded-lg p-2.5 text-xs font-mono text-white outline-none focus:border-accent-cyan transition-all ring-1 ring-accent-cyan/5"
                                    placeholder={t('interpolator.target_placeholder_short')}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xs">error</span>
                                    {error}
                                </p>
                            </div>
                        )}

                        {result !== null && (
                            <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 animate-in zoom-in-95 duration-200">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">{t('interpolator.result_symbol')}</h4>
                                    <span className="text-[8px] font-bold text-zinc-500 font-mono">{t('interpolator.precision_short')}</span>
                                </div>
                                <span className="text-3xl font-black font-mono text-white tracking-tighter">{result}</span>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <div className="p-4 border-t border-white/5 bg-black/10 text-center">
                <p className="text-[10px] text-zinc-600 font-mono tracking-tighter">
                    v{new Date().getFullYear()}.ENGINE_TOOLSET.ALPHA
                </p>
            </div>
        </div>
    )
}

