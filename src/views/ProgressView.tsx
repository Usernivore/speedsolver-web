import React, { useMemo } from 'react';
import { useAppStore } from '../store';
import { cn, formatDuration } from '../lib/utils';

const TOPICS_CONFIG = [
    { id: 'properties', label: 'Propiedades', key: 'properties' },
    { id: 'processes', label: 'Procesos 1ra Ley', key: 'processes' },
    { id: 'cycles', label: 'Ciclos', key: 'cycles' },
    { id: 'entropy', label: 'Entropía', key: 'entropy' },
];

export const ProgressView = () => {
    const { history, streak, totalSolved, totalTimeSeconds, startSession } = useAppStore();

    // Compute dynamic stats from history or store values
    const stats = useMemo(() => {
        const computed = {
            totalSolved: totalSolved,
            streak: streak,
            totalTimeSeconds: totalTimeSeconds,
            globalAccuracy: 0,
            skills: {
                properties: 0,
                processes: 0,
                cycles: 0,
                entropy: 0
            }
        };

        if (history.length > 0) {
            let totalQ = 0;
            let totalC = 0;
            const tTotals: any = { properties: 0, processes: 0, cycles: 0, entropy: 0 };
            const tCorrect: any = { properties: 0, processes: 0, cycles: 0, entropy: 0 };

            history.forEach(s => {
                totalQ += s.totalQuestions;
                totalC += s.score;
                Object.keys(s.topicStats).forEach(topic => {
                    if (tTotals[topic] !== undefined) {
                        tTotals[topic] += s.topicStats[topic].total;
                        tCorrect[topic] += s.topicStats[topic].correct;
                    }
                });
            });

            computed.globalAccuracy = Math.round((totalC / totalQ) * 100);
            (Object.keys(computed.skills) as Array<keyof typeof computed.skills>).forEach(t => {
                computed.skills[t] = tTotals[t] > 0 ? Math.round((tCorrect[t] / tTotals[t]) * 100) : 0;
            });
        }
        return computed;
    }, [history, streak, totalSolved, totalTimeSeconds]);

    // Identify weakest topic
    const weakestTopicKey = (Object.keys(stats.skills) as Array<keyof typeof stats.skills>).reduce((a, b) =>
        stats.skills[a] < stats.skills[b] ? a : b
    );

    const weakestTopic = TOPICS_CONFIG.find(t => t.key === weakestTopicKey);

    const handleRepair = () => {
        if (weakestTopic) {
            startSession(5, 600, [weakestTopic.id]);
        }
    };

    // SVG Radar Chart Logic
    const size = 400;
    const center = size / 2;
    const radius = 140;

    const getPoint = (index: number, value: number) => {
        const r = (value / 100) * radius;
        switch (index) {
            case 0: return `${center},${center - r}`; // Top
            case 1: return `${center + r},${center}`; // Right
            case 2: return `${center},${center + r}`; // Bottom
            case 3: return `${center - r},${center}`; // Left
            default: return `${center},${center}`;
        }
    };

    const playerPoints = TOPICS_CONFIG.map((t, i) =>
        getPoint(i, stats.skills[t.key as keyof typeof stats.skills])
    ).join(' ');

    const gridLevels = [25, 50, 75, 100];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    DIAGNOSTICS <span className="text-orange-500">DASHBOARD</span>
                </h2>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-[0.2em]">
                    System Status: Optimal // User Performance Analysis
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Total Resueltos', value: stats.totalSolved, sub: 'EJERCICIOS', highlight: false },
                    { label: 'Tiempo de Estudio', value: formatDuration(stats.totalTimeSeconds), sub: 'TOTAL ACUMULADO', highlight: false, isTime: true },
                    { label: 'Precisión Global', value: `${stats.globalAccuracy}%`, sub: 'RATIO DE ÉXITO', highlight: true },
                    { label: 'Racha Actual', value: stats.streak, sub: 'DÍAS ACTIVOS', highlight: false },
                ].map((kpi, i) => (
                    <div
                        key={i}
                        className="relative overflow-hidden group bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl transition-all hover:border-orange-500/30"
                    >
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                        <div className="flex items-baseline gap-2">
                            <span className={cn(
                                "font-black tracking-tighter",
                                kpi.highlight ? "text-orange-500" : "text-white",
                                kpi.isTime ? "text-2xl" : "text-5xl"
                            )}>
                                {kpi.value}
                            </span>
                            <span className="text-[10px] font-bold text-gray-600">{kpi.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Radar Chart (Skill Diamond) */}
                <div className="w-full lg:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center relative min-h-[350px] md:min-h-[500px] overflow-hidden">
                    <div className="absolute top-6 left-8">
                        <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Skill Diamond</h3>
                        <div className="h-1 w-12 bg-orange-500 mt-2" />
                    </div>

                    <div className="w-full max-w-[320px] md:max-w-[400px] aspect-square flex items-center justify-center">
                        <svg
                            viewBox={`0 0 ${size} ${size}`}
                            className="w-full h-full drop-shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                        >
                            {/* Grid Lines */}
                            {gridLevels.map((level) => (
                                <polygon
                                    key={level}
                                    points={`${center},${center - (level / 100) * radius} ${center + (level / 100) * radius},${center} ${center},${center + (level / 100) * radius} ${center - (level / 100) * radius},${center}`}
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-gray-800"
                                    strokeWidth="1"
                                />
                            ))}

                            {/* Axes */}
                            <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="currentColor" className="text-gray-800" strokeWidth="1" />
                            <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="currentColor" className="text-gray-800" strokeWidth="1" />

                            {/* Player Polygon */}
                            <polygon
                                points={playerPoints}
                                fill="rgba(249, 115, 22, 0.2)"
                                stroke="#f97316"
                                strokeWidth="3"
                                strokeLinejoin="round"
                                className="animate-pulse-slow"
                            />

                            {/* Labels */}
                            {TOPICS_CONFIG.map((t, i) => {
                                const labelRadius = radius + 30;
                                let x = center;
                                let y = center;
                                let anchor: "inherit" | "middle" | "start" | "end" = "middle";

                                if (i === 0) { y = center - labelRadius; }
                                else if (i === 1) { x = center + labelRadius; anchor = "start"; }
                                else if (i === 2) { y = center + labelRadius + 10; }
                                else if (i === 3) { x = center - labelRadius; anchor = "end"; }

                                return (
                                    <text
                                        key={t.id}
                                        x={x}
                                        y={y}
                                        textAnchor={anchor}
                                        className="fill-gray-400 text-[10px] font-mono uppercase tracking-tighter"
                                    >
                                        {t.label}
                                    </text>
                                );
                            })}
                        </svg>
                    </div>
                </div>

                {/* Diagnostics Panel */}
                <div className="w-full lg:col-span-5 space-y-6">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest">System Diagnostics</h3>
                        </div>

                        <div className="flex-1 space-y-8">
                            {/* Danger Zone */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-mono text-red-500 uppercase tracking-[0.2em]">Critical Vulnerability</p>
                                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                                    <div className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-red-500">warning</span>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">⚠️ Anomalía Detectada: {weakestTopic?.label}</h4>
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                El rendimiento en este módulo ha caído por debajo del umbral de seguridad (45%). Se requiere intervención inmediata.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-mono text-orange-500 uppercase tracking-[0.2em]">Recommended Action</p>
                                <div className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-2xl">
                                    <p className="text-sm text-gray-300 italic">
                                        "La optimización de ciclos termodinámicos es fundamental para la eficiencia del sistema. Inicia un protocolo de reparación."
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleRepair}
                            className="mt-8 w-full py-4 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-widest rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                        >
                            Reparar Módulo
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
