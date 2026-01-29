/**
 * SpeedSolver Engine: Density and Molar Mass Generator
 * Topic: Densidad y Masa Molar (Gases Ideales)
 * Version: 3.0 (Architecture Fix)
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
 * Generates a question about Gas Density or Molar Mass
 */
export const generateDensityQuestion = (): GeneratedQuestion => {
    // 1. Configuration & Constants
    const R = 0.08206;
    const ABS_ZERO = 273.15;

    // 2. Randomize Variables
    const pressure_atm = parseFloat((Math.random() * (3.0 - 0.8) + 0.8).toFixed(2));
    const temperature_C = Math.floor(Math.random() * (150 - 20 + 1) + 20);
    const mass_grams = parseFloat((Math.random() * (100 - 10) + 10).toFixed(1));
    const volume_L = parseFloat((Math.random() * (50 - 5) + 5).toFixed(1));

    // 3. Select Special Variable (Gas Data)
    const gas_data_options = [
        { label: "Helio (He)", mm: 4.0 },
        { label: "Metano (CH4)", mm: 16.0 },
        { label: "Nitrógeno (N2)", mm: 28.0 },
        { label: "Oxígeno (O2)", mm: 32.0 },
        { label: "Dióxido de Carbono (CO2)", mm: 44.0 }
    ];
    const selectedGas = gas_data_options[Math.floor(Math.random() * gas_data_options.length)];

    // 4. Pick Scenario
    const scenarioType = Math.random() > 0.5 ? 'calc_density' : 'identify_gas_by_mm';

    let questionLatex = "";
    let explanation = "";
    let correctAnswer = 0;
    const distractors: number[] = [];
    let unit = "";
    let decimals = 2;

    const temp_K = temperature_C + ABS_ZERO;

    if (scenarioType === 'calc_density') {
        // Scenario: Calculate Density
        unit = "g/L";
        decimals = 3;
        correctAnswer = (pressure_atm * selectedGas.mm) / (R * temp_K);
        correctAnswer = parseFloat(correctAnswer.toFixed(decimals));

        questionLatex = `Calcule la densidad (en g/L) del **${selectedGas.label}** a una presión de $${pressure_atm}$ atm y una temperatura de $${temperature_C}^\\circ\\text{C}$.`;

        explanation = `
1. **Identificar datos**: Gas ${selectedGas.label} ($MM = ${selectedGas.mm} \\text{ g/mol}$).
2. **Temperatura Kelvin**: $T = ${temperature_C} + 273.15 = ${temp_K.toFixed(2)} \\text{ K}$.
3. **Fórmula derivada ($PM=\\rho RT$)**:
   $$\\rho = \\frac{P \\cdot MM}{R \\cdot T}$$
4. **Sustitución**:
   $$\\rho = \\frac{(${pressure_atm})(${selectedGas.mm})}{(0.08206)(${temp_K.toFixed(2)})}$$
5. **Resultado**: $\\rho = ${correctAnswer} \\text{ g/L}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat(((R * temp_K) / (pressure_atm * selectedGas.mm)).toFixed(decimals))); // Inverted
        distractors.push(parseFloat(((pressure_atm * selectedGas.mm) / (R * temperature_C)).toFixed(decimals))); // Celsius error
        distractors.push(parseFloat(((pressure_atm * 28.0) / (R * temp_K)).toFixed(decimals))); // Wrong gas (N2)
    } else {
        // Scenario: Identify Gas / Calculate Molar Mass
        unit = "g/mol";
        decimals = 1;
        correctAnswer = (mass_grams * R * temp_K) / (pressure_atm * volume_L);
        correctAnswer = parseFloat(correctAnswer.toFixed(decimals));

        questionLatex = `Una muestra de $${mass_grams}$ g de un gas desconocido ocupa $${volume_L}$ L a $${pressure_atm}$ atm y $${temperature_C}^\\circ\\text{C}$. Calcule su Masa Molar para identificarlo.`;

        explanation = `
1. **Temperatura Kelvin**: $T = ${temperature_C} + 273.15 = ${temp_K.toFixed(2)} \\text{ K}$.
2. **Ecuación base**: $PV = \\frac{m}{MM}RT \\rightarrow MM = \\frac{mRT}{PV}$.
3. **Sustitución**:
   $$MM = \\frac{(${mass_grams})(0.08206)(${temp_K.toFixed(2)})}{(${pressure_atm})(${volume_L})}$$
4. **Resultado**: $MM = ${correctAnswer} \\text{ g/mol}$.
    `.trim();

        // Distractors
        distractors.push(parseFloat(((R * temp_K) / (pressure_atm * volume_L)).toFixed(decimals))); // No mass
        distractors.push(parseFloat(((pressure_atm * volume_L * mass_grams) / (R * temp_K)).toFixed(decimals))); // Wrong algebra
        distractors.push(parseFloat(((mass_grams * R * temperature_C) / (pressure_atm * volume_L)).toFixed(decimals))); // Celsius error
    }

    // 5. Finalize Options
    const optionsSet = new Set<number>([correctAnswer]);
    distractors.forEach(d => {
        if (d !== correctAnswer && d > 0) optionsSet.add(d);
    });

    while (optionsSet.size < 4) {
        const factor = 0.5 + Math.random();
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
        id: `q_dens_${Math.random().toString(36).substr(2, 9)}`,
        topicId: "termo_gas_density",
        questionLatex,
        options,
        explanation,
        difficulty: "Medium"
    };
};
