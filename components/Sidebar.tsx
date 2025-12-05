import React from 'react';
import { MessageSquare, Star, Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import { GEMINI_THEME } from './Theme';
import { Message } from './ChatInterface';

export interface ChatSession {
    id: string;
    title: string;
    date: Date;
    messages: Message[];
    isSaved: boolean; // true = Saved Project, false = Recent
}

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    sessions: ChatSession[];
    currentSessionId: string | null;
    onSelectSession: (id: string) => void;
    onNewChat: () => void;
    onToggleSave: (id: string) => void;
    onDeleteSession: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onToggle,
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    onToggleSave,
    onDeleteSession
}) => {
    const savedProjects = sessions.filter(s => s.isSaved);
    const recentChats = sessions.filter(s => !s.isSaved).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!isOpen) return null;

    return (
        <div
            className={`h-full flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'w-[280px]' : 'w-0'} overflow-hidden shrink-0 border-r border-white/5`}
            style={{ backgroundColor: GEMINI_THEME.colors.sidebar }}
        >
            {/* New Chat Button */}
            <div className="p-4">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-full transition-colors duration-200 hover:bg-[#2D2E35] text-[#E3E3E3] bg-[#1A1A1C] shadow-sm"
                >
                    <Plus size={20} className="text-[#9CA3AF]" />
                    <span className="text-sm font-medium">Nuevo chat</span>
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar scrollbar-hide">

                {/* Saved Projects */}
                {savedProjects.length > 0 && (
                    <div className="mb-6">
                        <h3 className="px-3 mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: GEMINI_THEME.colors.textSecondary }}>
                            Proyectos Guardados
                        </h3>
                        <div className="space-y-1">
                            {savedProjects.map((session) => (
                                <div key={session.id} className="group relative flex items-center">
                                    <button
                                        onClick={() => onSelectSession(session.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${currentSessionId === session.id ? 'bg-[#2D2E35] text-white' : 'text-[#E3E3E3] hover:bg-[#2D2E35]/50'}`}
                                    >
                                        <Star size={16} className="text-[#A8C7FA] fill-[#A8C7FA] transition-colors" />
                                        <span className="truncate flex-1">{session.title}</span>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onToggleSave(session.id); }}
                                        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-white text-gray-400"
                                        title="Quitar de guardados"
                                    >
                                        <Star size={12} className="fill-transparent" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent History */}
                <div>
                    <h3 className="px-3 mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: GEMINI_THEME.colors.textSecondary }}>
                        Recientes
                    </h3>
                    <div className="space-y-1">
                        {recentChats.map((session) => (
                            <div key={session.id} className="group relative flex items-center">
                                <button
                                    onClick={() => onSelectSession(session.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${currentSessionId === session.id ? 'bg-[#2D2E35] text-white' : 'text-[#E3E3E3] hover:bg-[#2D2E35]/50'}`}
                                >
                                    <MessageSquare size={16} className="text-[#9CA3AF] group-hover:text-white transition-colors" />
                                    <span className="truncate flex-1">{session.title}</span>
                                </button>
                                <div className="absolute right-1 flex opacity-0 group-hover:opacity-100 bg-[#1E1F20] shadow-[-10px_0_10px_#1E1F20]">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onToggleSave(session.id); }}
                                        className="p-1.5 hover:text-[#A8C7FA] text-gray-500 transition-colors"
                                        title="Guardar proyecto"
                                    >
                                        <Star size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                                        className="p-1.5 hover:text-red-400 text-gray-500 transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {recentChats.length === 0 && (
                            <div className="px-3 py-4 text-xs text-gray-500 italic text-center">
                                No hay chats recientes
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User / Settings (Bottom) */}
            <div className="p-4 mt-auto border-t border-[#2D2E35]">
                <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#2D2E35] transition-colors text-sm text-[#E3E3E3]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                        V
                    </div>
                    <div className="flex-1 text-left">
                        <div className="font-medium">Valentina</div>
                        <div className="text-xs text-[#9CA3AF]">Pro Plan</div>
                    </div>
                    <MoreHorizontal size={16} className="text-[#9CA3AF]" />
                </button>
            </div>
        </div>
    );
};
