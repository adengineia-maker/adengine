import React from 'react';
import { AlertTriangle, TrendingUp, Activity, Zap } from 'lucide-react';

interface AlertCardProps {
    title: string;
    description: string;
    type: 'warning' | 'opportunity';
    icon: React.ElementType;
}

const AlertCard: React.FC<AlertCardProps> = ({ title, description, type, icon: Icon }) => {
    const isWarning = type === 'warning';
    const accentColor = isWarning ? '#B7A000' : '#D1F80C'; // Muted Yellow vs Lime Green
    const bgColor = isWarning ? 'rgba(183, 160, 0, 0.1)' : 'rgba(209, 248, 12, 0.1)';

    return (
        <div className="bg-[#202020] rounded-2xl p-6 border border-white/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden h-full">
            {/* Side Accent Line */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: accentColor }}
            ></div>

            <div className="flex flex-col h-full">
                {/* Header with Icon */}
                <div className="flex items-center gap-3 mb-3">
                    <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: bgColor }}
                    >
                        <Icon size={18} style={{ color: accentColor }} />
                    </div>
                    <h4 className="text-white font-bold text-sm leading-tight group-hover:text-white/90 transition-colors">
                        {title}
                    </h4>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-xs leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Subtle Glow Effect on Hover */}
            <div
                className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{ backgroundColor: accentColor }}
            ></div>
        </div>
    );
};

export const AIAlertsModule: React.FC = () => {
    return (
        <div className="w-full mt-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-gradient-to-br from-[#D1F80C] to-[#B7A000] rounded-lg">
                    <Zap size={16} className="text-black fill-black" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Alertas de IA — Señales críticas del sistema</h3>
                    <p className="text-xs text-slate-400">Análisis en tiempo real para decisiones estratégicas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Alerta 1: Fatiga Creativa */}
                <AlertCard
                    title="Fatiga creativa detectada"
                    description="El CTR ha disminuido de forma sostenida en uno o más anuncios. Se recomienda iterar creatividades para evitar caída de rendimiento."
                    type="warning"
                    icon={Activity}
                />

                {/* Alerta 2: Aumento del CPM */}
                <AlertCard
                    title="Incremento de CPM"
                    description="El costo por mil impresiones ha aumentado respecto al período anterior. Posible saturación de audiencia o alta competencia."
                    type="warning"
                    icon={AlertTriangle}
                />

                {/* Alerta 3: Oportunidad de Escala */}
                <AlertCard
                    title="Oportunidad de escalar presupuesto"
                    description="Campañas con ROAS superior al promedio y estabilidad en CPA. Incrementar presupuesto podría amplificar resultados."
                    type="opportunity"
                    icon={TrendingUp}
                />

                {/* Alerta 4: Desbalance ROAS/CPA */}
                <AlertCard
                    title="Desbalance de eficiencia detectado"
                    description="Algunos anuncios muestran buen volumen pero CPA elevado. Recomendación: optimizar mensajes o segmentación."
                    type="warning"
                    icon={AlertTriangle}
                />

            </div>
        </div>
    );
};
