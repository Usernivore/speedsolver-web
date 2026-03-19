import React, { useState } from 'react'
import { useAppStore } from '../store'
import { Button } from '../components/Button'
import { Toast } from '../components/Toast'
import { AVATARS } from '../lib/constants'
import { useTranslation } from 'react-i18next'

export const ProfileView = () => {
    const {
        userProfile,
        updateUserProfile,
        // Accumulator State
        totalSolved,
        totalCorrect,
        totalTimeSeconds,
        streak,
        lastActiveDate,
        topicStats,
        importData,
    } = useAppStore()
    const { t } = useTranslation()

    const [formData, setFormData] = useState({
        name: userProfile.name,
        email: userProfile.email,
        institution: userProfile.institution,
        avatarId: userProfile.avatarId
    })

    const [showToast, setShowToast] = useState(false)

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        updateUserProfile(formData)
        setShowToast(true)
    }

    const cycleAvatar = () => {
        setFormData(prev => ({
            ...prev,
            avatarId: (prev.avatarId + 1) % AVATARS.length
        }))
    }

    const handleExport = () => {
        const data = {
            userProfile,
            totalSolved,
            totalCorrect,
            totalTimeSeconds,
            streak,
            lastActiveDate,
            topicStats,
            exportDate: new Date().toISOString(),
            version: '2.0'
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `speedsolver-backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string)
                importData(data)
                alert(t('profile.import_success'))
                window.location.reload()
            } catch (err) {
                alert('Error parsing backup file.')
            }
        }
        reader.readAsText(file)
    }


    return (
        <div className="max-w-4xl mx-auto w-full space-y-8 pb-20">
            <Toast
                message={t('profile.success_message')}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-4 md:px-0">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{t('profile.title')}</h2>
                    <p className="text-slate-400 mt-1 text-sm md:text-base">{t('profile.subtitle')}</p>
                </div>
            </div>

            <div className="bg-[#1E1E1E] border border-white/5 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 md:p-12">
                    <form className="space-y-10" onSubmit={handleSave}>
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="relative group cursor-pointer" onClick={cycleAvatar}>
                                <div className="size-32 rounded-full border-2 border-primary/20 p-1 transition-all group-hover:border-primary/50">
                                    <img
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full bg-zinc-800"
                                        src={AVATARS[formData.avatarId]}
                                    />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white">refresh</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">ID: SPEEDS-4492-T</span>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('profile.name')}</label>
                                <input
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-zinc-200 placeholder-zinc-500"
                                    placeholder="Ej. Ricardo Morales"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('profile.email')}</label>
                                <input
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-zinc-200 placeholder-zinc-500"
                                    placeholder="correo@universidad.edu"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('profile.institution')}</label>
                                <input
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-zinc-200 placeholder-zinc-500"
                                    placeholder="Nombre de tu institución"
                                    type="text"
                                    value={formData.institution}
                                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-6 max-w-2xl mx-auto space-y-12">
                            <Button
                                className="w-full py-4 bg-primary hover:bg-orange-600 text-white font-bold tracking-widest shadow-lg shadow-primary/20"
                                type="submit"
                                icon="save"
                            >
                                {t('common.save')}
                            </Button>

                            {/* Data Management Section */}
                            <div className="border-t border-white/5 pt-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-zinc-500">settings_backup_restore</span>
                                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                                        {t('profile.data_management')}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        className="bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 py-3 text-xs"
                                        icon="download"
                                        onClick={handleExport}
                                        type="button"
                                    >
                                        {t('profile.export_data')}
                                    </Button>

                                    <div className="relative">
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="import-backup"
                                            accept=".json"
                                            onChange={handleImport}
                                        />
                                        <label
                                            htmlFor="import-backup"
                                            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95 h-full"
                                        >
                                            <span className="material-symbols-outlined text-sm">upload</span>
                                            {t('profile.import_data')}
                                        </label>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

