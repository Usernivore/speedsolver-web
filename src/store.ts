import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateSession, GeneratedQuestion } from './speedsolver_engine/thermodynamics/ThermoEngine'

export type View = 'setup' | 'quiz' | 'results' | 'dashboard' | 'profile' | 'tools' | 'rankine' | 'interpolator' | 'unit-converter' | 'vector-calculator' | 'psychrometric' | 'privacy' | 'terms'

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
    // Accumulator Stats
    totalSolved: number
    totalCorrect: number
    totalTimeSeconds: number
    streak: number
    lastActiveDate: string | null
    topicStats: Record<string, { correct: number, total: number }>

    startSession: (total: number, timeLimit: number | null, topics: string[], lang: 'es' | 'en') => void
    addResult: (result: SessionResult) => void
    nextQuestion: () => void
    finishSession: () => void
    resetSession: () => void
    updateTimeRemaining: (time: number | null) => void
    accumulateSessionStats: () => void
    importData: (data: any) => void
    clearAllData: () => void
    injectMockData: () => void
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
            totalSolved: 0,
            totalCorrect: 0,
            totalTimeSeconds: 0,
            streak: 0,
            lastActiveDate: null,
            topicStats: {},

            startSession: (total, timeLimit, topics, lang) => {
                const generatedQuestions = generateSession(topics, total, lang);
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

            accumulateSessionStats: () => {
                const state = get()
                if (state.answers.length === 0) return

                const sessionCorrect = state.answers.filter(a => a.isCorrect).length;
                const sessionTotal = state.answers.length;
                const sessionTime = state.answers.reduce((acc, curr) => acc + curr.timeSpent, 0);

                // Update topic stats
                const newTopicStats = { ...state.topicStats };
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
                    const mappedTopic = TOPIC_MAP[ans.topic] || ans.topic;
                    if (!newTopicStats[mappedTopic]) {
                        newTopicStats[mappedTopic] = { correct: 0, total: 0 };
                    }
                    newTopicStats[mappedTopic].total++;
                    if (ans.isCorrect) {
                        newTopicStats[mappedTopic].correct++;
                    }
                });

                // Streak Logic
                const now = new Date();
                const todayStr = now.toISOString().split('T')[0];
                const lastDate = state.lastActiveDate;
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

                set({
                    totalSolved: state.totalSolved + sessionTotal,
                    totalCorrect: state.totalCorrect + sessionCorrect,
                    totalTimeSeconds: state.totalTimeSeconds + sessionTime,
                    topicStats: newTopicStats,
                    streak: newStreak,
                    lastActiveDate: todayStr,
                    // Cleanup legacy history if it still exists in the state object
                    ...({ history: undefined } as any)
                });
            },

            resetSession: () => set({
                currentView: 'setup',
                currentQuestionIndex: 0,
                score: 0,
                questions: [],
                answers: [],
                timeRemaining: null
            }),

            updateTimeRemaining: (time) => set({ timeRemaining: time }),

            importData: (data) => set((state) => ({
                ...state,
                ...data,
                // Ensure history is wiped on import if loading old format
                history: undefined
            })),

            clearAllData: () => {
                localStorage.removeItem('thermo-quiz-storage');
                window.location.reload();
            },

            injectMockData: () => {
                const coreTopics = ["properties", "processes", "cycles", "entropy"];

                const mockTopicStats: Record<string, { correct: number, total: number }> = {};
                let totalS = 0;
                let totalC = 0;

                coreTopics.forEach(topic => {
                    const total = Math.floor(Math.random() * 41) + 10; // 10 to 50
                    const correct = Math.floor(Math.random() * (total + 1));
                    mockTopicStats[topic] = { correct, total };
                    totalS += total;
                    totalC += correct;
                });

                set({
                    topicStats: mockTopicStats,
                    totalSolved: totalS,
                    totalCorrect: totalC,
                    totalTimeSeconds: totalS * 45, // approx 45s per exercise
                    streak: 7,
                    lastActiveDate: new Date().toISOString().split('T')[0],
                    // @ts-ignore
                    history: undefined
                });
            }
        }),
        {
            name: 'thermo-quiz-storage',
        }
    )
)
