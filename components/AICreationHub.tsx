import React, { useState, useEffect } from 'react';
import { Search, Layers, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { ViewState } from '../types';
import { ResearchConfig } from './ResearchConfig';
import { AIResearchAgent } from './AIResearchAgent';
import { CreativeConfig } from './CreativeConfig';
import { AICreativeAgent } from './AICreativeAgent';

interface AICreationHubProps {
    setView: (view: ViewState) => void;
    setIsImmersive?: (isImmersive: boolean) => void;
}

export const AICreationHub: React.FC<AICreationHubProps> = ({ setView, setIsImmersive }) => {
    const [mode, setMode] = useState<'SELECTION' | 'RESEARCH_CONFIG' | 'RESEARCH_AGENT' | 'CREATIVE_CONFIG' | 'CREATIVE_AGENT'>('SELECTION');
    const [researchData, setResearchData] = useState<any>(null);
    const [creativeData, setCreativeData] = useState<any>(null);

    useEffect(() => {
        if (mode === 'RESEARCH_AGENT' || mode === 'CREATIVE_AGENT') {
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

    if (mode === 'RESEARCH_AGENT' && researchData) {
        return <AIResearchAgent initialData={researchData} />;
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

    return (
        <div className="h-full w-full flex items-center justify-center p-6 animate-in fade-in duration-700">

            {/* Main Hero Container */}
            <div
                className="w-full max-w-3xl rounded-[40px] border border-[var(--border-color)] p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm transition-colors duration-300"
                style={{ background: 'linear-gradient(to bottom, var(--gradient-start), var(--gradient-end))' }}
            >

                {/* Structural Gradient - Low Intensity */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-[#B8F30B]/5 to-transparent blur-[80px] pointer-events-none"></div>

                {/* Content Wrapper */}
                <div className="relative z-10 flex flex-col items-center">

                    {/* Header Question */}
                    <div className="text-center mb-10 max-w-xl">
                        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] tracking-tight mb-2 leading-tight transition-colors duration-300">
                            ¿En qué te puedo ayudar hoy?
                        </h1>
                        <p className="text-[var(--text-secondary)] text-base font-light transition-colors duration-300">
                            Tu copiloto creativo para escalar resultados.
                        </p>
                    </div>

                    {/* Vertical Options Container */}
                    <div className="w-full grid gap-5">

                        {/* Option 1: Research */}
                        <button
                            onClick={() => setMode('RESEARCH_CONFIG')}
                            className="group w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-[24px] p-5 text-left transition-all duration-300 hover:border-[#B8F30B]/50 hover:shadow-[0_0_25px_rgba(184,243,11,0.1)] hover:-translate-y-0.5 flex items-center gap-6"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center group-hover:bg-[#B8F30B]/10 transition-colors duration-300 border border-[var(--border-color)] group-hover:border-[#B8F30B]/20">
                                <Search size={22} className="text-[var(--text-secondary)] group-hover:text-[#B8F30B] transition-colors duration-300" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--text-primary)] transition-colors">Research</h3>
                                <p className="text-[var(--text-secondary)] text-sm font-light leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors">
                                    Análisis de mercado y competidores.
                                </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                <ArrowRight size={20} className="text-[#B8F30B]" />
                            </div>
                        </button>

                        {/* Option 2: Creative Process */}
                        <button
                            onClick={() => handleStartCreative({
                                product: '',
                                countries: [],
                                objective: '',
                                links: ''
                            })}
                            className="group w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-[24px] p-5 text-left transition-all duration-300 hover:border-[#B8F30B]/50 hover:shadow-[0_0_25px_rgba(184,243,11,0.1)] hover:-translate-y-0.5 flex items-center gap-6"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center group-hover:bg-[#B8F30B]/10 transition-colors duration-300 border border-[var(--border-color)] group-hover:border-[#B8F30B]/20">
                                <Layers size={22} className="text-[var(--text-secondary)] group-hover:text-[#B8F30B] transition-colors duration-300" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--text-primary)] transition-colors">Proceso creativo</h3>
                                <p className="text-[var(--text-secondary)] text-sm font-light leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors">
                                    Ángulos, hooks y narrativa estratégica.
                                </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                <ArrowRight size={20} className="text-[#B8F30B]" />
                            </div>
                        </button>

                        {/* Option 3: Creative Strategist + Media Buyer */}
                        <button
                            onClick={() => setView(ViewState.AI_STUDIO)}
                            className="group w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-[24px] p-5 text-left transition-all duration-300 hover:border-[#B8F30B]/50 hover:shadow-[0_0_25px_rgba(184,243,11,0.1)] hover:-translate-y-0.5 flex items-center gap-6 relative overflow-hidden"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center group-hover:bg-[#B8F30B]/10 transition-colors duration-300 border border-[var(--border-color)] group-hover:border-[#B8F30B]/20">
                                <Brain size={22} className="text-[var(--text-secondary)] group-hover:text-[#B8F30B] transition-colors duration-300" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-primary)] transition-colors">Estratega + Media Buyer</h3>
                                    <span className="bg-[#B8F30B]/10 text-[#B8F30B] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#B8F30B]/20">
                                        Recomendado
                                    </span>
                                </div>
                                <p className="text-[var(--text-secondary)] text-sm font-light leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors">
                                    Estrategia integral y optimización de pauta.
                                </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                <ArrowRight size={20} className="text-[#B8F30B]" />
                            </div>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};
