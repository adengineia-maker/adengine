import React, { useState } from 'react';
import { Sidebar, ChatSession } from './Sidebar';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { GEMINI_THEME } from './Theme';

interface ChatLayoutProps {
    children: React.ReactNode;
    sessions: ChatSession[];
    currentSessionId: string | null;
    onSelectSession: (id: string) => void;
    onNewChat: () => void;
    onToggleSave: (id: string) => void;
    onDeleteSession: (id: string) => void;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
    children,
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    onToggleSave,
    onDeleteSession
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-full w-full overflow-hidden" style={{ backgroundColor: GEMINI_THEME.colors.background }}>
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={onSelectSession}
                onNewChat={onNewChat}
                onToggleSave={onToggleSave}
                onDeleteSession={onDeleteSession}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative min-w-0">

                {/* Top Bar / Toggle Button */}
                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-full hover:bg-[#2D2E35] text-[#9CA3AF] hover:text-[#E3E3E3] transition-colors"
                    >
                        {isSidebarOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 h-full relative">
                    {children}
                </div>
            </div>
        </div>
    );
};
