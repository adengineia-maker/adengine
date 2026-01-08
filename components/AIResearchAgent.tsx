import React, { useState } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Target,
    Users,
    Zap,
    MessageCircle,
    Check,
    AlertTriangle,
    Lightbulb,
    ShieldAlert,
    Play,
    FileText,
    Globe,
    Upload,
    ArrowLeft
} from 'lucide-react';

interface AIResearchAgentProps {
    onBack: () => void;
}

interface WizardData {
    step1: { productName: string; category: string; description: string; mainProblem: string };
    step2: { targetAudience: string; campaignGoal: string; geography: string };
    step3: { competitors: string; differentiator: string; priceOffer: string; hasTestimonials: 'yes' | 'no' | null; testimonialFile: File | null };
    step4: { scope: string[] };
}

const STEPS = [
    { number: 1, title: 'Identidad', icon: Target },
    { number: 2, title: 'Audiencia', icon: Users },
    { number: 3, title: 'Diferenciación', icon: Zap },
    { number: 4, title: 'Alcance', icon: Globe },
];

const CAMPAIGN_GOALS = ['Ventas Directas', 'Generación de Leads', 'Reconocimiento de Marca', 'Tráfico'];
const SCOPE_OPTIONS = [
    { id: 'world', label: 'A nivel Mundial', icon: '🌍' },
    { id: 'usa', label: 'Estados Unidos', icon: '🇺🇸' },
    { id: 'europe', label: 'Europa', icon: '🇪🇺' },
    { id: 'asia', label: 'Asia', icon: '🌏' },
    { id: 'high_data', label: 'Mercados con Alta Data', icon: '📊' },
];

