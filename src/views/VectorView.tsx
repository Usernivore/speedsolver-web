import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import {
    Vector3,
    calculateMagnitude,
    addVectors,
    subtractVectors,
    dotProduct,
    crossProduct
} from '../lib/vectorUtils';

const VectorInput = ({
    label,
    vector,
    onChange,
    className
}: {
    label: string,
    vector: Vector3,
    onChange: (axis: keyof Vector3, val: string) => void,
    className?: string
}) => {
    return (
        <div className={cn("bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4", className)}>
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">{label}</h3>
            <div className="grid grid-cols-3 gap-3">
                {(['x', 'y', 'z'] as const).map((axis) => (
                    <div key={axis} className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-600 uppercase ml-1">{axis}</label>
                        <input
                            type="number"
                            value={vector[axis] === 0 && typeof vector[axis] !== 'number' ? '' : vector[axis]}
                            onChange={(e) => onChange(axis, e.target.value)}
                            className="w-full bg-zinc-900 border border-white/5 rounded-lg p-2.5 text-xs font-mono text-white outline-none focus:border-primary/50 transition-all font-bold"
                            placeholder="0.0"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const ResultRow = ({ label, value, unit, isVector = false }: { label: string, value: any, unit?: string, isVector?: boolean }) => {
    return (
        <div className="group bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col hover:bg-white/[0.08] transition-all">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 group-hover:text-primary/70 transition-colors">{label}</span>
            <div className="flex items-baseline gap-2">
                {isVector ? (
                    <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-zinc-500 text-sm">[</span>
                        <span className="text-white font-bold">{value.x.toFixed(3)}</span>
                        <span className="text-zinc-600 text-xs text-primary/40 italic">i</span>
                        <span className="text-zinc-500 text-xs">,</span>
                        <span className="text-white font-bold">{value.y.toFixed(3)}</span>
                        <span className="text-zinc-600 text-xs text-primary/40 italic">j</span>
                        <span className="text-zinc-500 text-xs">,</span>
                        <span className="text-white font-bold">{value.z.toFixed(3)}</span>
                        <span className="text-zinc-600 text-xs text-primary/40 italic">k</span>
                        <span className="text-zinc-500 text-sm">]</span>
                    </div>
                ) : (
                    <span className="text-xl font-black font-mono text-white tracking-tighter">
                        {typeof value === 'number' ? value.toFixed(4) : value}
                    </span>
                )}
                {unit && <span className="text-[9px] font-bold text-zinc-600 uppercase">{unit}</span>}
            </div>
        </div>
    );
};

export const VectorView = () => {
    const { t } = useTranslation();
    const [vectorA, setVectorA] = useState<Vector3>({ x: 1, y: 0, z: 0 });
    const [vectorB, setVectorB] = useState<Vector3>({ x: 0, y: 1, z: 0 });

    const results = useMemo(() => {
        return {
            magA: calculateMagnitude(vectorA),
            magB: calculateMagnitude(vectorB),
            addition: addVectors(vectorA, vectorB),
            subtraction: subtractVectors(vectorA, vectorB),
            dot: dotProduct(vectorA, vectorB),
            cross: crossProduct(vectorA, vectorB)
        };
    }, [vectorA, vectorB]);

    const handleVectorChange = (vecId: 'A' | 'B', axis: keyof Vector3, val: string) => {
        const numVal = val === '' ? 0 : parseFloat(val);
        if (vecId === 'A') {
            setVectorA(prev => ({ ...prev, [axis]: numVal }));
        } else {
            setVectorB(prev => ({ ...prev, [axis]: numVal }));
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-500 text-3xl">dynamic_form</span>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase italic">
                        {t('vector.title').split(' ')[0]} <span className="text-green-500">{t('vector.title').split(' ').slice(1).join(' ')}</span>
                    </h2>
                </div>
                <p className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] ml-1">
                    {t('vector.toolbox')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-5 space-y-6">
                    <VectorInput
                        label={t('vector.vector_a')}
                        vector={vectorA}
                        onChange={(axis, val) => handleVectorChange('A', axis, val)}
                    />
                    <VectorInput
                        label={t('vector.vector_b')}
                        vector={vectorB}
                        onChange={(axis, val) => handleVectorChange('B', axis, val)}
                    />

                    {/* Magnitude Breakdown */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col items-center">
                            <span className="text-[9px] font-black text-zinc-600 uppercase mb-1 tracking-widest text-center">{t('vector.magnitude')} |A|</span>
                            <span className="text-2xl font-black font-mono text-green-500">{results.magA.toFixed(4)}</span>
                        </div>
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col items-center">
                            <span className="text-[9px] font-black text-zinc-600 uppercase mb-1 tracking-widest text-center">{t('vector.magnitude')} |B|</span>
                            <span className="text-2xl font-black font-mono text-green-500">{results.magB.toFixed(4)}</span>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-7">
                    <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-green-500">analytics</span>
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest self-center">{t('vector.results')}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ResultRow label={t('vector.addition')} value={results.addition} isVector={true} />
                            <ResultRow label={t('vector.subtraction')} value={results.subtraction} isVector={true} />
                            <ResultRow label={t('vector.dot_product')} value={results.dot} />
                            <ResultRow label={t('vector.cross_product')} value={results.cross} isVector={true} />
                        </div>

                        {/* Visual Breakdown Info */}
                        <div className="mt-8 p-4 bg-green-500/5 rounded-xl border border-green-500/20 flex gap-4 items-center">
                            <span className="material-symbols-outlined text-green-500 text-2xl">info</span>
                            <p className="text-[10px] text-zinc-400 italic leading-relaxed">
                                <span className="text-zinc-200 font-bold uppercase not-italic">{t('vector.engine_desc').split(': ')[0]}:</span>
                                {t('vector.engine_desc').split(': ')[1]}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
