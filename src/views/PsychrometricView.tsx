import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import {
    solvePsychro,
    PsychroResult
} from '../lib/psychroUtils';

interface PropertyConfig {
    key: keyof PsychroResult;
    label: string;
    unit: string;
    icon: string;
    placeholder: string;
}

const PROPERTIES: PropertyConfig[] = [
    { key: 'tdb', label: 'psychro.db_temp', unit: '°C', icon: 'device_thermostat', placeholder: '25.0' },
    { key: 'twb', label: 'psychro.wb_temp', unit: '°C', icon: 'water_drop', placeholder: '18.0' },
    { key: 'tdp', label: 'psychro.dp_temp', unit: '°C', icon: 'opacity', placeholder: '14.0' },
    { key: 'rh', label: 'psychro.rel_hum', unit: '%', icon: 'humidity_percentage', placeholder: '50.0' },
    { key: 'omega', label: 'psychro.abs_hum', unit: 'g/kg', icon: 'format_overline', placeholder: '9.8' },
    { key: 'enthalpy', label: 'psychro.enthalpy', unit: 'kJ/kg', icon: 'heat_plus', placeholder: '50.0' },
    { key: 'volume', label: 'psychro.volume', unit: 'm³/kg', icon: 'view_in_ar', placeholder: '0.86' },
];

export const PsychrometricView = () => {
    const { t } = useTranslation();
    const [values, setValues] = useState<Partial<Record<keyof PsychroResult, string>>>({});
    const [userInputs, setUserInputs] = useState<Array<keyof PsychroResult>>([]);
    const [warning, setWarning] = useState<string | null>(null);

    // Auto-calculate logic
    useEffect(() => {
        if (userInputs.length === 2) {
            const numericInputs: Record<string, number> = {};
            userInputs.forEach(key => {
                const val = parseFloat(values[key] || '0');
                if (!isNaN(val)) numericInputs[key] = val;
            });

            if (Object.keys(numericInputs).length === 2) {
                const result = solvePsychro(numericInputs);
                if (result) {
                    const newValues = { ...values };
                    PROPERTIES.forEach(p => {
                        if (!userInputs.includes(p.key)) {
                            let displayVal = result[p.key];
                            if (p.key === 'omega') displayVal *= 1000; // kg/kg -> g/kg
                            newValues[p.key] = displayVal.toFixed(p.key === 'volume' ? 4 : 2);
                        }
                    });
                    setValues(newValues);
                    setWarning(null);
                } else if (!numericInputs.tdb) {
                    setWarning("For now, at least one input must be Dry Bulb (Tdb).");
                }
            }
        }
    }, [userInputs, values]);

    const handleInputChange = (key: keyof PsychroResult, val: string) => {
        // If the user clears a manual input
        if (val === '') {
            const newValues = { ...values };
            delete newValues[key];

            // If it was a user input, remove from userInputs and clear all non-user inputs
            if (userInputs.includes(key)) {
                const newUserInputs = userInputs.filter(k => k !== key);
                setUserInputs(newUserInputs);

                // Clear all values that aren't in the NEW userInputs
                const resetValues: Partial<Record<keyof PsychroResult, string>> = {};
                newUserInputs.forEach(k => { resetValues[k] = values[k]; });
                setValues(resetValues);
            } else {
                setValues(newValues);
            }
            setWarning(null);
            return;
        }

        // If field is NOT in userInputs
        if (!userInputs.includes(key)) {
            if (userInputs.length < 2) {
                // Add as new user input
                setUserInputs([...userInputs, key]);
                setValues(prev => ({ ...prev, [key]: val }));
            } else {
                // Already have 2 inputs - ignore or show warning?
                setWarning("Only 2 initial properties are required for a complete state definition.");
            }
        } else {
            // Updating existing user input
            setValues(prev => ({ ...prev, [key]: val }));
        }
    };

    const resetFields = () => {
        setValues({});
        setUserInputs([]);
        setWarning(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-orange-500 text-3xl">air</span>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase italic">
                        {t('psychro.title').split(' ')[0]} <span className="text-orange-500">{t('psychro.title').split(' ').slice(1).join(' ')}</span>
                    </h2>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] ml-1">
                        {t('psychro.toolbox')}
                    </p>
                    <button
                        onClick={resetFields}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-black text-zinc-400 uppercase tracking-widest transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        {t('common.clear')}
                    </button>
                </div>
            </div>

            {/* Smart Grid */}
            <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {PROPERTIES.map((prop) => {
                        const isUserTyped = userInputs.includes(prop.key);
                        const isCalculated = !isUserTyped && values[prop.key] !== undefined;
                        const isDisabled = !isUserTyped && userInputs.length >= 2;

                        return (
                            <div key={prop.key} className="space-y-2 group">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors">
                                        {t(prop.label)}
                                    </label>
                                    {isCalculated && (
                                        <span className="text-[8px] font-black bg-orange-500/10 text-orange-500/70 px-1.5 py-0.5 rounded border border-orange-500/20 uppercase tracking-tighter">
                                            Result
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={values[prop.key] || ''}
                                        onChange={(e) => handleInputChange(prop.key, e.target.value)}
                                        readOnly={isDisabled}
                                        placeholder={prop.placeholder}
                                        className={cn(
                                            "w-full bg-black/20 border rounded-2xl p-4 text-sm font-mono transition-all outline-none",
                                            isUserTyped
                                                ? "border-white/10 text-white focus:border-orange-500/50 focus:bg-black/30"
                                                : isCalculated
                                                    ? "border-orange-500/20 bg-orange-500/5 text-orange-500 font-bold"
                                                    : "border-white/5 text-zinc-700 cursor-not-allowed opacity-40"
                                        )}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-zinc-500 uppercase">
                                        {prop.unit}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Status & Warning */}
                <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className={cn("size-2 rounded-full animate-pulse", userInputs.length === 2 ? "bg-green-500" : "bg-orange-500/50")} />
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                {userInputs.length === 0
                                    ? "Waiting for input (0/2)"
                                    : userInputs.length === 1
                                        ? "Need one more property (1/2)"
                                        : "State Postulate Satisfied (2/2)"}
                            </span>
                        </div>
                        {warning && (
                            <p className="text-[9px] font-bold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-3 py-1.5 rounded-lg animate-bounce">
                                {warning}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 bg-black/20 px-6 py-4 rounded-2xl border border-white/5">
                        <span className="material-symbols-outlined text-orange-500 text-2xl">verified_user</span>
                        <div className="space-y-0.5">
                            <p className="text-[9px] text-zinc-400 italic">
                                {t('psychro.standard_pressure')}
                            </p>
                            <p className="text-[8px] text-zinc-600 uppercase tracking-tighter">
                                Sea Level Analysis // ASME-ASHRAE Compliant
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hint Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Postulate</span>
                    <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                        According to the state postulate, the thermodynamic state of a simple compressible system is completely specified by two independent, intensive properties.
                    </p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Calculated Results</span>
                    <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                        Orange highlighted fields represent values calculated by the psychrometric engine. To change inputs, simply clear a field and type in another.
                    </p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Limitations</span>
                    <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                        The current solver requires at least one thermal input (Tdb) to avoid complex non-linear iterations. This covers 99% of engineering use cases.
                    </p>
                </div>
            </div>
        </div>
    );
};