export const AIResearchAgent: React.FC<AIResearchAgentProps> = ({ onBack }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [formData, setFormData] = useState<WizardData>({
        step1: { productName: '', category: '', description: '', mainProblem: '' },
        step2: { targetAudience: '', campaignGoal: 'Ventas Directas', geography: '' },
        step3: { competitors: '', differentiator: '', priceOffer: '', hasTestimonials: null, testimonialFile: null },
        step4: { scope: [] },
    });

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            handleAnalyze();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        // Simulate analysis
        setTimeout(() => {
            setIsAnalyzing(false);
            setShowResults(true);
        }, 2000);
    };

    const toggleScope = (id: string) => {
        const currentScopes = formData.step4.scope;
        if (currentScopes.includes(id)) {
            setFormData({ ...formData, step4: { ...formData.step4, scope: currentScopes.filter(s => s !== id) } });
        } else {
            setFormData({ ...formData, step4: { ...formData.step4, scope: [...currentScopes, id] } });
        }
    };

    // --- Steps Components ---
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-0.5">
                            <h2 className="text-lg font-bold text-white">¿Qué vas a ofrecer?</h2>
                            <p className="text-slate-400 text-xs text-white/50">Define la base de tu nuevo producto o servicio.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nombre del Producto/Servicio</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border-b border-white/10 py-1.5 px-3 rounded-t-sm text-xs text-white placeholder-slate-600 focus:border-[#c6ef4e] focus:bg-[#c6ef4e]/5 focus:outline-none transition-all"
                                    placeholder="Escribe el nombre comercial exacto"
                                    value={formData.step1.productName}
                                    onChange={(e) => setFormData({ ...formData, step1: { ...formData.step1, productName: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Categoría y Nicho</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border-b border-white/10 py-1.5 px-3 rounded-t-sm text-xs text-white placeholder-slate-600 focus:border-[#c6ef4e] focus:bg-[#c6ef4e]/5 focus:outline-none transition-all"
                                    placeholder="Ej: Skincare, SaaS B2B, Moda Sostenible"
                                    value={formData.step1.category}
                                    onChange={(e) => setFormData({ ...formData, step1: { ...formData.step1, category: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Descripción Funcional</label>
                                <textarea
                                    className="w-full bg-black/20 border-b border-white/10 py-1.5 px-3 rounded-t-sm text-xs text-white placeholder-slate-600 focus:border-[#c6ef4e] focus:bg-[#c6ef4e]/5 focus:outline-none transition-all resize-none h-12"
                                    placeholder="¿Qué es y qué hace?"
                                    value={formData.step1.description}
                                    onChange={(e) => setFormData({ ...formData, step1: { ...formData.step1, description: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Problema Principal</label>
                                <textarea
                                    className="w-full bg-black/20 border-b border-white/10 py-1.5 px-3 rounded-t-sm text-xs text-white placeholder-slate-600 focus:border-[#c6ef4e] focus:bg-[#c6ef4e]/5 focus:outline-none transition-all resize-none h-12"
                                    placeholder="¿Qué dolor soluciona?"
                                    value={formData.step1.mainProblem}
                                    onChange={(e) => setFormData({ ...formData, step1: { ...formData.step1, mainProblem: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-0.5">
                            <h2 className="text-lg font-bold text-white">Definiendo el Objetivo</h2>
                            <p className="text-slate-400 text-xs text-white/50">¿A quién le hablamos y qué queremos lograr?</p>
                        </div>
                        <div className="space-y-2">
                            <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Público Objetivo General</label>
                                <textarea
                                    className="w-full bg-black/20 border-b border-white/10 py-1.5 px-3 rounded-t-sm text-xs text-white placeholder-slate-600 focus:border-[#c6ef4e] focus:bg-[#c6ef4e]/5 focus:outline-none transition-all resize-none h-14"
                                    placeholder="Edad, género, rol profesional, intereses clave..."
                                    value={formData.step2.targetAudience}
                                    onChange={(e) => setFormData({ ...formData, step2: { ...formData.step2, targetAudience: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Objetivos de la Campaña</label>
                                <select
                                    className="w-full bg-black/20 border-b border-white/10 py-1.5 px-3 rounded-t-sm text-xs text-white placeholder-slate-600 focus:border-[#c6ef4e] focus:bg-[#c6ef4e]/5 focus:outline-none transition-all [&>option]:bg-black"
                                    value={formData.step2.campaignGoal}
                                    onChange={(e) => setFormData({ ...formData, step2: { ...formData.step2, campaignGoal: e.target.value } })}
                                >
                                    {CAMPAIGN_GOALS.map(goal => (
                                        <option key={goal} value={goal}>{goal}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Geografía de Venta</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border-b border-white/10 py-1.5 px-3 rounded-t-sm text-xs text-white placeholder-slate-600 focus:border-[#c6ef4e] focus:bg-[#c6ef4e]/5 focus:outline-none transition-all"
                                    placeholder="¿Dónde se comercializará el producto?"
                                    value={formData.step2.geography}
                                    onChange={(e) => setFormData({ ...formData, step2: { ...formData.step2, geography: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-0.5">
                            <h2 className="text-lg font-bold text-white">Tu Factor Único</h2>
                            <p className="text-slate-400 text-xs text-white/50">¿Por qué te elegirán a ti?</p>
                        </div>
                        <div className="space-y-2">
                            <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Competidores Directos</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border-b border-white/10 py-1.5 px-3 rounded-t-sm text-xs text-white placeholder-slate-600 focus:border-[#c6ef4e] focus:bg-[#c6ef4e]/5 focus:outline-none transition-all"
                                    placeholder="Menciona 2-3 competidores"
                                    value={formData.step3.competitors}
                                    onChange={(e) => setFormData({ ...formData, step3: { ...formData.step3, competitors: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Diferenciador</label>
                                <textarea
                                    className="w-full bg-black/20 border-b border-white/10 py-1.5 px-3 rounded-t-sm text-xs text-white placeholder-slate-600 focus:border-[#c6ef4e] focus:bg-[#c6ef4e]/5 focus:outline-none transition-all resize-none h-14"
                                    placeholder="¿Qué hacen ellos que tú haces diferente?"
                                    value={formData.step3.differentiator}
                                    onChange={(e) => setFormData({ ...formData, step3: { ...formData.step3, differentiator: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Precio y Oferta</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border-b border-white/10 py-1.5 px-3 rounded-t-sm text-xs text-white placeholder-slate-600 focus:border-[#c6ef4e] focus:bg-[#c6ef4e]/5 focus:outline-none transition-all"
                                    placeholder="Precio y garantías vigentes"
                                    value={formData.step3.priceOffer}
                                    onChange={(e) => setFormData({ ...formData, step3: { ...formData.step3, priceOffer: e.target.value } })}
                                />
                            </div>

                            {/* Testimonials Logic */}
                            <div className="space-y-1.5 pt-1.5 border-t border-white/5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">¿Tienes testimonios?</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setFormData({ ...formData, step3: { ...formData.step3, hasTestimonials: 'yes' } })}
                                        className={`p-2 rounded-lg border text-left transition-all group ${formData.step3.hasTestimonials === 'yes' ? 'bg-[#c6ef4e]/10 border-[#c6ef4e]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <div className={`text-xs font-bold mb-0.5 ${formData.step3.hasTestimonials === 'yes' ? 'text-[#c6ef4e]' : 'text-white'}`}>SÍ, tengo datos</div>
                                        <div className="text-[9px] text-slate-400">Subir archivo CSV/PDF</div>
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, step3: { ...formData.step3, hasTestimonials: 'no' } })}
                                        className={`p-2 rounded-lg border text-left transition-all group ${formData.step3.hasTestimonials === 'no' ? 'bg-[#c6ef4e]/10 border-[#c6ef4e]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <div className={`text-xs font-bold mb-0.5 ${formData.step3.hasTestimonials === 'no' ? 'text-[#c6ef4e]' : 'text-white'}`}>NO, empezar de cero</div>
                                        <div className="text-[9px] text-slate-400">Buscaré en la web</div>
                                    </button>
                                </div>

                                {/* Conditional Render */}
                                {formData.step3.hasTestimonials === 'yes' && (
                                    <div className="mt-1.5 p-3 border-2 border-dashed border-[#c6ef4e]/30 rounded-lg bg-[#c6ef4e]/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#c6ef4e]/10 transition-colors animate-in fade-in zoom-in-95 duration-300">
                                        <Upload size={16} className="text-[#c6ef4e] mb-1" />
                                        <span className="text-xs font-bold text-white">Sube tu archivo</span>
                                    </div>
                                )}
                                {formData.step3.hasTestimonials === 'no' && (
                                    <div className="mt-1.5 flex items-center gap-2 p-2 bg-[#c6ef4e]/10 border border-[#c6ef4e]/20 rounded-lg animate-in fade-in zoom-in-95 duration-300">
                                        <Sparkles size={14} className="text-[#c6ef4e] shrink-0" />
                                        <span className="text-[10px] text-slate-300 leading-tight"><span className="text-[#c6ef4e] font-bold">La IA buscará testimonios</span> automáticamente.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-0.5">
                            <h2 className="text-lg font-bold text-white">Alcance de Datos</h2>
                            <p className="text-slate-400 text-xs text-white/50">Selecciona dónde quieres que la IA busque tendencias y datos.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                            {SCOPE_OPTIONS.map(option => {
                                const isSelected = formData.step4.scope.includes(option.id);
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => toggleScope(option.id)}
                                        className={`flex items-center gap-3 p-2 rounded-xl border transition-all duration-300 group
                                            ${isSelected
                                                ? 'bg-[#c6ef4e]/10 border-[#c6ef4e] shadow-[0_0_15px_rgba(198,239,78,0.2)]'
                                                : 'bg-transparent border-white/10 hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <span className="text-lg">{option.icon}</span>
                                        <span className={`text-sm font-medium ${isSelected ? 'text-[#c6ef4e]' : 'text-slate-400 group-hover:text-white'}`}>
                                            {option.label}
                                        </span>
                                        {isSelected && <Check size={16} className="text-[#c6ef4e] ml-auto" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                );
        }
    };

    if (showResults) {
        return (
            <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Análisis de Mercado: <span className="text-[#c6ef4e]">{formData.step1.productName || 'Producto'}</span></h2>
                        <p className="text-slate-400">Resultados generados por IA basados en tu perfil.</p>
                    </div>
                    <button
                        onClick={() => setShowResults(false)}
                        className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                        Nueva Búsqueda
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ángulos de Venta */}
                    <div className="glass-panel p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c6ef4e]/10 rounded-full blur-[40px] pointer-events-none -mr-10 -mt-10"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#c6ef4e]/20 rounded-lg">
                                <Target size={20} className="text-[#c6ef4e]" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Ángulos de Venta</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <Check size={16} className="text-[#c6ef4e] mt-1 shrink-0" />
                                <span className="text-slate-300 text-sm">Enfoque en exclusividad: "No solo zapatillas, un estatus."</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <Check size={16} className="text-[#c6ef4e] mt-1 shrink-0" />
                                <span className="text-slate-300 text-sm">Comodidad sin sacrificio: "Estilo que puedes usar 12 horas seguidas."</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <Check size={16} className="text-[#c6ef4e] mt-1 shrink-0" />
                                <span className="text-slate-300 text-sm">Tecnología visible: "Diseño ergonómico inspirado en la NASA."</span>
                            </li>
                        </ul>
                    </div>

                    {/* Puntos de Dolor */}
                    <div className="glass-panel p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] pointer-events-none -mr-10 -mt-10"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <AlertTriangle size={20} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Puntos de Dolor</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-xs text-red-400 font-bold uppercase mb-1">Miedo #1</div>
                                <p className="text-slate-300 text-sm">"Que se rompan a la semana de uso intensivo."</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-xs text-red-400 font-bold uppercase mb-1">Miedo #2</div>
                                <p className="text-slate-300 text-sm">"Que no se vean tan bien como en la foto (Expectativa vs Realidad)."</p>
                            </div>
                        </div>
                    </div>

                    {/* Objeciones */}
                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-500/20 rounded-lg">
                                <ShieldAlert size={20} className="text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Manejo de Objeciones</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-white font-medium text-sm mb-1">Objeción: "Es muy caro"</h4>
                                <p className="text-slate-400 text-xs pl-3 border-l-2 border-slate-700">Rebatir con: Durabilidad garantizada y materiales premium que ahorran recambios.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-medium text-sm mb-1">Objeción: "¿Son cómodos?"</h4>
                                <p className="text-slate-400 text-xs pl-3 border-l-2 border-slate-700">Rebatir con: Política de prueba de 30 días "Camina en las nubes o devuélvelas".</p>
                            </div>
                        </div>
                    </div>

                    {/* Ideas Creativas */}
                    <div className="glass-panel p-6 border border-[#c6ef4e]/30 shadow-[0_0_20px_rgba(198,239,78,0.1)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#c6ef4e]/20 rounded-lg">
                                <Lightbulb size={20} className="text-[#c6ef4e]" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Ideas Creativas</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-[#c6ef4e]/20 hover:border-[#c6ef4e]/50 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-[#c6ef4e]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play size={16} className="text-[#c6ef4e]" />
                                </div>
                                <div>
                                    <div className="text-white text-sm font-bold">Unboxing ASMR</div>
                                    <div className="text-slate-400 text-xs">Video enfocado en sonidos de materiales.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-[#c6ef4e]/20 hover:border-[#c6ef4e]/50 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-[#c6ef4e]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users size={16} className="text-[#c6ef4e]" />
                                </div>
                                <div>
                                    <div className="text-white text-sm font-bold">UGC Lifestyle</div>
                                    <div className="text-slate-400 text-xs">Usuario corriendo en ciudad de noche.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 gap-8 max-w-6xl mx-auto animate-in fade-in duration-700">

            {/* Back Button (Absolute) */}
            <div className="absolute top-8 left-8 z-50">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-[#c6ef4e] transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Volver a Creación IA</span>
                </button>
            </div>

            {/* LEFT PANEL: Header + Stepper */}
            <div className="w-1/3 flex flex-col gap-12">

                {/* Header (Now inside Left Panel) */}
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Investigación con IA</h1>
                    <p className="text-sm text-slate-400 font-light leading-relaxed">Completa los 4 pasos para calibrar tu estrategia y obtener insights de alto valor.</p>
                </div>

                {/* Vertical Stepper */}
                <div className="relative pl-4">
                    <div className="absolute left-[39px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#c6ef4e] to-white/5 -z-10 opacity-30"></div>

                    <div className="flex flex-col gap-8">
                        {STEPS.map((step) => {
                            const isActive = step.number === currentStep;
                            const isCompleted = step.number < currentStep;

                            return (
                                <div key={step.number} className={`flex items-center gap-4 transition-all duration-300 ${isActive ? 'translate-x-2' : ''}`}>
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border transition-all duration-500 relative z-10 shrink-0
                                        ${isActive
                                            ? 'border-[#c6ef4e] bg-[#c6ef4e] text-black shadow-[0_0_20px_rgba(198,239,78,0.5)] scale-110'
                                            : isCompleted
                                                ? 'border-[#c6ef4e] bg-[#c6ef4e]/10 text-[#c6ef4e]'
                                                : 'border-white/10 bg-[#0a0a0a] text-slate-600'
                                        }
                                    `}>
                                        {isCompleted ? <Check size={16} strokeWidth={3} /> : step.number}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                            {step.title}
                                        </span>
                                        {isActive && <span className="text-[10px] text-[#c6ef4e] animate-pulse">En progreso...</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Premium Glass Card */}
            <div className="w-2/3 relative">
                <div className={`
                    glass-panel p-5 rounded-[2rem] 
                    border border-white/10
                    shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)]
                    bg-gradient-to-b from-white/5 to-transparent
                    relative overflow-hidden transition-all duration-500 
                    min-h-[350px] flex flex-col justify-center
                    ${isAnalyzing ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100'}
                `}>
                    {/* Internal Progress Bar */}
                    <div className="w-full bg-white/5 h-1 rounded-full mb-4 overflow-hidden shrink-0">
                        <div
                            className="bg-[#c6ef4e] h-full rounded-full shadow-[0_0_10px_#c6ef4e] transition-all duration-700 ease-out relative"
                            style={{ width: `${(currentStep / 4) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]"></div>
                        </div>
                    </div>

                    {/* Step Title & Content */}
                    <div className="flex-1 flex flex-col justify-center gap-2">
                        {renderStepContent()}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2 shrink-0">
                        <button
                            onClick={handleBack}
                            className={`text-slate-400 hover:text-white transition-colors text-xs font-medium flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                            <ChevronLeft size={14} /> Atrás
                        </button>

                        <button
                            onClick={handleNext}
                            className="bg-[#c6ef4e] hover:bg-[#b0d640] text-black px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(198,239,78,0.3)] hover:shadow-[0_0_30px_rgba(198,239,78,0.5)] transition-all active:scale-95"
                        >
                            {currentStep === 4 ? (
                                <>
                                    <Sparkles size={16} /> Analizar con IA
                                </>
                            ) : (
                                <>
                                    Siguiente <ChevronRight size={16} />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#c6ef4e]/5 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20"></div>
                </div>

                {/* Loading Overlay */}
                {isAnalyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
                        <div className="w-16 h-16 rounded-full border-2 border-white/5 border-t-[#c6ef4e] animate-spin mb-4 shadow-[0_0_20px_rgba(198,239,78,0.2)]"></div>
                        <div className="text-white font-bold text-xl animate-pulse">Analizando Mercado...</div>
                        <p className="text-slate-400 text-sm mt-2">Nuestros agentes están procesando tu solicitud</p>
                    </div>
                )}
            </div>
        </div>
    );
};
