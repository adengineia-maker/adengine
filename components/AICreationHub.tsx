import React, { useState, useEffect } from 'react';
import { Search, Layers, Brain, Sparkles, ArrowRight, Play, Calculator } from 'lucide-react';
import { ViewState } from '../types';
import { ResearchConfig } from './ResearchConfig';
import { AIResearchAgent } from './AIResearchAgent';
import { CreativeConfig } from './CreativeConfig';
import { AICreativeAgent } from './AICreativeAgent';
import Simulator from './simulator/Simulator';
import { FinancialModule } from './financial/FinancialModule';

interface AICreationHubProps {
    setView: (view: ViewState) => void;
    setIsImmersive?: (isImmersive: boolean) => void;
}

export const AICreationHub: React.FC<AICreationHubProps> = ({ setView, setIsImmersive }) => {
    const [mode, setMode] = useState<'SELECTION' | 'RESEARCH_CONFIG' | 'RESEARCH_AGENT' | 'CREATIVE_CONFIG' | 'CREATIVE_AGENT' | 'SIMULATOR' | 'CFO_AGENT'>('SELECTION');
    const [researchData, setResearchData] = useState<any>(null);
    const [creativeData, setCreativeData] = useState<any>(null);

    useEffect(() => {
        if (mode === 'RESEARCH_AGENT' || mode === 'CREATIVE_AGENT' || mode === 'CFO_AGENT') {
            setIsImmersive?.(true);
        } else {
            setIsImmersive?.(false);
        }

        // Cleanup function to ensure immersive mode is disabled when unmounting
        return () => {
            setIsImmersive?.(false);
        };
    }, [mode, setIsImmersive]);

    const handleStartResearch = (data: any) => {
        console.log('Starting research with data:', data);
        setResearchData(data);
        setMode('RESEARCH_AGENT');
    };

    const handleStartCreative = (data: any) => {
        console.log('Starting creative process with data:', data);
        setCreativeData(data);
        setMode('CREATIVE_AGENT');
    };

    if (mode === 'RESEARCH_AGENT') {
        return <AIResearchAgent onBack={() => setMode('SELECTION')} />;
    }

    if (mode === 'RESEARCH_CONFIG') {
        return (
            <ResearchConfig
                onStart={handleStartResearch}
                onCancel={() => {
                    setMode('SELECTION');
                }}
            />
        );
    }

    if (mode === 'CREATIVE_AGENT' && creativeData) {
        return <AICreativeAgent initialData={creativeData} />;
    }

    if (mode === 'CREATIVE_CONFIG') {
        return (
            <CreativeConfig
                onStart={handleStartCreative}
                onCancel={() => {
                    setMode('SELECTION');
                }}
            />
        );
    }

    if (mode === 'SIMULATOR') {
        return <Simulator onBack={() => setMode('SELECTION')} />;
    }

    if (mode === 'CFO_AGENT') {
        return <FinancialModule onBack={() => setMode('SELECTION')} />;
    }

    return (
        <div className="h-full w-full flex flex-col p-6 animate-in fade-in duration-700 overflow-hidden">

            {/* Header */}
            <div className="text-center mb-4 max-w-2xl shrink-0 mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2 leading-tight">
                    ¿En qué te puedo ayudar hoy?
                </h1>
                <p className="text-slate-400 text-sm font-light">
                    Potencia tu estrategia con nuestra suite de IA: desde investigación profunda y creación de contenido hasta análisis avanzado de datos. Todo lo que necesitas para escalar, en un solo lugar.
                </p>
            </div>

            {/* Scrollable Container - Centered Vertically */}
            <div className="flex-1 flex items-center w-full overflow-hidden min-h-0">
                <div className="w-full flex gap-6 overflow-x-auto px-4 snap-x snap-mandatory no-scrollbar mask-linear-fade py-4 items-center h-full">

                    {/* Card 1: Research (Orange) */}
                    <button
                        onClick={() => setMode('RESEARCH_AGENT')}
                        className="min-w-[300px] w-[300px] shrink-0 snap-center group relative flex flex-col justify-between h-full max-h-[600px] p-8 rounded-xl bg-[#0A0A0A] border border-white/10 overflow-hidden text-left transition-all duration-500 hover:scale-[1.02] hover:border-orange-500/50"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-orange-500/40 opacity-100 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-orange-600/40 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

                        {/* Icon */}
                        <div className="relative z-10 w-12 h-12 rounded-xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center mb-4 group-hover:border-orange-500/50 transition-colors duration-300">
                            <Search size={20} className="text-orange-500" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 mt-auto">
                            <h3 className="text-xl font-bold text-white mb-2">Research</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                Análisis de mercado y competidores para encontrar tu ventaja competitiva.
                            </p>
                            <div className="flex items-center gap-2 text-white font-medium text-xs group-hover:gap-3 transition-all">
                                <span>Iniciar Research</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </button>

                    {/* Card 2: Proceso Creativo (Blue) */}
                    <button
                        onClick={() => handleStartCreative({
                            product: '',
                            countries: [],
                            objective: '',
                            links: ''
                        })}
                        className="min-w-[300px] w-[300px] shrink-0 snap-center group relative flex flex-col justify-between h-full max-h-[600px] p-8 rounded-xl bg-[#0A0A0A] border border-white/10 overflow-hidden text-left transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/50"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-blue-500/40 opacity-100 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-600/40 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

                        {/* Icon */}
                        <div className="relative z-10 w-12 h-12 rounded-xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center mb-4 group-hover:border-blue-500/50 transition-colors duration-300">
                            <Layers size={20} className="text-blue-500" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 mt-auto">
                            <h3 className="text-xl font-bold text-white mb-2">Proceso Creativo</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                Generación de ángulos, hooks y narrativa estratégica para tus anuncios.
                            </p>
                            <div className="flex items-center gap-2 text-white font-medium text-xs group-hover:gap-3 transition-all">
                                <span>Crear Contenido</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </button>

                    {/* Card 3: Estratega (Green) */}
                    <button
                        onClick={() => setView(ViewState.AI_STUDIO)}
                        className="min-w-[300px] w-[300px] shrink-0 snap-center group relative flex flex-col justify-between h-full max-h-[600px] p-8 rounded-xl bg-[#0A0A0A] border border-white/10 overflow-hidden text-left transition-all duration-500 hover:scale-[1.02] hover:border-green-500/50"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-green-500/40 opacity-100 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-green-600/40 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

                        {/* Icon */}
                        <div className="relative z-10 w-12 h-12 rounded-xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center mb-4 group-hover:border-green-500/50 transition-colors duration-300">
                            <Brain size={20} className="text-green-500" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 mt-auto">
                            <h3 className="text-xl font-bold text-white mb-2">Estratega AI</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                Consultoría estratégica y optimización de pauta publicitaria.
                            </p>
                            <div className="flex items-center gap-2 text-white font-medium text-xs group-hover:gap-3 transition-all">
                                <span>Ver Estrategia</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </button>

                    {/* Card 4: Análisis IA (Purple) */}
                    <button
                        onClick={() => setView(ViewState.CAMPAIGNS)}
                        className="min-w-[300px] w-[300px] shrink-0 snap-center group relative flex flex-col justify-between h-full max-h-[600px] p-8 rounded-xl bg-[#0A0A0A] border border-white/10 overflow-hidden text-left transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/50"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-purple-500/40 opacity-100 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-purple-600/40 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

                        {/* Icon */}
                        <div className="relative z-10 w-12 h-12 rounded-xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center mb-4 group-hover:border-purple-500/50 transition-colors duration-300">
                            <Sparkles size={20} className="text-purple-500" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 mt-auto">
                            <h3 className="text-xl font-bold text-white mb-2">Análisis IA</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                Insights profundos y métricas clave para la toma de decisiones.
                            </p>
                            <div className="flex items-center gap-2 text-white font-medium text-xs group-hover:gap-3 transition-all">
                                <span>Analizar Datos</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </button>

                    {/* Card 5: Simulador de anuncios (Pink) */}
                    <button
                        onClick={() => setMode('SIMULATOR')}
                        className="min-w-[300px] w-[300px] shrink-0 snap-center group relative flex flex-col justify-between h-full max-h-[600px] p-8 rounded-xl bg-[#0A0A0A] border border-white/10 overflow-hidden text-left transition-all duration-500 hover:scale-[1.02] hover:border-pink-500/50"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 to-pink-500/40 opacity-100 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-pink-600/40 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

                        {/* Icon */}
                        <div className="relative z-10 w-12 h-12 rounded-xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center mb-4 group-hover:border-pink-500/50 transition-colors duration-300">
                            <Play size={20} className="text-pink-500" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 mt-auto">
                            <h3 className="text-xl font-bold text-white mb-2">Simulador de anuncios</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                Simula el rendimiento de tus anuncios con IA antes de invertir.
                            </p>
                            <div className="flex items-center gap-2 text-white font-medium text-xs group-hover:gap-3 transition-all">
                                <span>Simular Anuncio</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </button>

                    {/* Card 6: CFO IA (Cyan) */}
                    <button
                        onClick={() => setMode('CFO_AGENT')}
                        className="min-w-[300px] w-[300px] shrink-0 snap-center group relative flex flex-col justify-between h-full max-h-[600px] p-8 rounded-xl bg-[#0A0A0A] border border-white/10 overflow-hidden text-left transition-all duration-500 hover:scale-[1.02] hover:border-cyan-500/50"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-cyan-500/40 opacity-100 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-cyan-600/40 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

                        {/* Icon */}
                        <div className="relative z-10 w-12 h-12 rounded-xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center mb-4 group-hover:border-cyan-500/50 transition-colors duration-300">
                            <Calculator size={20} className="text-cyan-500" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 mt-auto">
                            <h3 className="text-xl font-bold text-white mb-2">CFO IA</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                Optimiza tu presupuesto y proyecciones financieras con inteligencia artificial.
                            </p>
                            <div className="flex items-center gap-2 text-white font-medium text-xs group-hover:gap-3 transition-all">
                                <span>Consultar CFO</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </button>

                </div>
            </div>
        </div>
    );
};
