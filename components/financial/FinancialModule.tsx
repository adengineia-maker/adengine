import React, { useState } from 'react';
import { Dashboard } from './Dashboard';
import { ChatInterface } from './ChatInterface';
import { AppState, FinancialData, Message } from '../../types/financialTypes';
import { INITIAL_FINANCIAL_DATA } from '../../constants/financialConstants';
import { sendMessageToGemini } from '../../services/financialService';
import { ArrowRight, FileSpreadsheet, MessageCircle } from 'lucide-react';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface FinancialModuleProps {
    onBack?: () => void;
}

export const FinancialModule: React.FC<FinancialModuleProps> = ({ onBack }) => {
    const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
    const [financialData, setFinancialData] = useState<FinancialData>(INITIAL_FINANCIAL_DATA);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'model',
            text: '¡Hola! Soy tu CFO Virtual. Mi misión es ayudarte a hacer un **cierre de mes financiero** impecable y estratégico.\n\nPara empezar, necesito entender la realidad de tu negocio este mes. ¿Tienes reportes de ventas, anuncios o bancos? Sube uno o varios archivos (Excel, CSV) y yo me encargo de cruzarlos.\n\nSi no, podemos hacerlo paso a paso. ¿Por dónde prefieres empezar?',
            timestamp: new Date()
        }
    ]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState("Procesando...");
    const [showChatOnDashboard, setShowChatOnDashboard] = useState(true);

    const handleSendMessage = async (text: string, files?: File[]) => {
        // 1. Add user message
        const userMsg: Message = {
            id: generateId(),
            role: 'user',
            text: text,
            timestamp: new Date()
        };

        if (files && files.length > 0) {
            const fileNames = files.map(f => f.name).join(', ');
            userMsg.text = `${text} \n\n📎 Adjunto: ${files.length} archivo(s) [${fileNames}]`;
        }

        setMessages(prev => [...prev, userMsg]);
        setIsAiLoading(true);

        // Dynamic Loading Status
        if (files && files.length > 0) {
            setLoadingStatus(`Auditando ${files.length} documento(s) y estructurando datos...`);
        } else {
            setLoadingStatus("Analizando datos financieros...");
        }

        try {
            // 2. Prepare history for Gemini
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            // 3. Call Service
            const response = await sendMessageToGemini(history, text, files);

            setLoadingStatus("Calculando rentabilidad y estrategias...");

            // 4. Update Financial Data if structured data returned
            if (response.data) {
                setFinancialData(prev => ({ ...prev, ...response.data }));

                // STRICT CHECK: Only go to dashboard if the model says data is complete
                if (response.data.isComplete) {
                    setAppState(AppState.DASHBOARD);
                }
            }

            // 5. Add Model Message
            const modelMsg: Message = {
                id: generateId(),
                role: 'model',
                text: response.text,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, modelMsg]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: generateId(),
                role: 'model',
                text: 'Lo siento, tuve un problema procesando tu solicitud. Por favor revisa el formato de tus archivos o intenta de nuevo.',
                timestamp: new Date()
            }]);
        } finally {
            setIsAiLoading(false);
            setLoadingStatus("");
        }
    };

    return (
        <div className="h-full w-full bg-[#0f1115] text-white overflow-hidden">
            {appState === AppState.ONBOARDING ? (
                <div className="h-full flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-6xl h-[80vh] flex shadow-2xl rounded-3xl overflow-hidden border border-gray-800 bg-[#181b21]">
                        {/* Left Side: Welcome Info */}
                        <div className="hidden md:flex w-1/2 bg-[#181b21] p-12 flex-col justify-between relative overflow-hidden border-r border-gray-800">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500"></div>
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

                            <div>
                                {onBack && (
                                    <button
                                        onClick={onBack}
                                        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
                                    >
                                        <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
                                        Volver al Hub
                                    </button>
                                )}
                                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    Cierre de Mes IA
                                </h1>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    Tu CFO virtual para el análisis de rentabilidad. Sube tus reportes y obtén un diagnóstico financiero claro y un plan de acción estratégico.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-gray-300">
                                    <div className="p-3 bg-gray-800 rounded-lg text-blue-400"><FileSpreadsheet /></div>
                                    <div>
                                        <p className="font-semibold text-sm">Sube Múltiples Archivos</p>
                                        <p className="text-xs text-gray-500">Cruza Ventas, Bancos y Ads automáticamente</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-300">
                                    <div className="p-3 bg-gray-800 rounded-lg text-teal-400"><MessageCircle /></div>
                                    <div>
                                        <p className="font-semibold text-sm">Análisis por Bloques</p>
                                        <p className="text-xs text-gray-500">Ingresos, COGS, OPEX, Caja</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Chat */}
                        <div className="w-full md:w-1/2 h-full bg-[#0f1115]">
                            <ChatInterface
                                messages={messages}
                                onSendMessage={handleSendMessage}
                                isLoading={isAiLoading}
                                loadingStatus={loadingStatus}
                                className="h-full"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-full overflow-hidden relative">
                    {/* Main Dashboard Area */}
                    <div className={`flex-1 overflow-y-auto bg-[#0f1115] transition-all duration-300 ${showChatOnDashboard ? 'mr-0 lg:mr-[400px]' : ''}`}>
                        <Dashboard data={financialData} />
                    </div>

                    {/* Fixed Chat Sidebar for Dashboard Mode */}
                    <div className={`fixed right-0 top-0 bottom-0 w-full lg:w-[400px] bg-[#181b21] border-l border-gray-800 shadow-2xl transform transition-transform duration-300 z-30 ${showChatOnDashboard ? 'translate-x-0' : 'translate-x-full'}`}>
                        <ChatInterface
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isLoading={isAiLoading}
                            loadingStatus={loadingStatus}
                            isMinimized={true}
                            className="h-full"
                        />
                        {/* Toggle Button */}
                        <button
                            onClick={() => setShowChatOnDashboard(false)}
                            className="absolute top-1/2 -left-10 bg-[#181b21] p-2 rounded-l-xl border-y border-l border-gray-800 text-gray-400 hover:text-white lg:hidden"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    {/* Floating Chat Button (when chat is hidden) */}
                    {!showChatOnDashboard && (
                        <button
                            onClick={() => setShowChatOnDashboard(true)}
                            className="fixed bottom-8 right-8 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl shadow-blue-600/30 transition-all z-40 animate-bounce"
                        >
                            <MessageCircle size={28} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
