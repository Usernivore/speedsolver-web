/**
 * SpeedSolver Engine: Internal Energy Generator
 * Topic: Energía Interna (U)
 */

export interface GeneratedQuestion {
    id: string;
    topicId: string;
    questionLatex: string;
    options: Array<{
        id: string;
        value: number;
        label: string;
        isCorrect: boolean;
    }>;
    explanation: string;
    difficulty: "Easy" | "Medium" | "Hard";
}

/**
 * Generates a question about Internal Energy (U)
 */
export const generateEnergyQuestion = (lang: 'es' | 'en' = 'es'): GeneratedQuestion => {
    const isEn = lang === 'en';
    // 1. Configuration & Constants
    const R = 8.314;
    const ABS_ZERO = 273.15;

    // 2. Randomize Variables
    const moles_n = parseFloat((Math.random() * (4.0 - 0.5) + 0.5).toFixed(2));
    const temperature_initial_C = Math.floor(Math.random() * (100 - 25 + 1) + 25);

    // 3. Select Special Variable (Gas Type)
    const gas_info_options = [
        { label: isEn ? "Monatomic (Helium)" : "Monoatómico (Helio)", f: 3 },
        { label: isEn ? "Monatomic (Neon)" : "Monoatómico (Neón)", f: 3 },
        { label: isEn ? "Diatomic (Nitrogen)" : "Diatómico (Nitrógeno)", f: 5 },
        { label: isEn ? "Diatomic (Oxygen)" : "Diatómico (Oxígeno)", f: 5 }
    ];
    const selectedGas = gas_info_options[Math.floor(Math.random() * gas_info_options.length)];

    // 4. Physics Logic (Correct Answer)
    const temp_K = temperature_initial_C + ABS_ZERO;
    const U_joules = (selectedGas.f / 2) * moles_n * R * temp_K;
    const correctAnswer = parseFloat(U_joules.toFixed(0)); // Energy usually rounded to nearest J or 1 decimal

    // 5. Generate Distractors
    const distractors: number[] = [];

    // Distractor 1: Wrong f (Degrees of freedom)
    const wrong_f = selectedGas.f === 3 ? 5 : 3;
    const val_wrong_f = (wrong_f / 2) * moles_n * R * temp_K;
    distractors.push(parseFloat(val_wrong_f.toFixed(0)));

    // Distractor 2: Wrong R (using 0.082)
    const val_wrong_R = (selectedGas.f / 2) * moles_n * 0.082 * temp_K;
    distractors.push(parseFloat(val_wrong_R.toFixed(0)));

    // Distractor 3: Celsius Error (using T in Celsius instead of Kelvin)
    const val_celsius_error = (selectedGas.f / 2) * moles_n * R * temperature_initial_C;
    distractors.push(parseFloat(val_celsius_error.toFixed(0)));

    // Ensure unique options
    const optionsSet = new Set<number>([correctAnswer]);
    distractors.forEach(d => {
        if (d !== correctAnswer && d > 0) optionsSet.add(d);
    });

    // Fill if duplicates existed
    while (optionsSet.size < 4) {
        const filler = parseFloat((correctAnswer * (0.5 + Math.random())).toFixed(0));
        if (filler !== correctAnswer) optionsSet.add(filler);
    }

    const options = Array.from(optionsSet).map(val => ({
        id: Math.random().toString(36).substr(2, 9),
        value: val,
        label: `${val.toLocaleString()} J`,
        isCorrect: val === correctAnswer
    })).sort(() => Math.random() - 0.5);

    // 6. Format Question and Explanation (LaTeX)
    const questionLatex = isEn
        ? `Calculate the total internal energy ($U$) of $${moles_n}$ moles of a **${selectedGas.label}** gas at $${temperature_initial_C}^\\circ\\text{C}$.`
        : `Calcule la energía interna total ($U$) de $${moles_n}$ moles de un gas **${selectedGas.label}** a $${temperature_initial_C}^\\circ\\text{C}$.`;

    const explanation = isEn ? `
1. **Identify the gas**: The gas is ${selectedGas.label}, therefore, the degrees of freedom are $f = ${selectedGas.f}$.
2. **Convert temperature**: $T = ${temperature_initial_C} + 273.15 = ${temp_K.toFixed(2)} \\text{ K}$.
3. **Apply formula**: Internal energy is calculated as $U = \\frac{f}{2}nRT$.
4. **Substitute values**: 
   $$U = \\frac{${selectedGas.f}}{2} (${moles_n}) (8.314) (${temp_K.toFixed(2)})$$
5. **Result**: $U = ${correctAnswer.toLocaleString()} \\text{ J}$.
  `.trim() : `
1. **Identificar el gas**: El gas es ${selectedGas.label}, por lo tanto, los grados de libertad son $f = ${selectedGas.f}$.
2. **Convertir temperatura**: $T = ${temperature_initial_C} + 273.15 = ${temp_K.toFixed(2)} \\text{ K}$.
3. **Aplicar fórmula**: La energía interna se calcula como $U = \\frac{f}{2}nRT$.
4. **Sustituir valores**: 
   $$U = \\frac{${selectedGas.f}}{2} (${moles_n}) (8.314) (${temp_K.toFixed(2)})$$
5. **Resultado**: $U = ${correctAnswer.toLocaleString()} \\text{ J}$.
  `.trim();

    return {
        id: `q_u_${Math.random().toString(36).substr(2, 9)}`,
        topicId: "termo_internal_energy",
        questionLatex,
        options,
        explanation,
        difficulty: "Medium"
    };
};
