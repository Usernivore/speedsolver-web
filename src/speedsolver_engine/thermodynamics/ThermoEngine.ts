// Path: src/speedsolver_engine/thermodynamics/ThermoEngine.ts

import { generateIdealGasQuestion } from './generators/01_state_properties/IdealGasGenerator';
import { generateEnergyQuestion } from './generators/01_state_properties/InternalEnergyGenerator';
import { generateDensityQuestion } from './generators/01_state_properties/DensityGenerator';

import { generateIsobaricQuestion } from './generators/02_process_1st_law/IsobaricGenerator';
import { generateIsochoricQuestion } from './generators/02_process_1st_law/IsochoricGenerator';
import { generateIsothermalQuestion } from './generators/02_process_1st_law/IsothermalGenerator';
import { generateAdiabaticQuestion } from './generators/02_process_1st_law/AdiabaticGenerator';

import { generateCarnotQuestion } from './generators/03_cycles_engines/CarnotGenerator';
import { generateMachineQuestion } from './generators/03_cycles_engines/ThermalMachineGenerator';

import { generateEntropyQuestion } from './generators/04_entropy/EntropyGenerator';

/**
 * Common interface for all generated questions
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

type GeneratorFunction = (lang: 'es' | 'en') => GeneratedQuestion;

/**
 * TOPIC_REGISTRY: Maps UI Topic IDs to their respective generator functions.
 */
const TOPIC_REGISTRY: Record<string, GeneratorFunction[]> = {
    "properties": [
        generateIdealGasQuestion,
        generateEnergyQuestion,
        generateDensityQuestion
    ],
    "processes": [
        generateIsobaricQuestion,
        generateIsochoricQuestion,
        generateIsothermalQuestion,
        generateAdiabaticQuestion
    ],
    "cycles": [
        generateCarnotQuestion,
        generateMachineQuestion
    ],
    "entropy": [
        generateEntropyQuestion
    ]
};

/**
 * generateSession: Core logic to create a randomized set of questions based on user selection.
 * 
 * @param selectedTopicIds - Array of topic keys (e.g., ["properties", "cycles"])
 * @param count - Total number of questions to generate
 * @param lang - Target language ('es' | 'en')
 * @returns Array of GeneratedQuestion objects
 */
export const generateSession = (selectedTopicIds: string[], count: number, lang: 'es' | 'en' = 'es'): GeneratedQuestion[] => {
    let pool: GeneratorFunction[] = [];

    // 1. Determine which topics to include
    const activeIds = selectedTopicIds.length > 0 ? selectedTopicIds : Object.keys(TOPIC_REGISTRY);

    // 2. Build the generator pool
    activeIds.forEach(id => {
        const generators = TOPIC_REGISTRY[id];
        if (generators) {
            pool = [...pool, ...generators];
        }
    });

    // 3. Safety check: If pool is empty (invalid IDs), use all available
    if (pool.length === 0) {
        pool = Object.values(TOPIC_REGISTRY).flat();
    }

    // 4. Generate the questions
    const sessionQuestions: GeneratedQuestion[] = [];
    for (let i = 0; i < count; i++) {
        // Pick a random generator from the pool
        const randomGenerator = pool[Math.floor(Math.random() * pool.length)];
        sessionQuestions.push(randomGenerator(lang));
    }

    return sessionQuestions;
};
