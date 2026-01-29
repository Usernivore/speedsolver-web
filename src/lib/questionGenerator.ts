/**
 * SpeedSolver Core Procedural Generation Engine
 * Specialized in Physics/Thermodynamics problem generation.
 */

export interface VariableRange {
    min: number;
    max: number;
    decimals: number;
    unit: string;
}

export interface DistractorLogic {
    type: string;
    formula: string;
    note: string;
    factor?: number;
}

export interface Scenario {
    id: string;
    template: string;
    target_variable: string;
    variables_special?: Record<string, Array<Record<string, any>>>;
    solver_logic: Record<string, string>;
    distractor_logic: DistractorLogic[];
    explanation_template: string;
}

export interface TopicSchema {
    meta: {
        topic_id: string;
        topic_name: string;
        difficulty: "Easy" | "Medium" | "Hard";
        version: string;
    };
    constants: Record<string, number>;
    variable_ranges: Record<string, VariableRange>;
    scenarios: Scenario[];
}

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
 * Generates a random number within a range with specified decimals
 */
function getRandomValue(range: VariableRange): number {
    const value = Math.random() * (range.max - range.min) + range.min;
    return parseFloat(value.toFixed(range.decimals));
}

/**
 * Securely evaluates a mathematical expression string
 */
function evaluateFormula(formula: string, context: Record<string, any>): number {
    // Sort keys by length descending to avoid partial matches
    const sortedKeys = Object.keys(context).sort((a, b) => b.length - a.length);

    let processedFormula = formula;
    for (const key of sortedKeys) {
        const val = context[key];
        if (val !== undefined && (typeof val === 'number' || typeof val === 'string')) {
            // Using split/join for robust replacement of variables (including those with dots)
            // Sorting by length ensures that longer variable names are replaced first,
            // preventing partial matches (e.g., 'val_temp' being partially replaced by 'val_t').
            processedFormula = processedFormula.split(key).join(val.toString());
        }
    }

    try {
        // Using Function constructor to evaluate the expression
        return new Function(`return (${processedFormula})`)();
    } catch (error) {
        console.error(`Error evaluating formula: ${formula}`);
        console.error(`Processed formula: ${processedFormula}`);
        return 0;
    }
}

/**
 * Formats a template string by replacing ${var} or {var} with values
 */
function formatTemplate(template: string, values: Record<string, any>): string {
    return template.replace(/\$?\{([\w.]+)\}/g, (_, key) => {
        return values[key] !== undefined ? values[key].toString() : `{${key}}`;
    });
}

/**
 * Main Generator Function
 */
export function generateQuestion(config: TopicSchema): GeneratedQuestion {
    // 1. Pick a random scenario
    const scenario = config.scenarios[Math.floor(Math.random() * config.scenarios.length)];

    // 2. Setup Contexts
    const variables: Record<string, any> = {};
    const displayVariables: Record<string, string> = {};

    // Handle standard variable ranges
    for (const [name, range] of Object.entries(config.variable_ranges)) {
        const val = getRandomValue(range);
        variables[`val_${name}`] = val;
        displayVariables[name] = val.toString();
    }

    // Handle special variables (e.g. gas types)
    if (scenario.variables_special) {
        for (const [varName, options] of Object.entries(scenario.variables_special)) {
            const picked = options[Math.floor(Math.random() * options.length)];
            // Inject properties into context
            for (const [prop, value] of Object.entries(picked)) {
                // Support multiple naming conventions for flexibility in JSON
                variables[`val_${varName}.${prop}`] = value;
                variables[`val_${varName}_${prop}`] = value;
                displayVariables[`${varName}_${prop}`] = value.toString();
                displayVariables[`val_${varName}.${prop}`] = value.toString();
                displayVariables[`val_${varName}_${prop}`] = value.toString();
            }
        }
    }

    // 3. Evaluate solver logic steps
    const context: Record<string, any> = { ...variables, ...config.constants };
    const solverSteps: Record<string, number> = {};

    const stepKeys = Object.keys(scenario.solver_logic).sort();
    let correctAnswer = 0;

    for (const stepKey of stepKeys) {
        const formula = scenario.solver_logic[stepKey];
        const result = evaluateFormula(formula, { ...context, ...solverSteps });
        solverSteps[stepKey] = result;
        context[stepKey] = result;
        correctAnswer = result;
    }

    const targetRange = config.variable_ranges[scenario.target_variable];
    const formattedCorrectAnswer = parseFloat(correctAnswer.toFixed(targetRange?.decimals || 2));

    // 4. Generate distractors
    const options = [
        {
            id: Math.random().toString(36).substr(2, 9),
            value: formattedCorrectAnswer,
            label: `${formattedCorrectAnswer} ${targetRange?.unit || "J"}`,
            isCorrect: true
        }
    ];

    for (const distLogic of scenario.distractor_logic) {
        let distValue = 0;

        if (distLogic.type === 'random_deviation' && distLogic.factor) {
            distValue = correctAnswer * distLogic.factor;
        } else {
            distValue = evaluateFormula(distLogic.formula, context);
        }

        const formattedDistValue = parseFloat(distValue.toFixed(targetRange?.decimals || 2));

        if (!options.find(opt => opt.value === formattedDistValue)) {
            options.push({
                id: Math.random().toString(36).substr(2, 9),
                value: formattedDistValue,
                label: `${formattedDistValue} ${targetRange?.unit || "J"}`,
                isCorrect: false
            });
        }
    }

    // Fill up to 4 options
    while (options.length < 4) {
        const randomFactor = 0.7 + Math.random() * 0.6;
        const fillerValue = parseFloat((formattedCorrectAnswer * randomFactor).toFixed(targetRange?.decimals || 2));
        if (!options.find(opt => opt.value === fillerValue)) {
            options.push({
                id: Math.random().toString(36).substr(2, 9),
                value: fillerValue,
                label: `${fillerValue} ${targetRange?.unit || "J"}`,
                isCorrect: false
            });
        }
    }

    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    // 5. Final Formatting
    const templateContext = {
        ...displayVariables,
        ...Object.entries(solverSteps).reduce((acc, [k, v]) => ({ ...acc, [k]: v.toFixed(targetRange?.decimals || 2) }), {}),
        correct_answer: formattedCorrectAnswer
    };

    const questionLatex = formatTemplate(scenario.template, templateContext);
    const explanation = formatTemplate(scenario.explanation_template, templateContext);

    return {
        id: `q_${Math.random().toString(36).substr(2, 9)}`,
        topicId: config.meta.topic_id,
        questionLatex,
        options: shuffledOptions,
        explanation,
        difficulty: config.meta.difficulty
    };
}
