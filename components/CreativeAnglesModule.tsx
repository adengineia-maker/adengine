import React, { useState } from 'react';
import { ArrowUpDown, Info, ChevronRight } from 'lucide-react';

// Mock Data
const ANGLES_DATA = [
    { id: 1, name: 'Ángulo 1', roas: 4.2, cpa: 12.50, spend: 5400, conversions: 432, cvr: '2.1%' },
    { id: 2, name: 'Ángulo 2', roas: 3.8, cpa: 15.20, spend: 8200, conversions: 539, cvr: '1.8%' },
    { id: 3, name: 'Ángulo 3', roas: 3.5, cpa: 18.40, spend: 3100, conversions: 168, cvr: '1.5%' },
    { id: 4, name: 'Ángulo 4', roas: 2.9, cpa: 22.10, spend: 6700, conversions: 303, cvr: '1.2%' },
    { id: 5, name: 'Ángulo 5', roas: 2.1, cpa: 28.50, spend: 2200, conversions: 77, cvr: '0.9%' },
    { id: 6, name: 'Ángulo 6', roas: 1.8, cpa: 35.00, spend: 1500, conversions: 42, cvr: '0.7%' },
];

export const CreativeAnglesModule: React.FC = () => {
    const [sortBy, setSortBy] = useState<'roas' | 'cpa'>('roas');
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    // Sort data
    const sortedData = [...ANGLES_DATA].sort((a, b) => {
        if (sortBy === 'roas') return b.roas - a.roas;
        return b.cpa - a.cpa; // High CPA is usually bad, but for sorting "by CPA" usually means highest first to see expensive ones
    });

    const maxRoas = Math.max(...ANGLES_DATA.map(d => d.roas));
    const maxCpa = Math.max(...ANGLES_DATA.map(d => d.cpa));

    return (
        <div className="w-full bg-[#202020] rounded-[24px] p-8 mt-8 shadow-sm border border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-1">Ángulos Creativos por Rendimiento</h3>
                    <p className="text-slate-400 text-sm">Comparación de retorno y costo por mensaje publicitario</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#1A1D19] rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setSortBy('roas')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${sortBy === 'roas' ? 'bg-[#D1F80C] text-black' : 'text-slate-400 hover:text-white'}`}
                        >
                            ROAS <ArrowUpDown size={12} />
                        </button>
                        <button
                            onClick={() => setSortBy('cpa')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${sortBy === 'cpa' ? 'bg-[#D1F80C] text-black' : 'text-slate-400 hover:text-white'}`}
                        >
                            CPA <ArrowUpDown size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-6 mb-4 text-xs text-slate-400 px-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#D1F80C]"></div>
                    <span className="font-medium text-white">ROAS (Retorno)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#B7A000]"></div>
                    <span className="font-medium text-white">CPA (Costo)</span>
                </div>
            </div>

            {/* Chart Rows */}
            <div className="space-y-3">
                {sortedData.map((item) => (
                    <div
                        key={item.id}
                        className="group relative grid grid-cols-12 gap-4 items-center p-4 rounded-xl hover:bg-[#2A2D29] transition-all cursor-pointer border border-transparent hover:border-white/5"
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        {/* Tooltip */}
                        {hoveredId === item.id && (
                            <div className="absolute left-1/2 -translate-x-1/2 -top-16 z-20 bg-[#1A1D19] border border-white/10 p-3 rounded-lg shadow-xl flex gap-6 min-w-[300px] animate-in fade-in zoom-in-95 duration-200">
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Inversión</div>
                                    <div className="text-sm font-bold text-white">${item.spend.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Conversiones</div>
                                    <div className="text-sm font-bold text-white">{item.conversions}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">CVR</div>
                                    <div className="text-sm font-bold text-white">{item.cvr}</div>
                                </div>
                            </div>
                        )}

                        {/* Label */}
                        <div className="col-span-3 md:col-span-2">
                            <span className="text-sm font-bold text-white group-hover:text-[#D1F80C] transition-colors">
                                {item.name}
                            </span>
                        </div>

                        {/* Bars Area */}
                        <div className="col-span-9 md:col-span-10 flex items-center gap-4 h-8">

                            {/* ROAS Bar (Left/Center aligned effectively) */}
                            <div className="flex-1 flex items-center justify-end gap-2">
                                <span className="text-xs font-bold text-[#D1F80C] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {item.roas.toFixed(1)} ROAS
                                </span>
                                <div
                                    className="h-6 rounded-l-md bg-[#D1F80C] transition-all duration-500 relative group-hover:shadow-[0_0_15px_rgba(209,248,12,0.3)]"
                                    style={{ width: `${(item.roas / maxRoas) * 100}%`, minWidth: '4px' }}
                                ></div>
                            </div>

                            {/* Divider */}
                            <div className="w-[1px] h-full bg-white/10"></div>

                            {/* CPA Bar (Right aligned) */}
                            <div className="flex-1 flex items-center justify-start gap-2">
                                <div
                                    className="h-4 rounded-r-md bg-[#B7A000] transition-all duration-500 opacity-80 group-hover:opacity-100"
                                    style={{ width: `${(item.cpa / maxCpa) * 100}%`, minWidth: '4px' }}
                                ></div>
                                <span className="text-xs font-medium text-[#B7A000] opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ${item.cpa.toFixed(2)}
                                </span>
                            </div>

                        </div>

                        {/* Chevron for affordance */}
                        <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                            <ChevronRight size={16} />
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};
