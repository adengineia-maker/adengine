import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './DashboardExecutive.css';

// Mock Data
const DATA = [
    { name: 'MM11-006-V1', spend: 2310000, cpa: 37220, img: 'https://placehold.co/60x60/202020/FFF?text=V1' },
    { name: 'MM11-IM15-V1', spend: 878920, cpa: 25850, img: 'https://placehold.co/60x60/333/FFF?text=V2' },
    { name: 'MM11-IM16-V1', spend: 561960, cpa: 22480, img: 'https://placehold.co/60x60/444/FFF?text=V3' },
    { name: 'MM11-IM17-V1', spend: 440050, cpa: 44010, img: 'https://placehold.co/60x60/555/FFF?text=V4' },
    { name: 'MM11-005-V1', spend: 206950, cpa: 34490, img: 'https://placehold.co/60x60/666/FFF?text=V5' },
    { name: 'MM11-004-V1', spend: 174180, cpa: 21770, img: 'https://placehold.co/60x60/777/FFF?text=V6' },
    { name: 'MM11-IM18-V1', spend: 164130, cpa: 27350, img: 'https://placehold.co/60x60/888/FFF?text=V7' },
    { name: 'MM11-IM12-V1', spend: 141980, cpa: 35490, img: 'https://placehold.co/60x60/999/FFF?text=V8' },
];

const CustomXAxisTick = ({ x, y, payload }: any) => {
    const dataPoint = DATA.find(d => d.name === payload.value);
    return (
        <g transform={`translate(${x},${y})`}>
            <foreignObject x={-30} y={0} width={60} height={80}>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-[50px] h-[50px] rounded-md overflow-hidden border border-white/10 shadow-sm mt-2 hover:scale-110 transition-transform cursor-pointer">
                        <img src={dataPoint?.img} alt={payload.value} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium truncate w-full text-center" title={payload.value}>
                        {payload.value}
                    </span>
                </div>
            </foreignObject>
        </g>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0a0a0a]/90 backdrop-blur-md p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/10 text-xs text-white">
                <p className="font-bold text-white mb-2">{label}</p>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#c6ef4e] shadow-[0_0_5px_#c6ef4e]"></div>
                    <span className="text-slate-400">Inversión:</span>
                    <span className="font-bold text-white">${payload[0].value.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0EA5E9] shadow-[0_0_5px_#0EA5E9]"></div>
                    <span className="text-slate-400">CPA:</span>
                    <span className="font-bold text-white">${payload[1].value.toLocaleString()}</span>
                </div>
            </div>
        );
    }
    return null;
};

export const TopSpendModule: React.FC = () => {
    return (
        <div className="w-full glass-panel p-8 mt-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-4">Mayor Inversión</h3>
                    <div className="flex items-center gap-6 border-b border-white/10 w-full md:w-auto">
                        <div className="pb-2 text-sm font-bold text-white relative">
                            Anuncios
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c6ef4e] shadow-[0_0_8px_#c6ef4e]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend & Sort Info */}
            <div className="flex items-center gap-6 mb-6 text-xs text-slate-400">
                <span>Ordenado por Inversión desc</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#c6ef4e] shadow-[0_0_5px_#c6ef4e]"></div>
                    <span>Inversión</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#0EA5E9] shadow-[0_0_5px_#0EA5E9]"></div>
                    <span>CPA</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DATA} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} barGap={0}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            tick={<CustomXAxisTick />}
                            height={80}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 11 }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 11 }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(198, 239, 78, 0.05)' }} // Subtle Neon Green highlight
                        />

                        {/* Spend Bar (Lime) */}
                        <Bar yAxisId="left" dataKey="spend" fill="#c6ef4e" radius={[4, 4, 0, 0]} barSize={20} className="drop-shadow-[0_0_4px_rgba(198,239,78,0.3)]" />

                        {/* CPA Bar (Teal) */}
                        <Bar yAxisId="right" dataKey="cpa" fill="#0EA5E9" radius={[4, 4, 0, 0]} barSize={20} className="drop-shadow-[0_0_4px_rgba(14,165,233,0.3)]" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
