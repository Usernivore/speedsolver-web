export interface Question {
    id: number
    text: string
    options: string[]
    correctAnswer: number
    explanation?: string
    topic: string
    diagramId?: string
    imageUrl?: string
}

export const dummyQuestions: Question[] = [
    {
        id: 1,
        text: "Calculate the thermal efficiency of a Carnot engine operating between $T_H = 600 K$ and $T_L = 300 K$ using the formula: $$\\eta = 1 - \\frac{T_L}{T_H}$$",
        options: ["0.50", "0.35", "0.66", "0.25"],
        correctAnswer: 0,
        explanation: "La eficiencia de Carnot se calcula como $1 - T_L/T_H$. En este caso, $1 - 300/600 = 1 - 0.5 = 0.5$.",
        topic: "Ciclos de Potencia",
        diagramId: "DIAG. REF-042",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDskdeRQs7yBq4IUcXlzQ1pIUHYmlLS2EgeGETJfONJkwWXX3YSgF5JDRwARKurWLdFXOKaDG-yC5hPGdWjftg-jGamNy9Czkm_M_g0-_CPPKCjf6x05I43beOkxdk_wITSU8KzqU5uutHb_aMijH9dKrUCNMaeamYdvbNxghQCBjfnGY9drlsWEPSIz3_C-be982j6XWn-e8QeBGOHY5n03OK40R1hkk9AAlpz1dSzigE8eWCl2QubWUMqnDrbPmFDoIFA2kGavGAH"
    },
    {
        id: 2,
        text: "¿Cuál es el cambio de entropía (ΔS) para un proceso adiabático reversible?",
        options: ["ΔS > 0", "ΔS < 0", "ΔS = 0", "Depende de T"],
        correctAnswer: 2,
        explanation: "Un proceso adiabático reversible es, por definición, isentrópico, lo que significa que el cambio de entropía es cero.",
        topic: "Entropía"
    },
    {
        id: 3,
        text: "En un sistema cerrado, si Q = 100 kJ y W = 40 kJ (realizado por el sistema), ¿cuál es ΔU?",
        options: ["140 kJ", "60 kJ", "-60 kJ", "100 kJ"],
        correctAnswer: 1,
        explanation: "Según la primera ley para sistemas cerrados: $\\Delta U = Q - W$. Entonces, $\\Delta U = 100\\text{ kJ} - 40\\text{ kJ} = 60\\text{ kJ}$.",
        topic: "1ra Ley (Cerrados)"
    },
    {
        id: 4,
        text: "Para un gas ideal en un proceso isotérmico, el cambio en la energía interna es:",
        options: ["Máximo", "Mínimo", "Cero", "Variable"],
        correctAnswer: 2,
        explanation: "Para un gas ideal, la energía interna depende solo de la temperatura. Si el proceso es isotérmico ($\Delta T = 0$), entonces $\Delta U = 0$.",
        topic: "Gas Ideal"
    },
    {
        id: 5,
        text: "La eficiencia de una máquina de Carnot depende únicamente de:",
        options: ["El fluido de trabajo", "Las temperaturas de los depósitos", "La presión del sistema", "El volumen del cilindro"],
        correctAnswer: 1,
        explanation: "La eficiencia de Carnot es $\\eta = 1 - T_L/T_H$, lo que demuestra que solo depende de las temperaturas absolutas de los depósitos térmicos.",
        topic: "Segunda Ley"
    }
]
