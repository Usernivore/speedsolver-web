import React, { useState, useEffect } from 'react';
import { cn, linearInterpolate } from '../lib/utils';
import { Button } from '../components/Button';
import { useAppStore } from '../store';

export const InterpolatorView = () => {
    const setView = useAppStore((state) => state.setView);

    // Linear Interpolator State
    const [x0, setX0] = useState('');
    const [y0, setY0] = useState('');
    const [x1, setX1] = useState('');
    const [y1, setY1] = useState('');
    const [targetX, setTargetX] = useState('');
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Auto-calculate effect
    useEffect(() => {
        const vx0 = parseFloat(x0);
        const vy0 = parseFloat(y0);
        const vx1 = parseFloat(x1);
        const vy1 = parseFloat(y1);
        const tx = parseFloat(targetX);

        if ([vx0, vy0, vx1, vy1, tx].some(isNaN)) {
            setResult(null);
            setError(null);
            return;
        }

        if (Math.abs(vx1 - vx0) < 1e-10) {
            setResult(null);
            setError("Error: X1 no puede ser igual a X0 (división por cero)");
            return;
        }

        setError(null);
        try {
            const y = linearInterpolate(vx0, vy0, vx1, vy1, tx);
            setResult(Number(y.toFixed(6)));
        } catch (e) {
            setError((e as Error).message);
            setResult(null);
        }
    }, [x0, y0, x1, y1, targetX]);

    const clearCalculator = () => {
        setX0('');
        setY0('');
        setX1('');
        setY1('');
        setTargetX('');
        setResult(null);
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="p-2 h-auto text-zinc-500 hover:text-white"
                            onClick={() => setView('tools')}
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Button>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase italic">
                            Interpolador <span className="text-primary">Lineal</span>
                        </h2>
                    </div>
                    <p className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-[0.2em] ml-11">
                        Engineering Toolbox // Math Utility
                    </p>
                </div>

                <Button
                    variant="outline"
                    onClick={clearCalculator}
                    className="text-[10px] uppercase font-black tracking-widest border-white/10 hover:bg-white/5"
                >
                    Reiniciar Campos
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs Panel */}
                <div className="lg:col-span-12">
                    <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl space-y-8">

                        {/* Formula Display */}
                        <div className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl border border-white/5 space-y-4">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Fórmula Utilizada</p>
                            <div className="flex items-center gap-3 text-lg md:text-2xl font-medium text-primary/90 select-none">
                                <span className="font-serif italic">y = y<sub className="text-xs">0</sub> +</span>
                                <div className="flex flex-col items-center">
                                    <span className="px-3 pb-1 font-serif italic border-b border-primary/30">
                                        (x - x<sub className="text-xs">0</sub>)(y<sub className="text-xs">1</sub> - y<sub className="text-xs">0</sub>)
                                    </span>
                                    <span className="pt-1 font-serif italic">
                                        x<sub className="text-xs">1</sub> - x<sub className="text-xs">0</sub>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Point 0 */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="size-5 rounded bg-white/5 flex items-center justify-center text-[10px] text-primary">01</span>
                                    Punto Conocido 0 (x₀, y₀)
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Valor x₀</label>
                                        <input
                                            type="number"
                                            value={x0}
                                            onChange={e => setX0(e.target.value)}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm font-mono text-white outline-none focus:border-primary/50 transition-all shadow-inner"
                                            placeholder="Ej: 100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Valor y₀</label>
                                        <input
                                            type="number"
                                            value={y0}
                                            onChange={e => setY0(e.target.value)}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm font-mono text-white outline-none focus:border-primary/50 transition-all shadow-inner"
                                            placeholder="Ej: 2676.1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Point 1 */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="size-5 rounded bg-white/5 flex items-center justify-center text-[10px] text-primary">02</span>
                                    Punto Conocido 1 (x₁, y₁)
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Valor x₁</label>
                                        <input
                                            type="number"
                                            value={x1}
                                            onChange={e => setX1(e.target.value)}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm font-mono text-white outline-none focus:border-primary/50 transition-all shadow-inner"
                                            placeholder="Ej: 150"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Valor y₁</label>
                                        <input
                                            type="number"
                                            value={y1}
                                            onChange={e => setY1(e.target.value)}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm font-mono text-white outline-none focus:border-primary/50 transition-all shadow-inner"
                                            placeholder="Ej: 2776.4"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Target X */}
                        <div className="pt-6 border-t border-white/5">
                            <div className="max-w-md mx-auto space-y-4">
                                <h3 className="text-[11px] font-black text-accent-cyan uppercase tracking-[0.3em] text-center">
                                    Valor a Interpolar (x)
                                </h3>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={targetX}
                                        onChange={e => setTargetX(e.target.value)}
                                        className="w-full bg-zinc-900 border-2 border-accent-cyan/20 rounded-2xl p-5 text-lg font-mono text-white outline-none focus:border-accent-cyan transition-all text-center shadow-[0_0_20px_rgba(34,211,238,0.05)]"
                                        placeholder="Ingrese el valor de x buscado"
                                    />
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-accent-cyan/40">target</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in shake-1 duration-300">
                                <p className="text-xs font-bold text-red-500 uppercase flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-sm">warning</span>
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Result Display */}
                        {result !== null ? (
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center space-y-2 animate-in zoom-in-95 duration-500 shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-20" />
                                <p className="text-xs font-black text-primary uppercase tracking-[0.4em] relative z-10">Resultado Calculado (y)</p>
                                <div className="flex items-baseline gap-3 relative z-10">
                                    <span className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                                        {result}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 pt-2 relative z-10">
                                    <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Precisión: 6 decimales</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-40 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-2">
                                <span className="material-symbols-outlined text-4xl text-zinc-800">calculate</span>
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Complete todos los campos para ver el resultado</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hint */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex gap-4 items-center">
                <span className="material-symbols-outlined text-zinc-400">help_outline</span>
                <p className="text-[11px] text-zinc-500 italic leading-relaxed">
                    La interpolación lineal asume que la tasa de cambio entre los dos puntos conocidos es constante. Es ideal para lecturas rápidas de tablas termodinámicas de vapor o gases.
                </p>
            </div>
        </div>
    );
};
