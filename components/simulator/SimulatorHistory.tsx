import React from 'react';
import { SimulationSession } from '../../types';
import { History, ArrowRight, Trash2 } from 'lucide-react';
import { Card } from './ui/Card';

interface SimulatorHistoryProps {
    sessions: SimulationSession[];
    onSelectSession: (session: SimulationSession) => void;
    onDeleteSession: (id: string) => void;
}

export const SimulatorHistory: React.FC<SimulatorHistoryProps> = ({
    sessions,
    onSelectSession,
    onDeleteSession
}) => {
    if (sessions.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                <History className="mx-auto mb-3 opacity-50" size={32} />
                <p>No hay simulaciones guardadas.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {sessions.map((session) => (
                <div
                    key={session.id}
                    className="group bg-slate-900/50 border border-slate-800 hover:border-primary-500/50 rounded-lg p-4 transition-all cursor-pointer relative"
                    onClick={() => onSelectSession(session)}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-medium text-slate-200 group-hover:text-primary-400 transition-colors">
                                {session.name}
                            </h4>
                            <span className="text-xs text-slate-500">{new Date(session.date).toLocaleDateString()}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession(session.id);
                            }}
                            className="text-slate-600 hover:text-rose-500 p-1 rounded transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <div className="bg-slate-950 p-2 rounded border border-slate-800/50">
                            <span className="block text-[10px] uppercase tracking-wider opacity-70">Proyección</span>
                            <span className="font-mono text-slate-200">${session.projectedResults.revenue.toLocaleString()}</span>
                        </div>
                        {session.actualResults ? (
                            <div className="bg-slate-950 p-2 rounded border border-slate-800/50">
                                <span className="block text-[10px] uppercase tracking-wider opacity-70 text-emerald-400">Real</span>
                                <span className="font-mono text-emerald-400">${session.actualResults.revenue.toLocaleString()}</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center text-slate-600 italic">
                                Sin datos reales
                            </div>
                        )}
                    </div>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-primary-500">
                        <ArrowRight size={20} />
                    </div>
                </div>
            ))}
        </div>
    );
};
