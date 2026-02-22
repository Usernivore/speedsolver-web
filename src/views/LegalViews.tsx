import React from 'react';
import { useAppStore } from '../store';
import { Button } from '../components/Button';

const LegalLayout = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const setView = useAppStore((state) => state.setView);
    return (
        <div className="max-w-3xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-10">
                <Button
                    variant="ghost"
                    className="p-2 h-auto text-zinc-500 hover:text-white"
                    onClick={() => setView('tools')}
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </Button>
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                    {title}
                </h1>
            </div>
            <div className="prose prose-invert max-w-none space-y-6 text-zinc-400 text-sm leading-relaxed">
                {children}
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                <Button variant="outline" onClick={() => setView('setup')} className="w-auto px-10">
                    Volver al Inicio
                </Button>
            </div>
        </div>
    );
};

export const PrivacyView = () => (
    <LegalLayout title="Política de Privacidad">
        <section className="space-y-4">
            <h2 className="text-white font-bold text-lg uppercase tracking-widest">1. Información General</h2>
            <p>
                SpeedSolver ("nosotros", "nuestro") se compromete a proteger tu privacidad. Esta política describe cómo manejamos la información en nuestra plataforma educativa.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-white font-bold text-lg uppercase tracking-widest">2. Almacenamiento Local</h2>
            <p>
                Utilizamos <strong>Local Storage</strong> del navegador única y exclusivamente para guardar tu progreso académico: rachas de estudio (streaks), número de ejercicios resueltos y configuraciones de perfil. Estos datos permanecen en tu dispositivo y no son almacenados en nuestros servidores.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-white font-bold text-lg uppercase tracking-widest">3. Telemetría y Análisis</h2>
            <p>
                Utilizamos <strong>Google Analytics 4 (GA4)</strong> para monitorear el tráfico de forma agregada y anónima. Esto nos ayuda a entender qué herramientas son más utilizadas y mejorar la experiencia del usuario. No enviamos datos personales a Google.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-white font-bold text-lg uppercase tracking-widest">4. Datos Personales</h2>
            <p>
                Actualmente <strong>no recopilamos, vendemos ni almacenamos</strong> información de identificación personal (PII), como nombres reales, direcciones o correos electrónicos en ninguna base de datos externa.
            </p>
        </section>

        <p className="text-xs italic text-zinc-500 pt-8 text-center">
            Última actualización: Febrero 2026.
        </p>
    </LegalLayout>
);

export const TermsView = () => (
    <LegalLayout title="Términos de Servicio">
        <section className="space-y-4">
            <h2 className="text-white font-bold text-lg uppercase tracking-widest">1. Uso Educativo</h2>
            <p>
                SpeedSolver es una herramienta diseñada para fines estrictamente educativos y de referencia académica. El acceso a la plataforma es gratuito y está destinado a estudiantes y profesionales de la ingeniería.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-white font-bold text-lg uppercase tracking-widest">2. Responsabilidad de Cálculos</h2>
            <p>
                Aunque nos esforzamos por la máxima precisión utilizando estándares como IAPWS-IF97, SpeedSolver no es un software certificado para el diseño de sistemas críticos o seguridad industrial. El usuario es responsable de verificar los resultados para aplicaciones profesionales.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-white font-bold text-lg uppercase tracking-widest">3. Propiedad Intelectual</h2>
            <p>
                El motor de cálculo, el diseño de la interfaz y los algoritmos son propiedad de SpeedSolver. Se prohíbe el scrapeo masivo de datos o la redistribución no autorizada del código fuente.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-white font-bold text-lg uppercase tracking-widest">4. Monetización</h2>
            <p>
                Para mantener el servicio gratuito, podemos mostrar anuncios publicitarios a través de terceros (como Google AdSense), los cuales pueden utilizar cookies para personalizar los anuncios basados en tus visitas a este y otros sitios web.
            </p>
        </section>

        <p className="text-xs italic text-zinc-500 pt-8 text-center">
            Última actualización: Febrero 2026.
        </p>
    </LegalLayout>
);
