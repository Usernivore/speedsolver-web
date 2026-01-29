// Path: src/speedsolver_engine/thermodynamics/generators/03_cycles_engines/ThermalMachineGenerator.ts

/**
 * SpeedSolver Engine: Thermal Machines and Refrigerators Generator
 * Topic: Máquinas Térmicas y Refrigeradores (1ra y 2da Ley)
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
 * Generates a question about Thermal Engines or Refrigerators
 */
export const generateMachineQuestion = (): GeneratedQuestion => {
    // 1. Configuration & Constants

    // 2. Randomize Variables
    const heat_high_J = Math.floor(Math.random() * (10000 - 2000 + 1) + 2000);
    const efficiency_percent = parseFloat((Math.random() * (45 - 20) + 20).toFixed(1));
    const cop_value = parseFloat((Math.random() * (6.0 - 2.5) + 2.5).toFixed(1));

    // 3. Select Machine Type and Scenario
    const machine_options = [
        { label: "Motor a Gasolina", mode: "engine" },
        { label: "Planta de Vapor", mode: "engine" },
        { label: "Refrigerador Doméstico", mode: "fridge" },
        { label: "Aire Acondicionado", mode: "fridge" }
    ];

    // Filter options based on scenario to ensure consistency
    const scenarioType = Math.random() > 0.5 ? 'calc_engine_waste_heat' : 'calc_fridge_work';
    const filteredMachines = machine_options.filter(m =>
        scenarioType === 'calc_engine_waste_heat' ? m.mode === 'engine' : m.mode === 'fridge'
    );
    const selectedMachine = filteredMachines[Math.floor(Math.random() * filteredMachines.length)];

    let questionLatex = "";
    let explanation = "";
    let correctAnswer = 0;
    const distractors: number[] = [];
    let unit = "J";
    let decimals = 0;

    if (scenarioType === 'calc_engine_waste_heat') {
        // Scenario: Calculate Waste Heat (QL) for an Engine
        const eff_decimal = efficiency_percent / 100;
        const work_calc = heat_high_J * eff_decimal;
        correctAnswer = Math.round(heat_high_J - work_calc);

        questionLatex = `Un **${selectedMachine.label}** tiene una eficiencia térmica del $${efficiency_percent}\\%$. Si recibe $${heat_high_J.toLocaleString()}$ J de calor de la fuente caliente ($Q_H$), ¿cuánto calor ($Q_L$) desecha al ambiente?`;

        explanation = `
1. **Definición de Eficiencia**: $\\eta = \\frac{W}{Q_H} \\rightarrow W = \\eta \\cdot Q_H$.
2. **Calcular Trabajo**: $W = ${eff_decimal.toFixed(3)} \\times ${heat_high_J.toLocaleString()} = ${work_calc.toFixed(0)} \\text{ J}$.
3. **Balance de Energía** ($Q_H = W + Q_L$): El calor desechado es la diferencia entre el calor absorbido y el trabajo realizado: $Q_L = Q_H - W$.
4. **Sustitución**: $Q_L = ${heat_high_J.toLocaleString()} - ${work_calc.toFixed(0)} = \\mathbf{${correctAnswer.toLocaleString()} \\text{ J}}$.
    `.trim();

        // Distractors
        distractors.push(Math.round(heat_high_J * (1 + eff_decimal))); // Added efficiency
        distractors.push(Math.round(work_calc)); // Calculated W instead of QL
        distractors.push(Math.round(heat_high_J / eff_decimal)); // Divided by efficiency
    } else {
        // Scenario: Calculate Work (W) for a Refrigerator
        // Logic: COP = QL / W  => W = QL / COP
        // Note: In this scenario, heat_high_J is treated as QL (heat extracted)
        const heat_low_J = heat_high_J;
        correctAnswer = Math.round(heat_low_J / cop_value);

        questionLatex = `Un **${selectedMachine.label}** opera con un Coeficiente de Desempeño (COP) de $${cop_value}$. Si se requiere extraer $${heat_low_J.toLocaleString()}$ J de calor del interior ($Q_L$), ¿cuánto trabajo eléctrico ($W$) consume?`;

        explanation = `
1. **Definición de COP (Refrigeración)**: $COP = \\frac{Q_L}{W}$.
2. **Despejar Trabajo**: $W = \\frac{Q_L}{COP}$.
3. **Sustitución**: $W = \\frac{${heat_low_J.toLocaleString()}}{${cop_value}}$.
4. **Resultado**: $W = \\mathbf{${correctAnswer.toLocaleString()} \\text{ J}}$.
    `.trim();

        // Distractors
        distractors.push(Math.round(heat_low_J * cop_value)); // Multiplied by COP
        distractors.push(Math.round(heat_low_J + (heat_low_J / cop_value))); // Calculated QH = QL + W
        distractors.push(Math.round(heat_low_J - (heat_low_J / cop_value))); // Subtracted W
    }

    // 5. Finalize Options
    const optionsSet = new Set<number>([correctAnswer]);
    distractors.forEach(d => {
        if (d !== correctAnswer && d > 0) optionsSet.add(d);
    });

    while (optionsSet.size < 4) {
        const factor = 0.5 + Math.random();
        const filler = Math.round(correctAnswer * factor);
        if (filler !== correctAnswer && filler > 0) optionsSet.add(filler);
    }

    const options = Array.from(optionsSet).map(val => ({
        id: Math.random().toString(36).substr(2, 9),
        value: val,
        label: `${val.toLocaleString()} J`,
        isCorrect: val === correctAnswer
    })).sort(() => Math.random() - 0.5);

    return {
        id: `q_mach_${Math.random().toString(36).substr(2, 9)}`,
        topicId: "termo_thermal_machines",
        questionLatex,
        options,
        explanation,
        difficulty: "Medium"
    };
};
