import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateSession, GeneratedQuestion } from './speedsolver_engine/thermodynamics/ThermoEngine'

export type View = 'setup' | 'quiz' | 'results' | 'dashboard' | 'profile'

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
                state.answers.forEach(ans => {
                    if (!topicStats[ans.topic]) {
                        topicStats[ans.topic] = { correct: 0, total: 0 }
                    }
                    topicStats[ans.topic].total++
                    if (ans.isCorrect) {
                        topicStats[ans.topic].correct++
                    }
                })

                const summary: SessionSummary = {
                    date: new Date().toISOString(),
                    score: state.score,
                    totalQuestions: state.totalQuestions,
                    topicStats,
                    timeSpentSeconds: state.timeLimitSeconds !== null && state.timeRemaining !== null
                        ? state.timeLimitSeconds - state.timeRemaining
                        : 0
                }

                set((state) => ({
                    history: [summary, ...state.history]
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
