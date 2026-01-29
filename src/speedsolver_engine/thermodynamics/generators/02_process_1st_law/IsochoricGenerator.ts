// Path: src/speedsolver_engine/thermodynamics/generators/02_process_1st_law/IsochoricGenerator.ts

/**
 * SpeedSolver Engine: Isochoric Process Generator
 * Topic: Proceso Isocórico (Volumen Constante)
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
 * Generates a question about Isochoric Processes
 */
export const generateIsochoricQuestion = (): GeneratedQuestion => {
    // 1. Configuration & Constants
    const R_JOULES = 8.314;
    const ATM_L_TO_J = 101.325;

    // 2. Randomize Variables
    const pressure_initial_atm = parseFloat((Math.random() * (3.0 - 1.0) + 1.0).toFixed(1));
    const pressure_final_atm = parseFloat((Math.random() * (8.0 - 3.5) + 3.5).toFixed(1));
    const volume_L = parseFloat((Math.random() * (20.0 - 5.0) + 5.0).toFixed(1));
    const moles_n = parseFloat((Math.random() * (3.0 - 0.5) + 0.5).toFixed(2));

    // 3. Select Special Variable (Gas Info)
    const gas_info_options = [
        { label: "Monoatómico (He)", f: 3, cv_factor: 1.5 },
        { label: "Monoatómico (Ne)", f: 3, cv_factor: 1.5 },
        { label: "Diatómico (N2)", f: 5, cv_factor: 2.5 },
        { label: "Diatómico (O2)", f: 5, cv_factor: 2.5 }
    ];
    const selectedGas = gas_info_options[Math.floor(Math.random() * gas_info_options.length)];

    // 4. Pick Scenario
    const scenarioType = Math.random() > 0.5 ? 'calc_work_isochoric' : 'calc_heat_isochoric';

    let questionLatex = "";
    let explanation = "";
    let correctAnswer = 0;
    const distractors: number[] = [];
    let unit = "J";

    if (scenarioType === 'calc_work_isochoric') {
        // Scenario: Calculate Work
        correctAnswer = 0;

        questionLatex = `Un contenedor rígido de $${volume_L}$ L contiene gas a $${pressure_initial_atm}$ atm. Se calienta hasta que la presión sube a $${pressure_final_atm}$ atm. Calcule el trabajo ($W$) realizado por el gas.`;

        explanation = `
1. **Identificar el proceso**: Un contenedor rígido implica que el volumen es constante ($\\Delta V = 0$).
2. **Definición de Trabajo**: El trabajo termodinámico se define como $W = \\int P dV$.
3. **Análisis**: Como el volumen no cambia ($dV = 0$), no hay desplazamiento de la frontera del sistema.
4. **Resultado**: Por lo tanto, el trabajo realizado es $W = \\mathbf{0 \\text{ J}}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat((pressure_final_atm * volume_L * ATM_L_TO_J).toFixed(0))); // PV final
        distractors.push(parseFloat(((pressure_final_atm - pressure_initial_atm) * volume_L * ATM_L_TO_J).toFixed(0))); // Delta P * V
        distractors.push(parseFloat((((pressure_initial_atm + pressure_final_atm) / 2) * volume_L * ATM_L_TO_J).toFixed(0))); // Avg P * V
    } else {
        // Scenario: Calculate Heat
        const delta_T = 200; // Fixed for this scenario as per JSON
        const cv = selectedGas.cv_factor * R_JOULES;
        correctAnswer = parseFloat((moles_n * cv * delta_T).toFixed(1));

        questionLatex = `Calcule el calor ($Q$) requerido para calentar isocóricamente $${moles_n}$ moles de **${selectedGas.label}** desde 300 K hasta 500 K.`;

        explanation = `
1. **Identificar el proceso**: En un proceso isocórico ($V$ constante), el calor transferido es igual al cambio en la energía interna: $Q = \\Delta U = nC_v\\Delta T$.
2. **Determinar $C_v$**: Para un gas ${selectedGas.label} ($f=${selectedGas.f}$), el calor específico es $C_v = \\frac{f}{2}R = ${selectedGas.cv_factor}R$.
3. **Calcular $\\Delta T$**: $\\Delta T = 500 \\text{ K} - 300 \\text{ K} = 200 \\text{ K}$.
4. **Sustitución**:
   $$Q = (${moles_n})(${selectedGas.cv_factor} \\times 8.314)(${delta_T})$$
5. **Resultado**: $Q = \\mathbf{${correctAnswer.toLocaleString()} \\text{ J}}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat((moles_n * ((selectedGas.f + 2) / 2 * R_JOULES) * delta_T).toFixed(1))); // Use Cp
        distractors.push(parseFloat((moles_n * R_JOULES * delta_T).toFixed(1))); // Use only R
        distractors.push(parseFloat((moles_n * cv * 300).toFixed(1))); // Use T initial instead of Delta T
    }

    // 5. Finalize Options
    const optionsSet = new Set<number>([correctAnswer]);
    distractors.forEach(d => {
        if (d !== correctAnswer && Math.abs(d) > 0.1) optionsSet.add(d);
    });

    while (optionsSet.size < 4) {
        const factor = 0.5 + Math.random();
        const filler = parseFloat((correctAnswer === 0 ? (100 + Math.random() * 900) : (correctAnswer * factor)).toFixed(1));
        if (filler !== correctAnswer && filler > 0) optionsSet.add(filler);
    }

    const options = Array.from(optionsSet).map(val => ({
        id: Math.random().toString(36).substr(2, 9),
        value: val,
        label: `${val.toLocaleString()} J`,
        isCorrect: val === correctAnswer
    })).sort(() => Math.random() - 0.5);

    return {
        id: `q_isoc_${Math.random().toString(36).substr(2, 9)}`,
        topicId: "termo_isochoric_process",
        questionLatex,
        options,
        explanation,
        difficulty: "Medium"
    };
};
