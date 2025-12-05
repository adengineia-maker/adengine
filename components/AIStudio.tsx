import React, { useState, useRef, useEffect } from 'react';
import { generateAdScript, performResearch, auditLandingPageContent, chatWithAgent } from '../services/geminiService';
import { Sparkles, FileText, MessageSquare, Search, Loader2, Copy, Send, Plus, History, ArrowLeft, ChevronDown, PenLine, X } from 'lucide-react';

enum ToolMode {
  RESEARCH = 'RESEARCH',
  SCRIPT_GEN = 'SCRIPT_GEN',
  LP_AUDIT = 'LP_AUDIT'
}

interface ProjectContext {
  id: string;
  productName: string;
  audience: string;
  benefits: string;
  strategy: string;
  timestamp: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const STRATEGIES = [
  "Problema - Agitación - Solución (PAS)",
  "Atención - Interés - Deseo - Acción (AIDA)",
  "UGC / Testimonial Orgánico",
  "Unboxing / ASMR",
  "Antes vs Después",
  "Storytelling Emocional",
  "Educativo / 'How-to'",
  "Oferta Irresistible / FOMO"
];

const MOCK_HISTORY: ProjectContext[] = [
  {
    id: '1',
    productName: 'SmartWatch Pro',
    audience: 'Corredores de Maratón',
    benefits: 'GPS de alta precisión, Batería de 7 días, Resistente al agua 50m',
    strategy: 'Problema - Agitación - Solución (PAS)',
    timestamp: Date.now()
  },
  {
    id: '2',
    productName: 'Curso de Inglés Intensivo',
    audience: 'Ejecutivos ocupados',
    benefits: 'Clases de 15 min, Profesores nativos, Enfoque en negocios',
    strategy: 'Educativo / \'How-to\'',
    timestamp: Date.now() - 86400000
  },
  {
    id: '3',
    productName: 'SmartWatch Pro',
    audience: 'Nadadores profesionales',
    benefits: 'GPS de alta precisión, Batería de 7 días, Resistente al agua 50m',
    strategy: 'Antes vs Después',
    timestamp: Date.now() - 100000000
  }
];

export const AIStudio: React.FC = () => {
  const [mode, setMode] = useState<ToolMode>(ToolMode.RESEARCH);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  // Script Gen State
  const [step, setStep] = useState<1 | 2>(1);
  const [productName, setProductName] = useState('');
  const [audience, setAudience] = useState('');
  const [benefits, setBenefits] = useState('');
  const [strategy, setStrategy] = useState('');
  const [history, setHistory] = useState<ProjectContext[]>(MOCK_HISTORY);

  // UI State for inputs
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const [isCustomAudience, setIsCustomAudience] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Other Modes State
  const [inputText, setInputText] = useState('');

  // Derived lists
  const uniqueProducts = Array.from(new Set(history.map(h => h.productName)));
  const uniqueAudiences = Array.from(new Set(history.map(h => h.audience)));

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__NEW__') {
      setIsCustomProduct(true);
      setProductName('');
      setBenefits('');
    } else {
      setIsCustomProduct(false);
      setProductName(val);
      // Find benefits for this product (take the most recent one)
      const context = history.find(h => h.productName === val);
      if (context) {
        setBenefits(context.benefits);
      }
    }
  };

  const handleAudienceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__NEW__') {
      setIsCustomAudience(true);
      setAudience('');
    } else {
      setIsCustomAudience(false);
      setAudience(val);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setOutput('');

    try {
      if (mode === ToolMode.SCRIPT_GEN) {
        // Save to history if it's a new combination
        const exists = history.some(h => h.productName === productName && h.audience === audience && h.strategy === strategy);
        if (!exists && productName && audience && strategy) {
          const newContext: ProjectContext = {
            id: Date.now().toString(),
            productName,
            audience,
            benefits,
            strategy,
            timestamp: Date.now()
          };
          setHistory(prev => [newContext, ...prev]);
        }

        const result = await generateAdScript(productName, audience, benefits, 'Meta/TikTok', strategy);
        setChatMessages([
          { role: 'assistant', content: result }
        ]);
        setStep(2);
      } else if (mode === ToolMode.RESEARCH) {
        const result = await performResearch(inputText);
        setOutput(result);
      } else if (mode === ToolMode.LP_AUDIT) {
        const result = await auditLandingPageContent(inputText);
        setOutput(result);
      }
    } catch (e) {
      setOutput('Ocurrió un error. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    setLoading(true);

    try {
      const response = await chatWithAgent([...chatMessages, newMessage], chatInput);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const ModeButton = ({ targetMode, icon: Icon, label }: { targetMode: ToolMode, icon: any, label: string }) => (
    <button
      onClick={() => { setMode(targetMode); setOutput(''); setStep(1); }}
      className={`relative flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 font-medium ${mode === targetMode
        ? 'bg-primary-500 text-slate-950 border-primary-500 shadow-glow'
        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
        }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  // Render Full Screen Chat
  if (mode === ToolMode.SCRIPT_GEN && step === 2) {
    return (
      <div className="-mx-8 -mb-8 h-[calc(100%+2rem)] w-[calc(100%+4rem)] flex flex-col animate-in fade-in zoom-in-95 duration-300 relative bg-slate-950">
        {/* Chat Header - Minimal */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#020617] to-transparent">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 transition-all">
              <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-medium">Volver a Configuración</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">{productName}</span>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-medium text-slate-400">{strategy}</span>
          </div>
        </div>

        {/* Chat Area - Centered & Clean */}
        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth pt-20 pb-32">
          <div className="max-w-3xl mx-auto px-4 space-y-8">
            {/* Initial Greeting / Context */}
            <div className="flex gap-4 text-slate-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="space-y-2 flex-1 pt-1">
                <p className="font-medium text-white">Agente Creativo</p>
                <p className="text-slate-400 leading-relaxed">
                  He analizado tu producto <span className="text-white">{productName}</span> y la estrategia <span className="text-white">{strategy}</span>.
                  Aquí tienes una propuesta inicial diseñada para <span className="text-white">{audience}</span>.
                </p>
              </div>
            </div>

            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} group`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-primary-500 to-purple-600 shadow-primary-500/20'
                  : 'bg-slate-700'
                  }`}>
                  {msg.role === 'assistant' ? <Sparkles size={16} className="text-white" /> : <div className="w-full h-full rounded-full bg-slate-600" />}
                </div>

                {/* Message Content */}
                <div className={`flex-1 max-w-[85%] space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {msg.role === 'assistant' ? 'AI Creative' : 'Tú'}
                    </span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => navigator.clipboard.writeText(msg.content)}
                        className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-white transition-colors"
                        title="Copiar texto"
                      >
                        <Copy size={12} />
                      </button>
                    )}
                  </div>

                  <div className={`prose prose-invert prose-lg max-w-none ${msg.role === 'user'
                    ? 'bg-white/10 text-white rounded-3xl rounded-tr-sm px-6 py-4 inline-block text-left'
                    : ''
                    }`}>
                    {msg.role === 'user' ? (
                      <p className="m-0 text-base">{msg.content}</p>
                    ) : (
                      <pre className="whitespace-pre-wrap font-sans text-base leading-loose text-slate-200 bg-transparent p-0 border-none">
                        {msg.content}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div className="pt-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl flex items-end p-2 transition-all focus-within:ring-1 focus-within:ring-primary-500/50 focus-within:border-primary-500/50">
              <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors mb-0.5">
                <Plus size={20} />
              </button>

              <textarea
                value={chatInput}
                onChange={e => {
                  setChatInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Envía un mensaje al agente..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 resize-none max-h-[200px] py-3.5 px-2 custom-scrollbar text-base leading-relaxed"
                rows={1}
              />

              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || loading}
                className={`p-3 rounded-full transition-all mb-0.5 ${chatInput.trim()
                  ? 'bg-primary-500 text-slate-950 hover:bg-primary-400 shadow-lg shadow-primary-500/20'
                  : 'bg-white/5 text-slate-500 cursor-not-allowed'
                  }`}
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-center text-xs text-slate-600 mt-3 font-medium">
              La IA puede cometer errores. Por favor verifica la información importante.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Standard Layout for Step 1 or other modes
  return (
    <div className="h-full min-h-[calc(100vh-140px)] flex flex-col">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase border border-blue-500/20">
              Gemini 2.5 Powered
            </span>
          </div>
          <h2 className="text-4xl font-light text-white tracking-tight">Estudio <span className="font-bold">Inteligente</span></h2>
          <p className="text-slate-400 mt-2 font-light text-lg">Crea guiones, audita páginas y analiza competidores en segundos.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <ModeButton targetMode={ToolMode.RESEARCH} icon={Search} label="Research" />
          <ModeButton targetMode={ToolMode.SCRIPT_GEN} icon={FileText} label="Generador" />
          <ModeButton targetMode={ToolMode.LP_AUDIT} icon={MessageSquare} label="Auditoría" />
        </div>
      </div>

      {/* Main Content Area */}
      {mode === ToolMode.SCRIPT_GEN ? (
        // Isolated Form View
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl glass-card rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl border border-white/10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-light text-white">Configuración del <span className="font-bold">Proyecto</span></h3>
                <button
                  onClick={() => {
                    setIsCustomProduct(true);
                    setIsCustomAudience(true);
                    setProductName('');
                    setAudience('');
                    setBenefits('');
                    setStrategy('');
                  }}
                  className="text-xs flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase tracking-wider font-bold bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10"
                >
                  <Plus size={14} /> Limpiar
                </button>
              </div>

              <div className="space-y-6">
                {/* Product Field */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Producto</label>
                    {isCustomProduct && uniqueProducts.length > 0 && (
                      <button onClick={() => setIsCustomProduct(false)} className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
                        <History size={12} /> Usar Guardado
                      </button>
                    )}
                  </div>

                  {!isCustomProduct && uniqueProducts.length > 0 ? (
                    <div className="relative group">
                      <select
                        value={productName}
                        onChange={handleProductSelect}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none cursor-pointer hover:bg-white/5 transition-all text-lg font-light"
                      >
                        <option value="" disabled className="bg-slate-900 text-slate-500">Selecciona un producto...</option>
                        {uniqueProducts.map(p => (
                          <option key={p} value={p} className="bg-slate-900 text-white">{p}</option>
                        ))}
                        <option value="__NEW__" className="bg-slate-900 text-primary-400 font-bold">+ Crear Nuevo Producto</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-white transition-colors" size={20} />
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-slate-600 text-lg font-light"
                      placeholder="ej. Reloj Inteligente Acme"
                      value={productName}
                      onChange={e => setProductName(e.target.value)}
                      autoFocus={isCustomProduct}
                    />
                  )}
                </div>

                {/* Audience Field */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Público Objetivo</label>
                    {isCustomAudience && uniqueAudiences.length > 0 && (
                      <button onClick={() => setIsCustomAudience(false)} className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
                        <History size={12} /> Usar Guardado
                      </button>
                    )}
                  </div>

                  {!isCustomAudience && uniqueAudiences.length > 0 ? (
                    <div className="relative group">
                      <select
                        value={audience}
                        onChange={handleAudienceSelect}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none cursor-pointer hover:bg-white/5 transition-all text-lg font-light"
                      >
                        <option value="" disabled className="bg-slate-900 text-slate-500">Selecciona un público...</option>
                        {uniqueAudiences.map(a => (
                          <option key={a} value={a} className="bg-slate-900 text-white">{a}</option>
                        ))}
                        <option value="__NEW__" className="bg-slate-900 text-primary-400 font-bold">+ Crear Nuevo Público</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-white transition-colors" size={20} />
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-slate-600 text-lg font-light"
                      placeholder="ej. Profesionales ocupados de 25-40 años"
                      value={audience}
                      onChange={e => setAudience(e.target.value)}
                      autoFocus={isCustomAudience}
                    />
                  )}
                </div>

                {/* Strategy Field */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Estrategia</label>
                  <div className="relative group">
                    <select
                      value={strategy}
                      onChange={e => setStrategy(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none cursor-pointer hover:bg-white/5 transition-all text-lg font-light"
                    >
                      <option value="" disabled className="bg-slate-900 text-slate-500">Selecciona una estrategia...</option>
                      {STRATEGIES.map(s => (
                        <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-white transition-colors" size={20} />
                  </div>
                </div>

                {/* Benefits Field */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Beneficios Clave</label>
                  <textarea
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none h-40 resize-none transition-all placeholder-slate-600 custom-scrollbar text-lg font-light leading-relaxed"
                    placeholder="Lista los principales puntos de venta..."
                    value={benefits}
                    onChange={e => setBenefits(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || (!productName || !audience || !benefits || !strategy)}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-slate-950 font-bold text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <MessageSquare size={24} />}
                {loading ? 'Inicializando...' : 'Comenzar Sesión Creativa'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Other Modes (Split View)
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          {/* Input Section */}
          <div className="flex flex-col">
            <div className="glass-card rounded-3xl p-8 space-y-6 relative overflow-hidden flex-1">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  {mode === ToolMode.RESEARCH ? "Material de Investigación" : "Texto de Landing Page"}
                </label>
                <textarea
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none h-64 resize-none transition-all placeholder-slate-600 custom-scrollbar"
                  placeholder={mode === ToolMode.RESEARCH ? "Pega reseñas, artículos, análisis de competencia o cualquier texto para investigar..." : "Pega el contenido de texto de tu landing page aquí..."}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-slate-950 font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                {loading ? 'Generando Magia...' : 'Generar Resultados'}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col h-full">
            <div className="glass-card rounded-3xl p-1 h-full flex flex-col shadow-2xl relative overflow-hidden ring-1 ring-white/10">
              <div className="bg-black/40 rounded-[1.3rem] h-full flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="ml-4 text-sm font-mono text-slate-500">resultado-ia.txt</span>
                  </div>
                  {output && (
                    <button
                      className="glass-panel px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 text-slate-300 hover:text-white transition-colors hover:bg-white/10"
                      onClick={() => navigator.clipboard.writeText(output)}
                    >
                      <Copy size={14} /> Copiar
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#0A0A0A]">
                  {output ? (
                    <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-strong:text-primary-400">
                      <pre className="whitespace-pre-wrap font-sans text-base leading-loose">{output}</pre>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700">
                      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                        <Sparkles size={40} className="text-slate-600" />
                      </div>
                      <p className="text-xl font-light">Esperando instrucciones...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};