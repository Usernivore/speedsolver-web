import React, { useState } from 'react';
import { calculateRankineCycle, RankineResult } from '../lib/thermoUtils';
import { Button } from '../components/Button';
import { useTranslation } from 'react-i18next';

export const RankineView = () => {
    const { t } = useTranslation();
    const [inputs, setInputs] = useState({
        pBoiler: '8000',      // kPa (8 MPa)
        tBoiler: '500',       // °C
        pCondenser: '10',     // kPa
        etaPump: '0.85',      // (0-1)
        etaTurbine: '0.90'    // (0-1)
    });

    const [result, setResult] = useState<RankineResult | null>(null);

    const handleCalculate = () => {
        const res = calculateRankineCycle(
            parseFloat(inputs.pBoiler),
            parseFloat(inputs.tBoiler),
            parseFloat(inputs.pCondenser),
            parseFloat(inputs.etaPump),
            parseFloat(inputs.etaTurbine)
        );
        setResult(res);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 p-4 md:p-0">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-3xl">cyclone</span>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase italic">
                        {t('rankine.title').split(' ')[0]} <span className="text-primary">{t('rankine.title').split(' ').slice(1).join(' ')}</span>
                    </h2>
                </div>
                <p className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] ml-1">
                    {t('rankine.engine')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">{t('rankine.parameters')}</h3>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('rankine.p_boiler')}</label>
                                <input
                                    type="number"
                                    value={inputs.pBoiler}
                                    onChange={e => setInputs(prev => ({ ...prev, pBoiler: e.target.value }))}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm font-mono text-white outline-none focus:border-primary/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('rankine.t_boiler')}</label>
                                <input
                                    type="number"
                                    value={inputs.tBoiler}
                                    onChange={e => setInputs(prev => ({ ...prev, tBoiler: e.target.value }))}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm font-mono text-white outline-none focus:border-primary/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('rankine.p_condenser')}</label>
                                <input
                                    type="number"
                                    value={inputs.pCondenser}
                                    onChange={e => setInputs(prev => ({ ...prev, pCondenser: e.target.value }))}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm font-mono text-white outline-none focus:border-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('rankine.efficiencies')}</h3>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('rankine.eta_pump')}</label>
                                    <span className="text-[10px] font-mono text-primary font-bold">{Math.round(parseFloat(inputs.etaPump) * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.5" max="1.0" step="0.01"
                                    value={inputs.etaPump}
                                    onChange={e => setInputs(prev => ({ ...prev, etaPump: e.target.value }))}
                                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('rankine.eta_turbine')}</label>
                                    <span className="text-[10px] font-mono text-accent-cyan font-bold">{Math.round(parseFloat(inputs.etaTurbine) * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.5" max="1.0" step="0.01"
                                    value={inputs.etaTurbine}
                                    onChange={e => setInputs(prev => ({ ...prev, etaTurbine: e.target.value }))}
                                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                                />
                            </div>
                        </div>

                        <Button onClick={handleCalculate} icon="terminal" className="w-full py-4 text-xs font-black uppercase tracking-widest">
                            {t('rankine.execute')}
                        </Button>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-8 space-y-6">
                    {result ? (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-8 animate-in slide-in-from-right-8 duration-500">
                            {/* Main Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-black/20 p-6 rounded-2xl border border-primary/20 flex flex-col items-center">
                                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2">{t('rankine.thermal_efficiency')}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-white">{(result.thermalEfficiency * 100).toFixed(1)}</span>
                                        <span className="text-sm font-bold text-primary">%</span>
                                    </div>
                                </div>
                                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{t('rankine.net_work')}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-white">{result.netWork.toFixed(1)}</span>
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase">kJ/kg</span>
                                    </div>
                                </div>
                                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{t('rankine.bwr')}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-white">{(result.backWorkRatio * 100).toFixed(2)}</span>
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase">%</span>
                                    </div>
                                </div>
                            </div>

                            {/* States Table */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">{t('rankine.state_props')}</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[9px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/5">
                                                <th className="py-2 px-4">{t('rankine.state_col')}</th>
                                                <th className="py-2 px-4">{t('rankine.temp_col')}</th>
                                                <th className="py-2 px-4">{t('rankine.enthalpy_col')}</th>
                                                <th className="py-2 px-4">{t('rankine.entropy_col')}</th>
                                                <th className="py-2 px-4">{t('rankine.quality_col')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-mono">
                                            {[
                                                { id: 1, label: t('rankine.state1_label'), ...result.state1 },
                                                { id: 2, label: t('rankine.state2_label'), ...result.state2 },
                                                { id: 3, label: t('rankine.state3_label'), ...result.state3 },
                                                { id: 4, label: t('rankine.state4_label'), ...result.state4 },
                                            ].map((state) => (
                                                <tr key={state.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="size-5 rounded bg-primary/20 text-primary text-[10px] font-black flex items-center justify-center">{state.id}</span>
                                                            <span className="text-[11px] font-bold text-zinc-400 uppercase font-sans tracking-tight">{state.label}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-white">{state.t.toFixed(1)}</td>
                                                    <td className="py-3 px-4 text-white font-bold">{state.h.toFixed(1)}</td>
                                                    <td className="py-3 px-4 text-zinc-400">{state.s.toFixed(3)}</td>
                                                    <td className="py-3 px-4">
                                                        {state.quality !== undefined ? (
                                                            <span className={state.quality < 1 ? "text-accent-cyan font-bold" : "text-zinc-600"}>
                                                                {state.quality.toFixed(3)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-zinc-700 italic">{t('rankine.superheated')}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex gap-4 items-center">
                                <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                                <p className="text-[10px] text-zinc-400 italic leading-relaxed">
                                    <span className="text-zinc-200 font-bold uppercase not-italic">{t('rankine.engine_desc').split(': ')[0]}:</span> {t('rankine.engine_desc').split(': ')[1]}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                <span className="material-symbols-outlined text-8xl text-zinc-800 relative z-10 animate-pulse">settings_input_component</span>
                            </div>
                            <div className="space-y-3 max-w-sm">
                                <h3 className="text-base font-bold text-zinc-400 uppercase tracking-[0.3em]">{t('rankine.engine_ready')}</h3>
                                <p className="text-xs text-zinc-600 leading-relaxed uppercase tracking-tighter">
                                    {t('rankine.engine_ready_desc')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
