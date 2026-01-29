import React, { useState } from 'react'
import { useAppStore } from '../store'
import { Button } from '../components/Button'
import { Toast } from '../components/Toast'
import { AVATARS } from '../lib/constants'

export const ProfileView = () => {
    const { userProfile, updateUserProfile } = useAppStore()

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

    return (
        <div className="max-w-4xl mx-auto w-full space-y-8">
            <Toast
                message="✅ Perfil actualizado correctamente"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Configuración de Cuenta</h2>
                    <p className="text-slate-400 mt-1">Gestione su identidad de ingeniería y preferencias de entorno.</p>
                </div>
            </div>

            <div className="bg-[#1E1E1E] border border-white/5 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-8 md:p-12">
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
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nombre Completo</label>
                                <input
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-zinc-200 placeholder-zinc-500"
                                    placeholder="Ej. Ricardo Morales"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Correo Institucional</label>
                                <input
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-zinc-200 placeholder-zinc-500"
                                    placeholder="correo@universidad.edu"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Universidad / Institución</label>
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
                        <div className="pt-6 max-w-2xl mx-auto">
                            <Button
                                className="w-full py-4 bg-primary hover:bg-orange-600 text-white font-bold tracking-widest shadow-lg shadow-primary/20"
                                type="submit"
                                icon="save"
                            >
                                GUARDAR CAMBIOS
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

