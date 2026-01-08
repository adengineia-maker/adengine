import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../types/financialTypes';
import { Send, Paperclip, Bot, X, FileText, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (text: string, files?: File[]) => void;
    isLoading: boolean;
    loadingStatus?: string;
    isMinimized?: boolean;
    className?: string;
}

// Gemini-style Thinking Indicator
const ThinkingIndicator = () => {
    const [step, setStep] = useState(0);
    const steps = [
        "Leyendo estructura del archivo...",
        "Identificando Ingresos y Egresos...",
        "Calculando Márgenes y COGS...",
        "Cruzando datos de Marketing (ROAS/CAC)...",
        "Evaluando Flujo de Caja...",
        "Generando Estrategia CFO...",
        "Construyendo Dashboard..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % steps.length);
        }, 2000); // Change text every 2 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-2 p-4 max-w-[85%] bg-[#181b21] rounded-2xl rounded-bl-none border border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Sparkles size={18} className="text-blue-400 animate-spin-slow" />
                    <div className="absolute inset-0 bg-blue-500/50 blur-lg animate-pulse"></div>
                </div>
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 animate-pulse">
                    Analizando Datos Financieros
                </span>
            </div>
            <div className="flex items-center gap-2 ml-1">
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-0"></div>
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                <p className="text-xs text-gray-400 font-mono tracking-wide">
                    {steps[step]}
                </p>
            </div>
        </div>
    );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    onSendMessage,
    isLoading,
    loadingStatus = "Procesando...",
    isMinimized = false,
    className = ''
}) => {
    const [inputText, setInputText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((!inputText.trim() && selectedFiles.length === 0) || isLoading) return;

        onSendMessage(inputText, selectedFiles.length > 0 ? selectedFiles : undefined);
        setInputText('');
        setSelectedFiles([]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className={`flex flex-col bg-[#181b21] border-l border-gray-800 transition-all duration-300 ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-[#0f1115]/80 backdrop-blur-md flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20">
                        <Bot size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-100 text-sm md:text-base">AI CFO Assistant</h3>
                        <p className="text-[10px] text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Gemini 2.5 Active
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl p-4 shadow-md ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-[#232730] text-gray-200 rounded-bl-none border border-gray-700/50'
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap font-light">{msg.text}</p>
                            <span className="text-[10px] opacity-40 mt-2 block text-right">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Animated Loading State */}
                {isLoading && (
                    <div className="flex justify-start">
                        <ThinkingIndicator />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-800 bg-[#0f1115]">
                {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {selectedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-gray-800 border border-gray-700 p-2 rounded-lg animate-in fade-in slide-in-from-bottom-2 group">
                                <div className="p-1.5 bg-blue-500/10 rounded text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <FileText size={14} />
                                </div>
                                <span className="text-xs text-gray-300 truncate max-w-[120px]" title={file.name}>{file.name}</span>
                                <button
                                    onClick={() => removeFile(idx)}
                                    className="text-gray-500 hover:text-red-400 hover:bg-gray-700/50 p-1 rounded-full transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex gap-2 relative">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept=".csv,.xlsx,.xls,.pdf,.txt,image/*"
                        onChange={handleFileSelect}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center border border-transparent ${selectedFiles.length > 0
                                ? 'bg-blue-600/10 text-blue-400 border-blue-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                        title="Adjuntar archivos"
                    >
                        <Paperclip size={20} />
                        {selectedFiles.length > 0 && (
                            <span className="absolute -top-1 -left-1 text-[9px] font-bold bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                                {selectedFiles.length}
                            </span>
                        )}
                    </button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={isMinimized ? "Pregunta sobre tus datos..." : "Sube el archivo de ventas y pregunta..."}
                        className="flex-1 bg-[#1e2128] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-800 focus:border-blue-500/50 transition-all placeholder-gray-500 shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || (!inputText && selectedFiles.length === 0)}
                        className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};
