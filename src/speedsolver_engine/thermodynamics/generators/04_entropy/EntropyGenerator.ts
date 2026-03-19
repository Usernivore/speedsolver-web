// Path: src/speedsolver_engine/thermodynamics/generators/04_entropy/EntropyGenerator.ts

/**
 * SpeedSolver Engine: Entropy and 2nd Law Generator
 * Topic: Entropía y 2da Ley
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
 * Generates a question about Entropy and the 2nd Law
 */
export const generateEntropyQuestion = (lang: 'es' | 'en' = 'es'): GeneratedQuestion => {
    const isEn = lang === 'en';
    // 1. Configuration & Constants
    const R_JOULES = 8.314;
    const ABS_ZERO = 273.15;

    // 2. Randomize Variables
    const moles_n = parseFloat((Math.random() * (3.0 - 0.5) + 0.5).toFixed(2));
    const temp_initial_C = Math.floor(Math.random() * (100 - 25 + 1) + 25);
    const temp_final_C = Math.floor(Math.random() * (300 - 150 + 1) + 150);
    const vol_initial_L = parseFloat((Math.random() * (5.0 - 2.0) + 2.0).toFixed(1));
    const vol_final_L = parseFloat((Math.random() * (15.0 - 6.0) + 6.0).toFixed(1));
    const heat_joules_input = Math.floor(Math.random() * (5000 - 1000 + 1) + 1000);

    // 3. Select Special Variable (Process Type)
    const process_options = [
        { label: isEn ? "Isothermal Expansion" : "Expansión Isotérmica", mode: "isothermal" },
        { label: isEn ? "Isochoric Heating" : "Calentamiento Isocórico", mode: "isochoric", cv_factor: 1.5 },
        { label: isEn ? "Isobaric Heating" : "Calentamiento Isobárico", mode: "isobaric", cp_factor: 2.5 }
    ];

    // 4. Pick Scenario
    const scenarioType = Math.random() > 0.5 ? 'calc_entropy_change_gas' : 'calc_entropy_reservoir';

    let questionLatex = "";
    let explanation = "";
    let correctAnswer = 0;
    const distractors: number[] = [];
    let unit = "J/K";
    let decimals = 2;

    if (scenarioType === 'calc_entropy_change_gas') {
        // Scenario: Entropy Change for a Gas
        const selectedProcess = process_options[Math.floor(Math.random() * process_options.length)];
        const ti_k = temp_initial_C + ABS_ZERO;
        const tf_k = temp_final_C + ABS_ZERO;

        if (selectedProcess.mode === 'isothermal') {
            correctAnswer = moles_n * R_JOULES * Math.log(vol_final_L / vol_initial_L);
        } else if (selectedProcess.mode === 'isochoric') {
            correctAnswer = moles_n * (1.5 * R_JOULES) * Math.log(tf_k / ti_k);
        } else {
            correctAnswer = moles_n * (2.5 * R_JOULES) * Math.log(tf_k / ti_k);
        }

        correctAnswer = parseFloat(correctAnswer.toFixed(decimals));

        questionLatex = isEn
            ? `Calculate the entropy change ($\\Delta S$) of $${moles_n}$ moles of a monatomic ideal gas during an **${selectedProcess.label}** process. `
            : `Calcule el cambio de entropía ($\\Delta S$) de $${moles_n}$ moles de gas ideal monoatómico durante un proceso de **${selectedProcess.label}**. `;

        if (selectedProcess.mode === 'isothermal') {
            questionLatex += isEn
                ? `The gas expands from $${vol_initial_L}$ L to $${vol_final_L}$ L at a constant temperature.`
                : `El gas se expande desde $${vol_initial_L}$ L hasta $${vol_final_L}$ L a una temperatura constante.`;
        } else {
            questionLatex += isEn
                ? `The temperature increases from $${temp_initial_C}^\\circ\\text{C}$ to $${temp_final_C}^\\circ\\text{C}$.`
                : `La temperatura aumenta desde $${temp_initial_C}^\\circ\\text{C}$ hasta $${temp_final_C}^\\circ\\text{C}$.`;
        }

        explanation = isEn ? `
1. **Identify the process**: The process is **${selectedProcess.label}**.
2. **Corresponding formula**:
   ${selectedProcess.mode === 'isothermal' ? '- Isothermal: $\\Delta S = nR \\ln(V_f/V_i)$' : ''}
   ${selectedProcess.mode === 'isochoric' ? '- Isochoric: $\\Delta S = nC_v \\ln(T_f/T_i)$' : ''}
   ${selectedProcess.mode === 'isobaric' ? '- Isobaric: $\\Delta S = nC_p \\ln(T_f/T_i)$' : ''}
3. **Calculation**:
   ${selectedProcess.mode === 'isothermal'
                ? `$$\\Delta S = (${moles_n})(8.314) \\ln\\left(\\frac{${vol_final_L}}{${vol_initial_L}}\\right)$$`
                : `$$\\Delta S = (${moles_n})(${selectedProcess.mode === 'isochoric' ? '1.5' : '2.5'} \\times 8.314) \\ln\\left(\\frac{${tf_k.toFixed(2)}}{${ti_k.toFixed(2)}}\\right)$$`
            }
4. **Result**: $\\Delta S = \\mathbf{${correctAnswer} \\text{ J/K}}$.
    `.trim() : `
1. **Identificar el proceso**: El proceso es **${selectedProcess.label}**.
2. **Fórmula correspondiente**:
   ${selectedProcess.mode === 'isothermal' ? '- Isotérmico: $\\Delta S = nR \\ln(V_f/V_i)$' : ''}
   ${selectedProcess.mode === 'isochoric' ? '- Isocórico: $\\Delta S = nC_v \\ln(T_f/T_i)$' : ''}
   ${selectedProcess.mode === 'isobaric' ? '- Isobárico: $\\Delta S = nC_p \\ln(T_f/T_i)$' : ''}
3. **Cálculo**:
   ${selectedProcess.mode === 'isothermal'
                ? `$$\\Delta S = (${moles_n})(8.314) \\ln\\left(\\frac{${vol_final_L}}{${vol_initial_L}}\\right)$$`
                : `$$\\Delta S = (${moles_n})(${selectedProcess.mode === 'isocoric' ? '1.5' : '2.5'} \\times 8.314) \\ln\\left(\\frac{${tf_k.toFixed(2)}}{${ti_k.toFixed(2)}}\\right)$$`
            }
4. **Resultado**: $\\Delta S = \\mathbf{${correctAnswer} \\text{ J/K}}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat((correctAnswer * 2.303).toFixed(decimals))); // Used Log10 (approx factor)
        distractors.push(parseFloat((moles_n * R_JOULES).toFixed(decimals))); // Omitted log term
        distractors.push(parseFloat((correctAnswer * -1).toFixed(decimals))); // Wrong sign
    } else {
        // Scenario: Entropy Change for a Reservoir
        const t_source_k = temp_final_C + ABS_ZERO;
        correctAnswer = parseFloat((-1 * (heat_joules_input / t_source_k)).toFixed(decimals));

        questionLatex = isEn
            ? `A thermal source at $${temp_final_C}^\\circ\\text{C}$ transfers $${heat_joules_input.toLocaleString()}$ J of heat to a system. Calculate the entropy change of the **source**.`
            : `Una fuente térmica a $${temp_final_C}^\\circ\\text{C}$ transfiere $${heat_joules_input.toLocaleString()}$ J de calor a un sistema. Calcule el cambio de entropía de la **fuente**.`;

        explanation = isEn ? `
1. **Identify heat flow**: The source gives heat to the system, therefore $Q_{\\text{source}}$ is negative ($Q = -${heat_joules_input} \\text{ J}$).
2. **Convert temperature**: $T = ${temp_final_C} + 273.15 = ${t_source_k.toFixed(2)} \\text{ K}$.
3. **Entropy formula**: For a thermal source (constant temperature), $\\Delta S = \\frac{Q}{T}$.
4. **Calculation**:
   $$\\Delta S = \\frac{-${heat_joules_input}}{${t_source_k.toFixed(2)}}$$
5. **Result**: $\\Delta S = \\mathbf{${correctAnswer} \\text{ J/K}}$. (The negative value indicates that the entropy of the source decreases).
    `.trim() : `
1. **Identificar flujo de calor**: La fuente cede calor al sistema, por lo tanto, $Q_{\\text{fuente}}$ es negativo ($Q = -${heat_joules_input} \\text{ J}$).
2. **Convertir temperatura**: $T = ${temp_final_C} + 273.15 = ${t_source_k.toFixed(2)} \\text{ K}$.
3. **Fórmula de entropía**: Para una fuente térmica (temperatura constante), $\\Delta S = \\frac{Q}{T}$.
4. **Cálculo**:
   $$\\Delta S = \\frac{-${heat_joules_input}}{${t_source_k.toFixed(2)}}$$
5. **Resultado**: $\\Delta S = \\mathbf{${correctAnswer} \\text{ J/K}}$. (El valor negativo indica que la entropía de la fuente disminuye).
    `.trim();

        // Distractors
        distractors.push(parseFloat((heat_joules_input / t_source_k).toFixed(decimals))); // Positive sign
        distractors.push(parseFloat((-1 * (heat_joules_input / temp_final_C)).toFixed(decimals))); // Used Celsius
        distractors.push(parseFloat((-1 * (heat_joules_input / (temp_final_C + 273))).toFixed(decimals))); // Rounding error in T
    }

    // 5. Finalize Options
    const optionsSet = new Set<number>([correctAnswer]);
    distractors.forEach(d => {
        if (d !== correctAnswer) optionsSet.add(d);
    });

    while (optionsSet.size < 4) {
        const factor = 0.5 + Math.random();
        const filler = parseFloat((correctAnswer === 0 ? (1 + Math.random() * 5) : (correctAnswer * factor)).toFixed(decimals));
        if (filler !== correctAnswer) optionsSet.add(filler);
    }

    const options = Array.from(optionsSet).map(val => ({
        id: Math.random().toString(36).substr(2, 9),
        value: val,
        label: `${val.toLocaleString()} J/K`,
        isCorrect: val === correctAnswer
    })).sort(() => Math.random() - 0.5);

    return {
        id: `q_entr_${Math.random().toString(36).substr(2, 9)}`,
        topicId: "termo_entropy",
        questionLatex,
        options,
        explanation,
        difficulty: "Hard"
    };
};
