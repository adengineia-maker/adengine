import React from 'react';
import { Info, Crosshair, ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, MousePointer, Eye, Percent, Activity, User } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import './DashboardExecutive.css';
import { TopSpendModule } from './TopSpendModule';
import { BreakdownModule } from './BreakdownModule';
import { CreativeAnglesModule } from './CreativeAnglesModule';
import { AIAlertsModule } from './AIAlertsModule';

// Mock data for charts (Current vs Previous period)
const CHART_DATA = [
    { current: 10, previous: 8 },
    { current: 15, previous: 12 },
    { current: 12, previous: 14 },
    { current: 20, previous: 16 },
    { current: 18, previous: 22 },
    { current: 25, previous: 20 },
    { current: 22, previous: 18 },
    { current: 30, previous: 25 },
    { current: 28, previous: 24 },
    { current: 35, previous: 30 },
];

interface AnalysisCardProps {
    title: string;
    value: string;
    trend: string;
    trendType: 'positive' | 'negative' | 'neutral';
    icon?: React.ElementType;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
    title,
    value,
    trend,
    trendType,
    icon: Icon
}) => {
    const isPositive = trendType === 'positive';
    const isNegative = trendType === 'negative';
    const trendColor = isPositive ? '#c6ef4e' : isNegative ? '#EF4444' : '#EAB308';

    return (
        <div className="glass-panel p-6 group relative overflow-hidden h-full flex flex-col justify-between hover:shadow-[0_0_20px_rgba(198,239,78,0.15)] transition-all duration-300">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none -mr-10 -mt-10"></div>

            {/* Header */}
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200 transition-colors">
                    <span className="text-sm font-medium">{title}</span>
                    <Info size={14} className="cursor-help hover:text-white transition-colors opacity-50 hover:opacity-100" />
                </div>
                <Crosshair size={16} className="text-slate-600 hover:text-[#c6ef4e] transition-colors cursor-pointer" />
            </div>

            {/* Value & Trend Badge */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
                    {value}
                </div>
                <div className={`
          px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 border
          ${isPositive ? 'bg-[#c6ef4e]/10 text-[#c6ef4e] border-[#c6ef4e]/20 shadow-[0_0_10px_rgba(198,239,78,0.2)]' : isNegative ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
        `}>
                    {trend}
                </div>
            </div>

            {/* Chart */}
            <div className="h-16 w-full mt-auto relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA}>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                padding: '8px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ fontSize: '12px', color: '#fff' }}
                            labelStyle={{ display: 'none' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        {/* Previous Period (Dashed) */}
                        <Line
                            type="monotone"
                            dataKey="previous"
                            stroke="#475569"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={false}
                            isAnimationActive={false}
                        />
                        {/* Current Period (Solid) */}
                        <Line
                            type="monotone"
                            dataKey="current"
                            stroke={trendColor}
                            strokeWidth={2}
                            dot={false}
                            className={isPositive ? "drop-shadow-[0_0_6px_rgba(198,239,78,0.5)]" : ""}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const AnalysisView: React.FC = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* AI Alerts Module */}
            <AIAlertsModule />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Métricas Clave</h2>
                        <div className="flex items-center gap-4 text-xs font-medium">
                            <div className="flex items-center gap-2 text-slate-400">
                                <div className="w-3 h-0.5 bg-[#D1F80C]"></div>
                                <span>Periodo seleccionado</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <div className="w-3 h-0.5 bg-slate-500 border-t border-dashed border-slate-500"></div>
                                <span>Periodo anterior</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout: 3 Columns to match reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                <AnalysisCard
                    title="Inversión"
                    value="$ 5.01M"
                    trend="-41.42%"
                    trendType="negative"
                />

                <AnalysisCard
                    title="CPA"
                    value="$ 30.57K"
                    trend="-9.27%"
                    trendType="positive" // Decrease is good (Green)
                />

                <AnalysisCard
                    title="ROAS"
                    value="5.08"
                    trend="+10.68%"
                    trendType="positive"
                />

                <AnalysisCard
                    title="Facturación"
                    value="$ 25.48M"
                    trend="-35.16%"
                    trendType="negative"
                />

                <AnalysisCard
                    title="Ticket Promedio (AOV)"
                    value="$ 155.34K"
                    trend="+0.42%"
                    trendType="positive"
                />

                <AnalysisCard
                    title="CPC (Todos)"
                    value="$ 516"
                    trend="-16.27%"
                    trendType="positive" // Decrease is good (Green)
                />

                <AnalysisCard
                    title="CPC (Clic en enlace)"
                    value="$ 997.8"
                    trend="-13.57%"
                    trendType="positive" // Decrease is good (Green)
                />

                <AnalysisCard
                    title="CPM"
                    value="$ 13.46K"
                    trend="-2.28%"
                    trendType="positive" // Decrease is good (Green)
                />

                <AnalysisCard
                    title="CTR único"
                    value="2.15%"
                    trend="+0.45%"
                    trendType="positive" // Increase is good (Green)
                />

            </div>



            {/* Top Spend Module */}
            <TopSpendModule />

            {/* Breakdown Module */}
            <BreakdownModule />

            {/* Creative Angles Module */}
            <CreativeAnglesModule />
        </div>
    );
};
