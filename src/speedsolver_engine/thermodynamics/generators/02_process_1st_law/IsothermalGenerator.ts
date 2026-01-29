// Path: src/speedsolver_engine/thermodynamics/generators/02_process_1st_law/IsothermalGenerator.ts

/**
 * SpeedSolver Engine: Isothermal Process Generator
 * Topic: Proceso Isotérmico (T constante)
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
 * Generates a question about Isothermal Processes
 */
export const generateIsothermalQuestion = (): GeneratedQuestion => {
    // 1. Configuration & Constants
    const R_JOULES = 8.314;
    const ABS_ZERO = 273.15;

    // 2. Randomize Variables
    const moles_n = parseFloat((Math.random() * (4.0 - 0.5) + 0.5).toFixed(2));
    const temperature_C = Math.floor(Math.random() * (300 - 25 + 1) + 25);
    const vol_initial_L = parseFloat((Math.random() * (5.0 - 2.0) + 2.0).toFixed(1));
    const expansion_ratio = parseFloat((Math.random() * (5.0 - 2.0) + 2.0).toFixed(1));

    // 3. Pick Scenario
    const scenarioType = Math.random() > 0.5 ? 'calc_work_isothermal' : 'concept_delta_u_isothermal';

    let questionLatex = "";
    let explanation = "";
    let correctAnswer = 0;
    const distractors: number[] = [];
    let unit = "J";

    const temp_K = temperature_C + ABS_ZERO;
    const work_val = moles_n * R_JOULES * temp_K * Math.log(expansion_ratio);

    if (scenarioType === 'calc_work_isothermal') {
        // Scenario: Calculate Work
        correctAnswer = parseFloat(work_val.toFixed(0));

        questionLatex = `$${moles_n}$ moles de un gas ideal se expanden isotérmicamente a $${temperature_C}^\\circ\\text{C}$. El volumen aumenta de $${vol_initial_L}$ L a un volumen final $V_f$ que es $${expansion_ratio}$ veces el inicial. Calcule el trabajo ($W$).`;

        explanation = `
1. **Temperatura Kelvin**: $T = ${temperature_C} + 273.15 = ${temp_K.toFixed(2)} \\text{ K}$.
2. **Fórmula de Trabajo Isotérmico**: Para un gas ideal, $W = nRT \\ln\\left(\\frac{V_f}{V_i}\\right)$.
3. **Relación de volumen**: Se nos indica que $\\frac{V_f}{V_i} = ${expansion_ratio}$.
4. **Cálculo**:
   $$W = (${moles_n})(8.314)(${temp_K.toFixed(2)}) \\ln(${expansion_ratio})$$
5. **Resultado**: $W = \\mathbf{${correctAnswer.toLocaleString()} \\text{ J}}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat((moles_n * R_JOULES * temp_K * expansion_ratio).toFixed(0))); // Forgot ln
        distractors.push(parseFloat((moles_n * R_JOULES * temp_K * (Math.log(expansion_ratio) / Math.LN10)).toFixed(0))); // Used Log10
        distractors.push(parseFloat((moles_n * R_JOULES * temperature_C * Math.log(expansion_ratio)).toFixed(0))); // Used Celsius
    } else {
        // Scenario: Conceptual Delta U
        correctAnswer = 0;
        const displayWork = Math.round(work_val);

        questionLatex = `En una expansión isotérmica, un gas realiza $${displayWork.toLocaleString()}$ J de trabajo. ¿Cuál es el cambio en su energía interna ($\\Delta U$)?`;

        explanation = `
1. **Definición**: Un proceso isotérmico implica que la temperatura permanece constante ($\\Delta T = 0$).
2. **Energía Interna**: Para un gas ideal, la energía interna depende exclusivamente de la temperatura ($U \\propto T$).
3. **Conclusión**: Si la temperatura no cambia, la energía interna tampoco cambia, independientemente del trabajo realizado o el calor transferido.
4. **Resultado**: $\\Delta U = \\mathbf{0 \\text{ J}}$.
    `.trim();

        // Distractors
        distractors.push(displayWork); // Confused with W
        distractors.push(-displayWork); // Confused with sign
        distractors.push(parseFloat((moles_n * R_JOULES * temp_K).toFixed(0))); // nRT
    }

    // 5. Finalize Options
    const optionsSet = new Set<number>([correctAnswer]);
    distractors.forEach(d => {
        if (d !== correctAnswer && Math.abs(d) > 0.1) optionsSet.add(d);
    });

    while (optionsSet.size < 4) {
        const factor = 0.4 + Math.random() * 1.2;
        const filler = parseFloat((correctAnswer === 0 ? (500 + Math.random() * 1500) : (correctAnswer * factor)).toFixed(0));
        if (filler !== correctAnswer && filler > 0) optionsSet.add(filler);
    }

    const options = Array.from(optionsSet).map(val => ({
        id: Math.random().toString(36).substr(2, 9),
        value: val,
        label: `${val.toLocaleString()} J`,
        isCorrect: val === correctAnswer
    })).sort(() => Math.random() - 0.5);

    return {
        id: `q_isot_${Math.random().toString(36).substr(2, 9)}`,
        topicId: "termo_isothermal_process",
        questionLatex,
        options,
        explanation,
        difficulty: "Hard"
    };
};
