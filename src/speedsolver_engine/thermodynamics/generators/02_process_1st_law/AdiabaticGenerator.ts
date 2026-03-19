// Path: src/speedsolver_engine/thermodynamics/generators/02_process_1st_law/AdiabaticGenerator.ts

/**
 * SpeedSolver Engine: Adiabatic Process Generator
 * Topic: Proceso Adiabático (Q=0)
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
 * Generates a question about Adiabatic Processes
 */
export const generateAdiabaticQuestion = (lang: 'es' | 'en' = 'es'): GeneratedQuestion => {
    const isEn = lang === 'en';
    // 1. Configuration & Constants
    const R_JOULES = 8.314;
    const ABS_ZERO = 273.15;

    // 2. Randomize Variables
    const moles_n = parseFloat((Math.random() * (3.0 - 0.5) + 0.5).toFixed(2));
    const temperature_initial_C = Math.floor(Math.random() * (100 - 20 + 1) + 20);
    const volume_initial_L = parseFloat((Math.random() * (5.0 - 2.0) + 2.0).toFixed(1));
    const compression_factor = parseFloat((Math.random() * (0.8 - 0.2) + 0.2).toFixed(2));

    // 3. Select Special Variable (Gas Info)
    const gas_info_options = [
        { label: isEn ? "Monatomic (He)" : "Monoatómico (He)", gamma: 1.67, cv_factor: 1.5 },
        { label: isEn ? "Monatomic (Ar)" : "Monoatómico (Ar)", gamma: 1.67, cv_factor: 1.5 },
        { label: isEn ? "Diatomic (N2)" : "Diatómico (N2)", gamma: 1.4, cv_factor: 2.5 },
        { label: isEn ? "Diatomic (O2)" : "Diatómico (O2)", gamma: 1.4, cv_factor: 2.5 }
    ];
    const selectedGas = gas_info_options[Math.floor(Math.random() * gas_info_options.length)];

    // 4. Pick Scenario
    const scenarioType = Math.random() > 0.5 ? 'calc_final_temp_adiabatic' : 'calc_work_adiabatic';

    let questionLatex = "";
    let explanation = "";
    let correctAnswer = 0;
    const distractors: number[] = [];

    const temp_initial_K = temperature_initial_C + ABS_ZERO;
    const volume_final_L = parseFloat((volume_initial_L * compression_factor).toFixed(2));

    // Adiabatic Law: T1 * V1^(gamma-1) = T2 * V2^(gamma-1)
    const temp_final_K = temp_initial_K * Math.pow(volume_initial_L / volume_final_L, selectedGas.gamma - 1);

    if (scenarioType === 'calc_final_temp_adiabatic') {
        // Scenario: Calculate Final Temperature
        correctAnswer = parseFloat(temp_final_K.toFixed(1));

        questionLatex = isEn
            ? `An ideal gas **${selectedGas.label}** at $${temperature_initial_C}^\\circ\\text{C}$ is compressed adiabatically from $${volume_initial_L}$ L to a final volume $V_f = ${volume_final_L}$ L. Calculate the final temperature ($T_f$) in Kelvin.`
            : `Un gas ideal **${selectedGas.label}** a $${temperature_initial_C}^\\circ\\text{C}$ se comprime adiabáticamente desde $${volume_initial_L}$ L hasta un volumen final $V_f = ${volume_final_L}$ L. Calcule la temperatura final ($T_f$) en Kelvin.`;

        explanation = isEn ? `
1. **Identify data**: ${selectedGas.label} gas ($\\gamma = ${selectedGas.gamma}$).
2. **Initial temperature**: $T_i = ${temperature_initial_C} + 273.15 = ${temp_initial_K.toFixed(2)} \\text{ K}$.
3. **Adiabatic relation**: For an adiabatic process, $T_i V_i^{\\gamma-1} = T_f V_f^{\\gamma-1}$.
4. **Solve for $T_f$**:
   $$T_f = T_i \\left(\\frac{V_i}{V_f}\\right)^{\\gamma-1}$$
5. **Substitution**:
   $$T_f = ${temp_initial_K.toFixed(2)} \\left(\\frac{${volume_initial_L}}{${volume_final_L}}\\right)^{${(selectedGas.gamma - 1).toFixed(2)}}$$
6. **Result**: $T_f = \\mathbf{${correctAnswer.toLocaleString()} \\text{ K}}$.
    `.trim() : `
1. **Identificar datos**: Gas ${selectedGas.label} ($\\gamma = ${selectedGas.gamma}$).
2. **Temperatura inicial**: $T_i = ${temperature_initial_C} + 273.15 = ${temp_initial_K.toFixed(2)} \\text{ K}$.
3. **Relación adiabática**: Para un proceso adiabático, $T_i V_i^{\\gamma-1} = T_f V_f^{\\gamma-1}$.
4. **Despejar $T_f$**:
   $$T_f = T_i \\left(\\frac{V_i}{V_f}\\right)^{\\gamma-1}$$
5. **Sustitución**:
   $$T_f = ${temp_initial_K.toFixed(2)} \\left(\\frac{${volume_initial_L}}{${volume_final_L}}\\right)^{${(selectedGas.gamma - 1).toFixed(2)}}$$
6. **Resultado**: $T_f = \\mathbf{${correctAnswer.toLocaleString()} \\text{ K}}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat((temp_initial_K * (volume_initial_L / volume_final_L)).toFixed(1))); // No gamma power
        distractors.push(parseFloat((temp_initial_K * Math.pow(volume_initial_L / volume_final_L, selectedGas.gamma)).toFixed(1))); // Used gamma instead of gamma-1
        distractors.push(parseFloat((temperature_initial_C * Math.pow(volume_initial_L / volume_final_L, selectedGas.gamma - 1)).toFixed(1))); // Used Celsius
    } else {
        // Scenario: Calculate Work
        // W = -Delta U = -n * Cv * (Tf - Ti) = n * Cv * (Ti - Tf)
        const cv = selectedGas.cv_factor * R_JOULES;
        const work_joules = moles_n * cv * (temp_initial_K - temp_final_K);
        correctAnswer = parseFloat(work_joules.toFixed(0));

        questionLatex = isEn
            ? `$${moles_n}$ moles of an ideal gas **${selectedGas.label}** are compressed adiabatically. The temperature increases from $${temperature_initial_C}^\\circ\\text{C}$ to a final temperature of $${(temp_final_K - ABS_ZERO).toFixed(1)}^\\circ\\text{C}$. Calculate the work ($W$) done by the gas.`
            : `$${moles_n}$ moles de un gas ideal **${selectedGas.label}** se comprimen adiabáticamente. La temperatura aumenta desde $${temperature_initial_C}^\\circ\\text{C}$ hasta una temperatura final de $${(temp_final_K - ABS_ZERO).toFixed(1)}^\\circ\\text{C}$. Calcule el trabajo ($W$) realizado por el gas.`;

        explanation = isEn ? `
1. **Identify the process**: In an adiabatic process, $Q = 0$. By the First Law: $\\Delta U = Q - W \\rightarrow W = -\\Delta U$.
2. **Internal Energy Change**: $\\Delta U = nC_v(T_f - T_i)$.
3. **Calculate Work**: $W = -nC_v(T_f - T_i) = nC_v(T_i - T_f)$.
4. **Data**: $n = ${moles_n}$, $C_v = ${selectedGas.cv_factor}R$, $T_i = ${temp_initial_K.toFixed(2)} \\text{ K}$, $T_f = ${temp_final_K.toFixed(2)} \\text{ K}$.
5. **Substitution**:
   $$W = (${moles_n}) (${selectedGas.cv_factor} \\times 8.314) (${temp_initial_K.toFixed(2)} - ${temp_final_K.toFixed(2)})$$
6. **Result**: $W = \\mathbf{${correctAnswer.toLocaleString()} \\text{ J}}$. (The negative sign indicates work was done ON the gas).
    `.trim() : `
1. **Identificar el proceso**: En un proceso adiabático, $Q = 0$. Por la Primera Ley: $\\Delta U = Q - W \\rightarrow W = -\\Delta U$.
2. **Cambio de Energía Interna**: $\\Delta U = nC_v(T_f - T_i)$.
3. **Calcular Trabajo**: $W = -nC_v(T_f - T_i) = nC_v(T_i - T_f)$.
4. **Datos**: $n = ${moles_n}$, $C_v = ${selectedGas.cv_factor}R$, $T_i = ${temp_initial_K.toFixed(2)} \\text{ K}$, $T_f = ${temp_final_K.toFixed(2)} \\text{ K}$.
5. **Sustitución**:
   $$W = (${moles_n})(${selectedGas.cv_factor} \\times 8.314)(${temp_initial_K.toFixed(2)} - ${temp_final_K.toFixed(2)})$$
6. **Resultado**: $W = \\mathbf{${correctAnswer.toLocaleString()} \\text{ J}}$. (El signo negativo indica trabajo realizado sobre el gas).
    `.trim();

        // Distractors
        distractors.push(parseFloat((-work_joules).toFixed(0))); // Wrong sign
        distractors.push(parseFloat((moles_n * R_JOULES * (temp_initial_K - temp_final_K)).toFixed(0))); // Forgot Cv factor
        distractors.push(parseFloat((moles_n * (selectedGas.cv_factor + 1) * R_JOULES * (temp_initial_K - temp_final_K)).toFixed(0))); // Used Cp instead of Cv
    }

    // 5. Finalize Options
    const optionsSet = new Set<number>([correctAnswer]);
    distractors.forEach(d => {
        if (d !== correctAnswer && Math.abs(d) > 1) optionsSet.add(d);
    });

    while (optionsSet.size < 4) {
        const factor = 0.7 + Math.random() * 0.6;
        const filler = parseFloat((correctAnswer * factor).toFixed(scenarioType === 'calc_final_temp_adiabatic' ? 1 : 0));
        if (filler !== correctAnswer) optionsSet.add(filler);
    }

    const options = Array.from(optionsSet).map(val => ({
        id: Math.random().toString(36).substr(2, 9),
        value: val,
        label: `${val.toLocaleString()} ${scenarioType === 'calc_final_temp_adiabatic' ? 'K' : 'J'}`,
        isCorrect: val === correctAnswer
    })).sort(() => Math.random() - 0.5);

    return {
        id: `q_adia_${Math.random().toString(36).substr(2, 9)}`,
        topicId: "termo_adiabatic_process",
        questionLatex,
        options,
        explanation,
        difficulty: "Hard"
    };
};
