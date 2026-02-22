import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';

type Category = 'Temperature' | 'Pressure' | 'Volume' | 'Energy';

interface UnitOption {
    label: string;
    value: string;
    factor?: number; // Multiplier relative to a base unit (not for temperature)
}

const UNITS: Record<Category, UnitOption[]> = {
    Temperature: [
        { label: 'Celsius (°C)', value: 'C' },
        { label: 'Fahrenheit (°F)', value: 'F' },
        { label: 'Kelvin (K)', value: 'K' },
        { label: 'Rankine (°R)', value: 'R' },
    ],
    Pressure: [
        { label: 'Pascal (Pa)', value: 'Pa', factor: 1 },
        { label: 'Kilopascal (kPa)', value: 'kPa', factor: 1000 },
        { label: 'Megapascal (MPa)', value: 'MPa', factor: 1000000 },
        { label: 'Bar (bar)', value: 'bar', factor: 100000 },
        { label: 'Atmosphere (atm)', value: 'atm', factor: 101325 },
        { label: 'PSI (psi)', value: 'psi', factor: 6894.76 },
    ],
    Volume: [
        { label: 'Cubic Meter (m³)', value: 'm3', factor: 1 },
        { label: 'Liter (L)', value: 'L', factor: 0.001 },
        { label: 'Cubic Centimeter (cm³)', value: 'cm3', factor: 1e-6 },
        { label: 'Gallon (gal)', value: 'gal', factor: 0.00378541 },
        { label: 'Cubic Foot (ft³)', value: 'ft3', factor: 0.0283168 },
    ],
    Energy: [
        { label: 'Joule (J)', value: 'J', factor: 1 },
        { label: 'Kilojoule (kJ)', value: 'kJ', factor: 1000 },
        { label: 'Calorie (cal)', value: 'cal', factor: 4.184 },
        { label: 'Kilocalorie (kcal)', value: 'kcal', factor: 4184 },
        { label: 'BTU', value: 'BTU', factor: 1055.06 },
    ],
};

const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius: number;
    switch (from) {
        case 'F': celsius = (value - 32) / 1.8; break;
        case 'K': celsius = value - 273.15; break;
        case 'R': celsius = (value / 1.8) - 273.15; break;
        default: celsius = value;
    }
    switch (to) {
        case 'F': return (celsius * 1.8) + 32;
        case 'K': return celsius + 273.15;
        case 'R': return (celsius + 273.15) * 1.8;
        default: return celsius;
    }
};

