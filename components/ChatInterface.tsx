import React, { useState, useEffect, useRef } from 'react';
import { Send, Copy, RotateCcw, Plus, Mic, Sparkles, User } from 'lucide-react';
import { GEMINI_THEME } from './Theme';

export interface Message {
    id: string;
    role: 'system' | 'user' | 'agent';
    content: React.ReactNode;
    timestamp: Date;
    type?: 'text' | 'analysis-block';
}

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    isAnalyzing: boolean;
    agentName?: string;
    loadingText?: string;
    placeholder?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    onSendMessage,
    isAnalyzing,
    agentName = 'Antigravity',
    placeholder = 'Escribe para profundizar, ajustar o preguntar...',
    loadingText = 'Antigravity está pensando...'
}) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAnalyzing]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        onSendMessage(inputValue);
        setInputValue('');
    };

    return (
        <div className="flex flex-col h-full w-full font-sans relative overflow-hidden animate-in fade-in duration-700" style={{ backgroundColor: GEMINI_THEME.colors.background, color: GEMINI_THEME.colors.textPrimary }}>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 pt-8 pb-32 custom-scrollbar w-full">
                <div className="max-w-5xl mx-auto space-y-8">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-4 animate-in slide-in-from-bottom-2 fade-in duration-500 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Agent Avatar */}
                            {msg.role === 'agent' && (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg mt-1" style={{ backgroundColor: GEMINI_THEME.colors.sidebar }}>
                                    <Sparkles size={16} className="text-[#A8C7FA]" />
                                </div>
                            )}

                            {/* Message Card */}
                            <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start w-full'}`}>
                                <div
                                    className={`text-base leading-relaxed p-4 rounded-2xl shadow-sm transition-all hover:shadow-md ${msg.role === 'user'
                                        ? 'bg-[#2D2E35] text-[#E3E3E3] rounded-tr-sm'
                                        : 'bg-transparent text-[#E3E3E3] px-0 py-0' // Agent messages are cleaner, no background bubble usually in Gemini for long text, but let's keep it simple or follow the "bubble" request. 
                                        // Actually Gemini often has no bubble for AI, just text. But user asked for "burbujas de chat". Let's stick to bubbles for now but make them subtle.
                                        }`}
                                    style={msg.role === 'user' ? { backgroundColor: GEMINI_THEME.colors.active } : {}}
                                >
                                    {msg.content}
                                </div>

                                {/* Agent Actions (Hover) */}
                                {msg.role === 'agent' && (
                                    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button className="p-1.5 hover:bg-[#282A2C] rounded-full text-gray-500 hover:text-white transition-colors" title="Copiar">
                                            <Copy size={14} />
                                        </button>
                                        <button className="p-1.5 hover:bg-[#282A2C] rounded-full text-gray-500 hover:text-white transition-colors" title="Regenerar">
                                            <RotateCcw size={14} />
                                        </button>
                                        <span className="text-[10px] text-gray-600 ml-2">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* User Avatar */}
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-[#282A2C] flex items-center justify-center shrink-0 mt-1">
                                    <User size={16} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Analysis/Thinking Indicator */}
                    {isAnalyzing && (
                        <div className="flex gap-4 animate-in fade-in duration-300">
                            <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center shrink-0" />
                            <div className="flex items-center gap-2 text-gray-400 text-sm ml-1 px-4 py-2 rounded-full" style={{ backgroundColor: GEMINI_THEME.colors.sidebar }}>
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-[#A8C7FA] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-[#A8C7FA] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-[#A8C7FA] rounded-full animate-bounce"></span>
                                </div>
                                <span className="animate-pulse font-medium text-xs">{loadingText}</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area - Fixed Bottom */}
            <div className="absolute bottom-0 left-0 w-full pt-10 pb-6 px-6" style={{ background: `linear-gradient(to top, ${GEMINI_THEME.colors.background} 80%, transparent)` }}>
                <div className="max-w-5xl mx-auto relative">
                    <div
                        className="rounded-[24px] flex items-end p-2 shadow-2xl border border-transparent transition-all duration-300 focus-within:border-[#E3E3E3]/20 focus-within:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        style={{ backgroundColor: GEMINI_THEME.colors.inputBg }}
                    >

                        <button className="p-3 text-gray-400 hover:text-white hover:bg-[#2D2E35] rounded-full transition-colors mb-0.5">
                            <Plus size={20} />
                        </button>

                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={placeholder}
                            className="flex-1 bg-transparent border-none outline-none text-[#E3E3E3] placeholder-gray-500 px-3 py-3.5 text-base min-h-[52px] max-h-[150px] resize-none custom-scrollbar"
                            rows={1}
                            style={{ height: 'auto', overflow: 'hidden' }}
                        />

                        <div className="flex items-center gap-1 mb-0.5">
                            <button className="p-3 text-gray-400 hover:text-white hover:bg-[#2D2E35] rounded-full transition-colors">
                                <Mic size={20} />
                            </button>

                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className={`p-3 rounded-full transition-all duration-200 ml-1 ${inputValue.trim()
                                    ? 'text-black hover:scale-105'
                                    : 'text-gray-500 cursor-not-allowed'
                                    }`}
                                style={inputValue.trim() ? { backgroundColor: GEMINI_THEME.colors.textPrimary } : { backgroundColor: 'transparent' }}
                            >
                                <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
                            </button>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-[10px] text-gray-600 font-medium tracking-wide">
                            ANTIGRAVITY AI • CONFIDENTIAL
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
