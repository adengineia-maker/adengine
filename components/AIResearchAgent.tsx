import React, { useState, useEffect } from 'react';
import { ChatInterface, Message } from './ChatInterface';
import { Globe, Users, Lightbulb } from 'lucide-react';

interface AIResearchAgentProps {
    initialData: {
        product: string;
        countries: string[];
        objective: string;
        links: string;
    };
}

export const AIResearchAgent: React.FC<AIResearchAgentProps> = ({ initialData }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(true);

    useEffect(() => {
        // Initial System Message
        const initialMessage: Message = {
            id: 'init-1',
            role: 'agent',
            timestamp: new Date(),
            content: (
                <div className="space-y-4">
                    <p className="text-lg font-medium">
                        Entendido. He recibido el contexto para <span className="text-[#B8F30B]">{initialData.product || 'el producto'}</span>.
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                        {initialData.countries.length > 0 && (
                            <span className="bg-[#2A2A2A] px-3 py-1 rounded-full border border-white/5">
                                🌍 {initialData.countries.join(', ')}
                            </span>
                        )}
                        {initialData.objective && (
                            <span className="bg-[#2A2A2A] px-3 py-1 rounded-full border border-white/5">
                                🎯 {initialData.objective}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-300">Enviando datos al agente de investigación...</p>
                </div>
            )
        };

        setMessages([initialMessage]);
        setIsAnalyzing(true); // Keep analyzing to simulate n8n webhook running

    }, [initialData]);

    const handleSendMessage = (text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setIsAnalyzing(true);

        // Simulate simple response for now
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'agent',
                content: "Entendido. Estoy procesando tu solicitud para refinar el análisis. ¿Hay algún competidor específico que quieras que revise?",
                timestamp: new Date()
            }]);
            setIsAnalyzing(false);
        }, 1500);
    };

    return (
        <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isAnalyzing={isAnalyzing}
            agentName="Research Agent"
            placeholder="Pregunta sobre competidores, tendencias o ajusta el objetivo..."
        />
    );
};