const CustomDropdown = ({ value, options, onChange }: { value: string, options: UnitOption[], onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selected = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-zinc-800/50 border border-white/5 rounded-xl p-3 text-xs font-bold text-zinc-300 flex items-center justify-between hover:bg-zinc-800 transition-all outline-none focus:border-primary/50"
            >
                <span className="truncate pr-2">{selected?.label}</span>
                <span className={cn("material-symbols-outlined text-zinc-500 transition-transform duration-300", isOpen ? "rotate-180" : "")}>expand_more</span>
            </button>
            {isOpen && (
                <div className="absolute z-[100] w-full mt-2 bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200">
                    <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "px-4 py-3 text-xs font-medium cursor-pointer transition-all",
                                    opt.value === value
                                        ? "bg-primary/20 text-primary border-l-2 border-primary"
                                        : "text-zinc-400 hover:bg-neutral-800 hover:text-white"
                                )}
                            >
                                {opt.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export const UnitConverterView = () => {
    const setView = useAppStore((state) => state.setView);
    const [category, setCategory] = useState<Category>('Pressure');
    const [inputValue, setInputValue] = useState<string>('1');
    const [fromUnit, setFromUnit] = useState<string>(UNITS['Pressure'][0].value);
    const [toUnit, setToUnit] = useState<string>(UNITS['Pressure'][1].value);
    const [result, setResult] = useState<number>(0);

    useEffect(() => {
        setFromUnit(UNITS[category][0].value);
        setToUnit(UNITS[category][1] ? UNITS[category][1].value : UNITS[category][0].value);
    }, [category]);

    useEffect(() => {
        const val = parseFloat(inputValue);
        if (isNaN(val)) {
            setResult(0);
            return;
        }

        if (category === 'Temperature') {
            setResult(convertTemperature(val, fromUnit, toUnit));
        } else {
            const fromFactor = UNITS[category].find(u => u.value === fromUnit)?.factor || 1;
            const toFactor = UNITS[category].find(u => u.value === toUnit)?.factor || 1;
            setResult((val * fromFactor) / toFactor);
        }
    }, [inputValue, fromUnit, toUnit, category]);

    const handleSwap = () => {
        const temp = fromUnit;
        setFromUnit(toUnit);
        setToUnit(temp);
    };

    const categories: { id: Category; icon: string }[] = [
        { id: 'Temperature', icon: 'thermostat' },
        { id: 'Pressure', icon: 'speed' },
        { id: 'Volume', icon: 'view_in_ar' },
        { id: 'Energy', icon: 'bolt' },
    ];

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
                            Conversor de <span className="text-primary">Unidades</span>
                        </h2>
                    </div>
                    <p className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-[0.2em] ml-11">
                        Engineering Toolbox // Multi-Unit Converter
                    </p>
                </div>
            </div>

            <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                {/* Category Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5 bg-black/20">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={cn(
                                "flex items-center justify-center gap-2 py-5 px-4 transition-all border-b-2 hover:bg-white/[0.02] outline-none",
                                category === cat.id
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-transparent text-zinc-500"
                            )}
                        >
                            <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{cat.id}</span>
                        </button>
                    ))}
                </div>

                <div className="p-8 md:p-12 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-6">
                        {/* Input Component */}
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">De Valor</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-2xl font-mono text-white outline-none focus:border-primary/50 transition-all shadow-inner"
                                    placeholder="0.00"
                                />
                                <div className="absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none">
                                    <span className="text-[10px] font-black text-zinc-700 uppercase">{fromUnit}</span>
                                </div>
                            </div>
                            <CustomDropdown
                                value={fromUnit}
                                options={UNITS[category]}
                                onChange={setFromUnit}
                            />
                        </div>

                        {/* Swap Button */}
                        <div className="flex items-center justify-center">
                            <button
                                onClick={handleSwap}
                                className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 hover:scale-110 active:scale-95 transition-all text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] group"
                                title="Swap units"
                            >
                                <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">sync_alt</span>
                            </button>
                        </div>

                        {/* Result Component */}
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">A Resultado</label>
                            <div className="relative group">
                                <div className="w-full bg-primary/5 border border-primary/20 rounded-2xl p-5 min-h-[72px] flex items-center">
                                    <span className="text-2xl font-mono font-black text-white block overflow-hidden truncate">
                                        {result % 1 === 0 ? result : result.toFixed(6).replace(/\.?0+$/, "")}
                                    </span>
                                </div>
                                <div className="absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none">
                                    <span className="text-[10px] font-black text-primary/60 uppercase">{toUnit}</span>
                                </div>
                            </div>
                            <CustomDropdown
                                value={toUnit}
                                options={UNITS[category]}
                                onChange={setToUnit}
                            />
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Precisión del Motor</p>
                            <p className="text-xs text-zinc-400 font-medium italic">Alta fidelidad (IEEE-754)</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Base de Cálculo</p>
                            <p className="text-xs text-zinc-400 font-medium italic truncate">
                                {category === 'Temperature' ? 'Celsius Intermedio' : `Convertido vía ${UNITS[category].find(u => u.factor === 1)?.label || 'SI'}`}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Engine Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Help Hint */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex gap-4 items-center">
                <span className="material-symbols-outlined text-zinc-400">info</span>
                <p className="text-[11px] text-zinc-500 italic leading-relaxed">
                    Tip: Haz clic en las flechas centrales para intercambiar unidades rápidamente. Los factores de conversión se basan en el sistema internacional de medidas.
                </p>
            </div>
        </div>
    );
};
