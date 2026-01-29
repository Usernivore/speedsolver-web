// Path: src/speedsolver_engine/thermodynamics/generators/03_cycles_engines/CarnotGenerator.ts

/**
 * SpeedSolver Engine: Carnot Cycle Generator
 * Topic: Ciclo de Carnot (Eficiencia Máxima)
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
 * Generates a question about the Carnot Cycle
 */
export const generateCarnotQuestion = (): GeneratedQuestion => {
    // 1. Configuration & Constants
    const ABS_ZERO = 273.15;

    // 2. Randomize Variables
    const temp_hot_C = Math.floor(Math.random() * (600 - 300 + 1) + 300);
    const temp_cold_C = Math.floor(Math.random() * (100 - 25 + 1) + 25);
    const heat_in_joules = Math.floor(Math.random() * (5000 - 1000 + 1) + 1000);

    // 3. Select Special Variable (Engine Context)
    const engine_context_options = [
        { label: "Motor Térmico Ideal" },
        { label: "Planta de Potencia (Teórica)" }
    ];
    const selectedEngine = engine_context_options[Math.floor(Math.random() * engine_context_options.length)];

    // 4. Pick Scenario
    const scenarioType = Math.random() > 0.5 ? 'calc_carnot_efficiency' : 'calc_work_output';

    let questionLatex = "";
    let explanation = "";
    let correctAnswer = 0;
    const distractors: number[] = [];
    let unit = "";
    let decimals = 1;

    const th_k = temp_hot_C + ABS_ZERO;
    const tc_k = temp_cold_C + ABS_ZERO;
    const efficiency_decimal = 1 - (tc_k / th_k);

    if (scenarioType === 'calc_carnot_efficiency') {
        // Scenario: Calculate Carnot Efficiency
        unit = "%";
        decimals = 1;
        correctAnswer = parseFloat((efficiency_decimal * 100).toFixed(decimals));

        questionLatex = `Un **${selectedEngine.label}** opera según el ciclo de Carnot entre una fuente de alta temperatura a $${temp_hot_C}^\\circ\\text{C}$ y un sumidero a $${temp_cold_C}^\\circ\\text{C}$. Calcule su eficiencia térmica máxima ($\\eta$).`;

        explanation = `
1. **Convertir a Kelvin (CRÍTICO)**:
   $T_H = ${temp_hot_C} + 273.15 = ${th_k.toFixed(2)} \\text{ K}$
   $T_C = ${temp_cold_C} + 273.15 = ${tc_k.toFixed(2)} \\text{ K}$
2. **Eficiencia de Carnot**: La eficiencia máxima teórica está dada por $\\eta = 1 - \\frac{T_C}{T_H}$.
3. **Sustitución**:
   $$\\eta = 1 - \\frac{${tc_k.toFixed(2)}}{${th_k.toFixed(2)}} = ${efficiency_decimal.toFixed(4)}$$
4. **Resultado**: $\\eta = \\mathbf{${correctAnswer} \\%}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat(((1 - (temp_cold_C / temp_hot_C)) * 100).toFixed(decimals))); // Celsius error
        distractors.push(parseFloat(((1 - (th_k / tc_k)) * 100).toFixed(decimals))); // Inverted (negative)
        distractors.push(parseFloat(((tc_k / th_k) * 100).toFixed(decimals))); // Simple ratio Tc/Th
    } else {
        // Scenario: Calculate Work Output
        unit = "J";
        decimals = 0;
        const work_joules = efficiency_decimal * heat_in_joules;
        correctAnswer = parseFloat(work_joules.toFixed(decimals));

        questionLatex = `Una máquina de Carnot recibe $${heat_in_joules.toLocaleString()}$ J de calor de una fuente a $${temp_hot_C}^\\circ\\text{C}$ y rechaza calor a un sumidero a $${temp_cold_C}^\\circ\\text{C}$. ¿Cuánto trabajo ($W_{\\text{neto}}$) produce?`;

        explanation = `
1. **Calcular Eficiencia ($\eta$)**: Primero determinamos la eficiencia de Carnot usando temperaturas en Kelvin.
   $$\\eta = 1 - \\frac{T_C}{T_H} = 1 - \\frac{${tc_k.toFixed(2)}}{${th_k.toFixed(2)}} = ${efficiency_decimal.toFixed(4)}$$
2. **Definición de Eficiencia**: $\\eta = \\frac{W_{\\text{neto}}}{Q_{\\text{entrada}}}$.
3. **Despejar Trabajo**: $W = \\eta \\cdot Q_{\\text{entrada}}$.
4. **Sustitución**:
   $$W = ${efficiency_decimal.toFixed(4)} \\times ${heat_in_joules.toLocaleString()}$$
5. **Resultado**: $W = \\mathbf{${correctAnswer.toLocaleString()} \\text{ J}}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat((heat_in_joules * ((temp_hot_C - temp_cold_C) / temp_hot_C)).toFixed(decimals))); // Celsius efficiency
        distractors.push(parseFloat(heat_in_joules.toFixed(decimals))); // W = Q (100% efficiency)
        distractors.push(parseFloat((heat_in_joules * (tc_k / th_k)).toFixed(decimals))); // Used Tc/Th ratio instead of efficiency
    }

    // 5. Finalize Options
    const optionsSet = new Set<number>([correctAnswer]);
    distractors.forEach(d => {
        // Ensure distractor is positive and not equal to correct answer
        const val = Math.abs(d);
        if (val !== correctAnswer && val > 0) optionsSet.add(val);
    });

    while (optionsSet.size < 4) {
        const factor = 0.5 + Math.random();
        const filler = parseFloat((correctAnswer * factor).toFixed(decimals));
        if (filler !== correctAnswer && filler > 0) optionsSet.add(filler);
    }

    const options = Array.from(optionsSet).map(val => ({
        id: Math.random().toString(36).substr(2, 9),
        value: val,
        label: `${val.toLocaleString()} ${unit}`,
        isCorrect: val === correctAnswer
    })).sort(() => Math.random() - 0.5);

    return {
        id: `q_carnot_${Math.random().toString(36).substr(2, 9)}`,
        topicId: "termo_carnot_cycle",
        questionLatex,
        options,
        explanation,
        difficulty: "Hard"
    };
};
