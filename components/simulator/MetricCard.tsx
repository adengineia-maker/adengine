import React from 'react';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string;
    trend: number;
    trendLabel?: string; // e.g. "vs last month"
    icon?: React.ElementType; // Optional icon
    color?: string; // Optional accent color override
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, trendLabel, icon: Icon, color }) => {
    const isPositive = trend >= 0;

    return (
        <div className="glass-panel p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_20px_rgba(198,239,78,0.15)]">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="p-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner group-hover:shadow-[0_0_10px_rgba(198,239,78,0.3)] transition-shadow">
                            <Icon size={18} className="text-slate-300 group-hover:text-[#c6ef4e] transition-colors" />
                        </div>
                    )}
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide group-hover:text-slate-200 transition-colors">{title}</h3>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Main Value */}
            <div className="mb-4">
                <span className="text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">{value}</span>
            </div>

            {/* Footer / Trend */}
            <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${isPositive ? 'bg-[#c6ef4e]/10 text-[#c6ef4e] border-[#c6ef4e]/20 shadow-[0_0_10px_rgba(198,239,78,0.2)]' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    <span>{Math.abs(trend)}%</span>
                </div>
                {trendLabel && <span className="text-xs text-slate-500">{trendLabel}</span>}
            </div>

            {/* Decorative Glow on Hover */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#c6ef4e] rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none -mr-16 -mt-16"></div>
        </div>
    );
};
