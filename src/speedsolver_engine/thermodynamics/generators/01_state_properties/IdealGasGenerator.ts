/**
 * SpeedSolver Engine: Ideal Gas Law Generator
 * Topic: Ecuación de Gas Ideal (PV=nRT)
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
 * Generates a question about the Ideal Gas Law (PV=nRT)
 */
export const generateIdealGasQuestion = (): GeneratedQuestion => {
    // 1. Configuration & Constants
    const R = 0.08206;
    const ABS_ZERO = 273.15;

    // 2. Randomize Variables
    const pressure_atm = parseFloat((Math.random() * (5.0 - 0.5) + 0.5).toFixed(2));
    const volume_L = parseFloat((Math.random() * (20.0 - 2.0) + 2.0).toFixed(1));
    const temperature_C = Math.floor(Math.random() * (150 - 20 + 1) + 20);
    const moles_n = parseFloat((Math.random() * (3.0 - 0.5) + 0.5).toFixed(2));

    // 3. Select Special Variable (Gas Context)
    const gas_context_options = [
        { label: "Argón (Gas Ideal)", symbol: "Ar" },
        { label: "Helio (Gas Ideal)", symbol: "He" },
        { label: "Neón (Gas Ideal)", symbol: "Ne" },
        { label: "Gas Desconocido", symbol: "X" }
    ];
    const selectedGas = gas_context_options[Math.floor(Math.random() * gas_context_options.length)];

    // 4. Pick Scenario
    const scenarioType = Math.random() > 0.5 ? 'solve_pressure' : 'solve_moles';

    let questionLatex = "";
    let explanation = "";
    let correctAnswer = 0;
    const distractors: number[] = [];
    let unit = "";
    let decimals = 2;

    const temp_K = temperature_C + ABS_ZERO;

    if (scenarioType === 'solve_pressure') {
        // Scenario: Solve for Pressure
        unit = "atm";
        decimals = 2;
        correctAnswer = (moles_n * R * temp_K) / volume_L;
        correctAnswer = parseFloat(correctAnswer.toFixed(decimals));

        questionLatex = `Un contenedor rígido de $${volume_L}$ L contiene $${moles_n}$ moles de **${selectedGas.label}** a una temperatura de $${temperature_C}^\\circ\\text{C}$. Calcule la presión que ejerce el gas.`;

        explanation = `
1. **Convertir Temperatura**: $T = ${temperature_C} + 273.15 = ${temp_K.toFixed(2)} \\text{ K}$.
2. **Ecuación Gas Ideal**: Despejamos $P$ de $PV=nRT$:
   $$P = \\frac{nRT}{V}$$
3. **Sustitución**:
   $$P = \\frac{(${moles_n})(0.08206)(${temp_K.toFixed(2)})}{${volume_L}}$$
4. **Resultado**: $P = ${correctAnswer} \\text{ atm}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat(((moles_n * R * temperature_C) / volume_L).toFixed(decimals))); // Celsius error
        distractors.push(parseFloat((volume_L / (moles_n * R * temp_K)).toFixed(decimals))); // Inverted algebra
        distractors.push(parseFloat(((moles_n * 8.314 * temp_K) / volume_L).toFixed(decimals))); // Wrong R (Joules)
    } else {
        // Scenario: Solve for Moles
        unit = "mol";
        decimals = 2;
        correctAnswer = (pressure_atm * volume_L) / (R * temp_K);
        correctAnswer = parseFloat(correctAnswer.toFixed(decimals));

        questionLatex = `¿Cuántos moles de **${selectedGas.label}** son necesarios para llenar un tanque de $${volume_L}$ L a una presión de $${pressure_atm}$ atm y $${temperature_C}^\\circ\\text{C}$?`;

        explanation = `
1. **Temperatura Kelvin**: $T = ${temperature_C} + 273.15 = ${temp_K.toFixed(2)} \\text{ K}$.
2. **Despejar n**: De $PV=nRT$, despejamos $n$:
   $$n = \\frac{PV}{RT}$$
3. **Sustitución**:
   $$n = \\frac{(${pressure_atm})(${volume_L})}{(0.08206)(${temp_K.toFixed(2)})}$$
4. **Resultado**: $n = ${correctAnswer} \\text{ mol}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat(((pressure_atm * volume_L) / (R * temperature_C)).toFixed(decimals))); // No conversion (Celsius)
        distractors.push(parseFloat((pressure_atm * volume_L * R * temp_K).toFixed(decimals))); // Multiplication error
        distractors.push(parseFloat((correctAnswer * 1.5).toFixed(decimals))); // Random skew
    }

    // 5. Finalize Options
    const optionsSet = new Set<number>([correctAnswer]);
    distractors.forEach(d => {
        if (d !== correctAnswer && d > 0) optionsSet.add(d);
    });

    while (optionsSet.size < 4) {
        const factor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
        const filler = parseFloat((correctAnswer * factor).toFixed(decimals));
        if (filler !== correctAnswer && filler > 0) optionsSet.add(filler);
    }

    const options = Array.from(optionsSet).map(val => ({
        id: Math.random().toString(36).substr(2, 9),
        value: val,
        label: `${val} ${unit}`,
        isCorrect: val === correctAnswer
    })).sort(() => Math.random() - 0.5);

    return {
        id: `q_ideal_${Math.random().toString(36).substr(2, 9)}`,
        topicId: "termo_properties_ideal_gas",
        questionLatex,
        options,
        explanation,
        difficulty: "Easy"
    };
};
