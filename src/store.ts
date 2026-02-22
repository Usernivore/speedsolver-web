import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateSession, GeneratedQuestion } from './speedsolver_engine/thermodynamics/ThermoEngine'

export type View = 'setup' | 'quiz' | 'results' | 'dashboard' | 'profile' | 'tools' | 'rankine' | 'interpolator' | 'unit-converter'

export interface SessionResult {
    questionId: string
    topic: string
    isCorrect: boolean
    timeSpent: number
}

export interface SessionSummary {
    date: string
    score: number
    totalQuestions: number
    topicStats: { [topic: string]: { correct: number, total: number } }
    timeSpentSeconds: number
}

export interface UserProfile {
    name: string
    email: string
    institution: string
    avatarId: number
}

interface AppState {
    currentView: View
    setView: (view: View) => void

    // User Profile
    userProfile: UserProfile
    updateUserProfile: (profile: UserProfile) => void

    // Session State
    questions: GeneratedQuestion[]
    currentQuestionIndex: number
    score: number
    totalQuestions: number
    timeLimitSeconds: number | null
    timeRemaining: number | null
    answers: SessionResult[]
    history: SessionSummary[]
    streak: number
    totalSolved: number
    totalTimeSeconds: number
    lastActivityDate: string | null

    startSession: (total: number, timeLimit: number | null, topics: string[]) => void
    addResult: (result: SessionResult) => void
    nextQuestion: () => void
    finishSession: () => void
    resetSession: () => void
    updateTimeRemaining: (time: number | null) => void
    saveSessionToHistory: () => void
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            currentView: 'setup',
            setView: (view) => set({ currentView: view }),

            userProfile: {
                name: 'Ing. Ricardo Morales',
                email: 'r.morales@university.edu',
                institution: 'Instituto Tecnológico de Termodinámica',
                avatarId: 0
            },
            updateUserProfile: (profile) => set({ userProfile: profile }),

            questions: [],
            currentQuestionIndex: 0,
            score: 0,
            totalQuestions: 10,
            timeLimitSeconds: 2400,
            timeRemaining: null,
            answers: [],
            history: [],
            streak: 0,
            totalSolved: 0,
            totalTimeSeconds: 0,
            lastActivityDate: null,

            startSession: (total, timeLimit, topics) => {
                const generatedQuestions = generateSession(topics, total);
                set({
                    currentView: 'quiz',
                    questions: generatedQuestions,
                    currentQuestionIndex: 0,
                    totalQuestions: total,
                    timeLimitSeconds: timeLimit,
                    timeRemaining: timeLimit,
                    score: 0,
                    answers: []
                });
            },

            addResult: (result) => set((state) => ({
                answers: [...state.answers, result],
                score: result.isCorrect ? state.score + 1 : state.score
            })),

            nextQuestion: () => set((state) => ({
                currentQuestionIndex: state.currentQuestionIndex + 1
            })),

            finishSession: () => {
                set({ currentView: 'results' })
            },

            saveSessionToHistory: () => {
                const state = get()
                if (state.answers.length === 0) return

                const topicStats: { [topic: string]: { correct: number, total: number } } = {}
                const TOPIC_MAP: Record<string, string> = {
                    "termo_properties_ideal_gas": "properties",
                    "termo_gas_density": "properties",
                    "termo_internal_energy": "properties",
                    "termo_isobaric": "processes",
                    "termo_isochoric": "processes",
                    "termo_isothermal": "processes",
                    "termo_adiabatic": "processes",
                    "termo_carnot_cycle": "cycles",
                    "termo_thermal_machines": "cycles",
                    "termo_entropy": "entropy"
                };

                state.answers.forEach(ans => {
                    const normalizedTopic = TOPIC_MAP[ans.topic] || ans.topic;
                    if (!topicStats[normalizedTopic]) {
                        topicStats[normalizedTopic] = { correct: 0, total: 0 }
                    }
                    topicStats[normalizedTopic].total++
                    if (ans.isCorrect) {
                        topicStats[normalizedTopic].correct++
                    }
                })

                const summary: SessionSummary = {
                    date: new Date().toISOString(),
                    score: state.score,
                    totalQuestions: state.answers.length,
                    topicStats,
                    timeSpentSeconds: state.timeLimitSeconds !== null && state.timeRemaining !== null
                        ? state.timeLimitSeconds - state.timeRemaining
                        : 0
                }

                const sessionTime = state.answers.reduce((acc, curr) => acc + curr.timeSpent, 0);

                // Streak Logic
                const now = new Date();
                const todayStr = now.toISOString().split('T')[0];
                const lastDate = state.lastActivityDate;
                let newStreak = state.streak;

                if (!lastDate) {
                    newStreak = 1;
                } else {
                    const yesterday = new Date(now);
                    yesterday.setDate(now.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];

                    if (lastDate === yesterdayStr) {
                        newStreak += 1;
                    } else if (lastDate !== todayStr) {
                        newStreak = 1;
                    }
                }

                set((state) => ({
                    history: [summary, ...state.history],
                    streak: newStreak,
                    totalSolved: state.totalSolved + state.answers.length,
                    totalTimeSeconds: state.totalTimeSeconds + sessionTime,
                    lastActivityDate: todayStr
                }))
            },

            resetSession: () => set({
                currentView: 'setup',
                currentQuestionIndex: 0,
                score: 0,
                questions: [],
                answers: [],
                timeRemaining: null
            }),

            updateTimeRemaining: (time) => set({ timeRemaining: time })
        }),
        {
            name: 'thermo-quiz-storage',
        }
    )
)
