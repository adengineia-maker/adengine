import React, { useState, useEffect } from 'react';
import { ChatInterface, Message } from './ChatInterface';
import { ChatLayout } from './ChatLayout';
import { ChatSession } from './Sidebar';
import { Zap, Lightbulb, PenTool } from 'lucide-react';

interface AICreativeAgentProps {
    initialData: {
        product: string;
        countries: string[];
        objective: string;
        links: string;
    };
}

export const AICreativeAgent: React.FC<AICreativeAgentProps> = ({ initialData }) => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSending, setIsSending] = useState(false);
    const hasStartedRef = React.useRef(false);

    // Load sessions from localStorage on mount
    useEffect(() => {
        const savedSessions = localStorage.getItem('creative_chat_sessions');
        if (savedSessions) {
            try {
                const parsed = JSON.parse(savedSessions);
                // Convert date strings back to Date objects
                const hydrated = parsed.map((s: any) => ({
                    ...s,
                    date: new Date(s.date),
                    messages: s.messages.map((m: any) => ({
                        ...m,
                        timestamp: new Date(m.timestamp)
                    }))
                }));
                setSessions(hydrated);
            } catch (e) {
                console.error("Failed to parse sessions", e);
            }
        }
    }, []);

    // Save sessions to localStorage whenever they change
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('creative_chat_sessions', JSON.stringify(sessions));
        }
    }, [sessions]);

    // Initialize chat logic
    useEffect(() => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        const startChat = async () => {
            // Check if we have actual initial data
            const hasInitialData = initialData.product && initialData.product.trim() !== '';

            if (!hasInitialData) {
                // Start a new empty session
                createNewSession();
                return;
            }

            // Start a new session with initial data
            const newSessionId = Date.now().toString();
            const initialText = `Hola, quiero iniciar un proceso creativo con estos datos:

Producto: ${initialData.product}
Países: ${initialData.countries.join(', ')}
Objetivo: ${initialData.objective}
Links: ${initialData.links}`;

            const userMsg: Message = {
                id: 'init-user',
                role: 'user',
                content: initialText,
                timestamp: new Date()
            };

            // Create session immediately
            const newSession: ChatSession = {
                id: newSessionId,
                title: initialData.product || "Nuevo Proyecto",
                date: new Date(),
                messages: [userMsg],
                isSaved: false
            };

            setSessions(prev => [newSession, ...prev]);
            setCurrentSessionId(newSessionId);
            setMessages([userMsg]);
            setIsSending(true);

            try {
                const response = await fetch('https://n8n.srv1155618.hstgr.cloud/webhook/proceso-creativo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ chatInput: initialText }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const botResponse = data.output || data.text || "Recibido. ¿En qué puedo ayudarte específicamente con esto?";

                const agentMsg: Message = {
                    id: 'init-agent',
                    role: 'agent',
                    content: botResponse,
                    timestamp: new Date()
                };

                // Update session with agent response
                setMessages(prev => [...prev, agentMsg]);
                setSessions(prev => prev.map(s =>
                    s.id === newSessionId
                        ? { ...s, messages: [...s.messages, agentMsg] }
                        : s
                ));

            } catch (error) {
                console.error("Error sending initial message:", error);
                const errorMsg: Message = {
                    id: 'init-error',
                    role: 'agent',
                    content: "Hubo un problema al iniciar la conversación con el servidor.",
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMsg]);
                setSessions(prev => prev.map(s =>
                    s.id === newSessionId
                        ? { ...s, messages: [...s.messages, errorMsg] }
                        : s
                ));
            } finally {
                setIsSending(false);
            }
        };

        startChat();
    }, [initialData]);

    const createNewSession = () => {
        const newSessionId = Date.now().toString();
        const welcomeMsg: Message = {
            id: 'init-agent',
            role: 'agent',
            content: "¡Hola! Soy tu agente creativo. ¿En qué proyecto estamos trabajando hoy? Cuéntame sobre el producto o el objetivo.",
            timestamp: new Date()
        };

        const newSession: ChatSession = {
            id: newSessionId,
            title: "Nuevo Chat",
            date: new Date(),
            messages: [welcomeMsg],
            isSaved: false
        };

        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSessionId);
        setMessages([welcomeMsg]);
    };

    const handleSelectSession = (id: string) => {
        const session = sessions.find(s => s.id === id);
        if (session) {
            setCurrentSessionId(id);
            setMessages(session.messages);
        }
    };

    const handleToggleSave = (id: string) => {
        setSessions(prev => prev.map(s =>
            s.id === id ? { ...s, isSaved: !s.isSaved } : s
        ));
    };

    const handleDeleteSession = (id: string) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        if (currentSessionId === id) {
            // If we deleted the current session, switch to another or create new
            const remaining = sessions.filter(s => s.id !== id);
            if (remaining.length > 0) {
                handleSelectSession(remaining[0].id);
            } else {
                createNewSession();
            }
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!currentSessionId) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };

        // Update local state and session
        setMessages(prev => [...prev, newMessage]);
        setSessions(prev => prev.map(s => {
            if (s.id === currentSessionId) {
                // Update title if it's the first user message and title is generic
                const newTitle = (s.messages.length <= 1 && s.title === "Nuevo Chat")
                    ? (text.length > 30 ? text.substring(0, 30) + "..." : text)
                    : s.title;

                return {
                    ...s,
                    messages: [...s.messages, newMessage],
                    title: newTitle,
                    date: new Date() // Update timestamp to move to top
                };
            }
            return s;
        }));

        setIsSending(true);

        try {
            const response = await fetch('https://n8n.srv1155618.hstgr.cloud/webhook/proceso-creativo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ chatInput: text }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botResponse = data.output || data.text || "Respuesta recibida sin contenido de texto.";

            const agentMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'agent',
                content: botResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, agentMsg]);
            setSessions(prev => prev.map(s =>
                s.id === currentSessionId
                    ? { ...s, messages: [...s.messages, agentMsg] }
                    : s
            ));

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'agent',
                content: "Lo siento, hubo un error al conectar con el servidor. Por favor intenta de nuevo.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
            setSessions(prev => prev.map(s =>
                s.id === currentSessionId
                    ? { ...s, messages: [...s.messages, errorMsg] }
                    : s
            ));
        } finally {
            setIsSending(false);
        }
    };

    return (
        <ChatLayout
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={createNewSession}
            onToggleSave={handleToggleSave}
            onDeleteSession={handleDeleteSession}
        >
            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isAnalyzing={isSending}
                agentName="Creative Agent"
                placeholder="Pide guiones, variaciones de hooks o nuevas ideas..."
                loadingText="Escribiendo..."
            />
        </ChatLayout>
    );
};
