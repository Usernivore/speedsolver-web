// Path: src/speedsolver_engine/thermodynamics/generators/IsobaricGenerator.ts

/**
 * SpeedSolver Engine: Isobaric Process Generator
 * Topic: Proceso Isobárico (P constante)
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
 * Generates a question about Isobaric Processes
 */
export const generateIsobaricQuestion = (lang: 'es' | 'en' = 'es'): GeneratedQuestion => {
    const isEn = lang === 'en';
    // 1. Configuration & Constants
    const R_JOULES = 8.314;
    const ATM_L_TO_J = 101.325;

    // 2. Randomize Variables
    const pressure_atm = parseFloat((Math.random() * (5.0 - 1.0) + 1.0).toFixed(1));
    const vol_initial_L = parseFloat((Math.random() * (10.0 - 2.0) + 2.0).toFixed(1));
    const vol_final_L = parseFloat((Math.random() * (25.0 - 12.0) + 12.0).toFixed(1));
    const moles_n = parseFloat((Math.random() * (5.0 - 1.0) + 1.0).toFixed(2));
    const delta_T_C = Math.floor(Math.random() * (200 - 50 + 1) + 50);

    // 3. Select Special Variable (Gas Info)
    const gas_info_options = [
        { label: isEn ? "Monatomic (He)" : "Monoatómico (He)", f: 3, cv_factor: 1.5, cp_factor: 2.5 },
        { label: isEn ? "Monatomic (Ar)" : "Monoatómico (Ar)", f: 3, cv_factor: 1.5, cp_factor: 2.5 },
        { label: isEn ? "Diatomic (N2)" : "Diatómico (N2)", f: 5, cv_factor: 2.5, cp_factor: 3.5 },
        { label: isEn ? "Diatomic (O2)" : "Diatómico (O2)", f: 5, cv_factor: 2.5, cp_factor: 3.5 }
    ];
    const selectedGas = gas_info_options[Math.floor(Math.random() * gas_info_options.length)];

    // 4. Pick Scenario
    const scenarioType = Math.random() > 0.5 ? 'calc_work_isobaric' : 'calc_heat_isobaric';

    let questionLatex = "";
    let explanation = "";
    let correctAnswer = 0;
    const distractors: number[] = [];
    let unit = "J";
    let decimals = 1;

    if (scenarioType === 'calc_work_isobaric') {
        // Scenario: Calculate Work
        const delta_v = vol_final_L - vol_initial_L;
        const work_atm_L = pressure_atm * delta_v;
        correctAnswer = parseFloat((work_atm_L * ATM_L_TO_J).toFixed(1));

        questionLatex = isEn
            ? `A gas expands isobarically at a constant pressure of $${pressure_atm}$ atm from a volume of $${vol_initial_L}$ L to $${vol_final_L}$ L. Calculate the work ($W$) done by the gas in Joules.`
            : `Un gas se expande isobáricamente a una presión constante de $${pressure_atm}$ atm desde un volumen de $${vol_initial_L}$ L hasta $${vol_final_L}$ L. Calcule el trabajo ($W$) realizado por el gas en Joules.`;

        explanation = isEn ? `
1. **Calculate volume change**: $\\Delta V = V_f - V_i = ${vol_final_L} - ${vol_initial_L} = ${delta_v.toFixed(1)} \\text{ L}$.
2. **Isobaric work formula**: $W = P\\Delta V$.
3. **Substitution**: $W = (${pressure_atm} \\text{ atm})(${delta_v.toFixed(1)} \\text{ L}) = ${work_atm_L.toFixed(2)} \\text{ atm}\\cdot\\text{L}$.
4. **Conversion to Joules**: $W = ${work_atm_L.toFixed(2)} \\times 101.325 = \\mathbf{${correctAnswer.toLocaleString()} \\text{ J}}$.
    `.trim() : `
1. **Calcular cambio de volumen**: $\\Delta V = V_f - V_i = ${vol_final_L} - ${vol_initial_L} = ${delta_v.toFixed(1)} \\text{ L}$.
2. **Fórmula de trabajo isobárico**: $W = P\\Delta V$.
3. **Sustitución**: $W = (${pressure_atm} \\text{ atm})(${delta_v.toFixed(1)} \\text{ L}) = ${work_atm_L.toFixed(2)} \\text{ atm}\\cdot\\text{L}$.
4. **Conversión a Joules**: $W = ${work_atm_L.toFixed(2)} \\times 101.325 = \\mathbf{${correctAnswer.toLocaleString()} \\text{ J}}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat(work_atm_L.toFixed(1))); // No conversion
        distractors.push(parseFloat((pressure_atm * (vol_initial_L - vol_final_L) * ATM_L_TO_J).toFixed(1))); // Wrong sign
        distractors.push(parseFloat((pressure_atm * (vol_final_L + vol_initial_L) * ATM_L_TO_J).toFixed(1))); // Add volumes
    } else {
        // Scenario: Calculate Heat
        const cp = selectedGas.cp_factor * R_JOULES;
        correctAnswer = parseFloat((moles_n * cp * delta_T_C).toFixed(1));

        questionLatex = isEn
            ? `$${moles_n}$ moles of a **${selectedGas.label}** gas are heated isobarically, raising its temperature by $${delta_T_C}^\\circ\\text{C}$. Calculate the heat ($Q$) transferred to the system.`
            : `Se calienta isobáricamente $${moles_n}$ moles de un gas **${selectedGas.label}**, elevando su temperatura en $${delta_T_C}^\\circ\\text{C}$. Calcule el calor ($Q$) transferido al sistema.`;

        explanation = isEn ? `
1. **Identify $C_p$**: For a ${selectedGas.label} gas ($f=${selectedGas.f}$), the specific heat at constant pressure is $C_p = \\frac{f+2}{2}R = ${selectedGas.cp_factor}R$.
2. **Isobaric Heat Formula**: $Q = nC_p\\Delta T$.
3. **Substitution**: $Q = (${moles_n}) (${selectedGas.cp_factor} \\times 8.314) (${delta_T_C})$.
4. **Result**: $Q = \\mathbf{${correctAnswer.toLocaleString()} \\text{ J}}$.
    `.trim() : `
1. **Identificar $C_p$**: Para un gas ${selectedGas.label} ($f=${selectedGas.f}$), el calor específico a presión constante es $C_p = \\frac{f+2}{2}R = ${selectedGas.cp_factor}R$.
2. **Fórmula de Calor Isobárico**: $Q = nC_p\\Delta T$.
3. **Sustitución**: $Q = (${moles_n})(${selectedGas.cp_factor} \\times 8.314)(${delta_T_C})$.
4. **Resultado**: $Q = \\mathbf{${correctAnswer.toLocaleString()} \\text{ J}}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat((moles_n * (selectedGas.cv_factor * R_JOULES) * delta_T_C).toFixed(1))); // Use Cv
        distractors.push(parseFloat((moles_n * R_JOULES * delta_T_C).toFixed(1))); // Use R only
        distractors.push(parseFloat((moles_n * selectedGas.cp_factor * 0.08206 * delta_T_C).toFixed(1))); // Wrong units (R in atm)
    }

    // 5. Finalize Options
    const optionsSet = new Set<number>([correctAnswer]);
    distractors.forEach(d => {
        if (d !== correctAnswer && Math.abs(d) > 0.1) optionsSet.add(d);
    });

    while (optionsSet.size < 4) {
        const factor = 0.6 + Math.random() * 0.8;
        const filler = parseFloat((correctAnswer * factor).toFixed(1));
        if (filler !== correctAnswer && Math.abs(filler) > 0.1) optionsSet.add(filler);
    }

    const options = Array.from(optionsSet).map(val => ({
        id: Math.random().toString(36).substr(2, 9),
        value: val,
        label: `${val.toLocaleString()} J`,
        isCorrect: val === correctAnswer
    })).sort(() => Math.random() - 0.5);

    return {
        id: `q_isob_${Math.random().toString(36).substr(2, 9)}`,
        topicId: "termo_isobaric_process",
        questionLatex,
        options,
        explanation,
        difficulty: "Medium"
    };
};
