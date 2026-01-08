import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Globe, Camera, Youtube, Facebook, Instagram } from 'lucide-react';

// Mock Data for Age & Gender
const AGE_GENDER_DATA = [
    { name: '18-24', male: 4000, female: 2400 },
    { name: '25-34', male: 3000, female: 1398 },
    { name: '35-44', male: 2000, female: 9800 },
    { name: '45-54', male: 2780, female: 3908 },
    { name: '55+', male: 1890, female: 4800 },
];

const FORMAT_DATA = [
    { name: 'Video', value: 8230, max: 10000 },
    { name: 'Imagen', value: 4510, max: 10000 },
    { name: 'Carrusel', value: 2180, max: 10000 },
    { name: 'Colección', value: 970, max: 10000 },
];

const PLATFORM_DATA = [
    { name: 'Facebook', placements: 'Feed, Stories, Messenger', value: 9850, icon: Facebook },
    { name: 'Instagram', placements: 'Feed, Stories, Reels', value: 4320, icon: Instagram },
    { name: 'YouTube', placements: 'In-stream, Shorts', value: 2100, icon: Youtube },
];

export const BreakdownModule: React.FC = () => {
    const [activeMetric, setActiveMetric] = useState<'spend' | 'cpa' | 'roas'>('spend');

    return (
        <div className="w-full mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">Breakdowns — Distribución del rendimiento</h3>

                <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-1 border border-white/10">
                    <span className="text-xs text-slate-400 px-3 font-medium">Breakdown by</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setActiveMetric('spend')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeMetric === 'spend' ? 'bg-[#c6ef4e] text-black shadow-[0_0_10px_rgba(198,239,78,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Spend
                        </button>
                        <button
                            onClick={() => setActiveMetric('cpa')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeMetric === 'cpa' ? 'bg-[#c6ef4e] text-black shadow-[0_0_10px_rgba(198,239,78,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            CPA
                        </button>
                        <button
                            onClick={() => setActiveMetric('roas')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeMetric === 'roas' ? 'bg-[#c6ef4e] text-black shadow-[0_0_10px_rgba(198,239,78,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            ROAS
                        </button>
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Card 1: Formato */}
                <div className="glass-panel p-6">
                    <h4 className="text-lg font-bold text-white mb-6">Formato</h4>
                    <div className="space-y-6">
                        {FORMAT_DATA.map((item) => (
                            <div key={item.name} className="relative z-10">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-300 font-medium">{item.name}</span>
                                    <span className="text-white font-bold">${item.value.toLocaleString()}</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-slate-300 rounded-full"
                                        style={{ width: `${(item.value / item.max) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card 2: Edad & Género */}
                <div className="glass-panel p-6">
                    <h4 className="text-lg font-bold text-white mb-6">Edad & Género</h4>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={AGE_GENDER_DATA} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ fontSize: '12px' }}
                                    labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-slate-400 text-xs ml-1">{value}</span>}
                                />
                                <Bar dataKey="male" name="Masculino" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} barSize={12} />
                                <Bar dataKey="female" name="Femenino" stackId="a" fill="#EC4899" radius={[4, 4, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Card 3: Plataforma */}
                <div className="glass-panel p-6">
                    <h4 className="text-lg font-bold text-white mb-6">Plataforma</h4>
                    <div className="space-y-0">
                        {PLATFORM_DATA.map((item, index) => (
                            <div key={item.name} className={`flex items-center justify-between group cursor-pointer py-4 ${index !== PLATFORM_DATA.length - 1 ? 'border-b border-white/5' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#c6ef4e]/30 group-hover:bg-[#c6ef4e]/10 transition-colors">
                                        <item.icon size={20} className="text-slate-400 group-hover:text-[#c6ef4e] transition-colors" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">{item.name}</div>
                                        <div className="text-slate-500 text-xs">{item.placements}</div>
                                    </div>
                                </div>
                                <div className="text-white font-bold">
                                    ${item.value.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
