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

    return (
        <div className="analysis-card group relative overflow-hidden h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-sm font-medium">{title}</span>
                    <Info size={14} className="cursor-help hover:text-white transition-colors" />
                </div>
                <Crosshair size={16} className="text-slate-600 hover:text-[#D1F80C] transition-colors cursor-pointer" />
            </div>

            {/* Value & Trend Badge */}
            <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl font-bold text-white tracking-tight">
                    {value}
                </div>
                <div className={`
          px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1
          ${isPositive ? 'bg-[#D1F80C]/10 text-[#D1F80C]' : isNegative ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}
        `}>
                    {trend}
                </div>
            </div>

            {/* Chart */}
            <div className="h-16 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA}>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1A1D19', border: '1px solid #333', borderRadius: '8px', padding: '8px' }}
                            itemStyle={{ fontSize: '12px' }}
                            labelStyle={{ display: 'none' }}
                        />
                        {/* Previous Period (Dashed) */}
                        <Line
                            type="monotone"
                            dataKey="previous"
                            stroke="#6B7280"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={false}
                            isAnimationActive={false}
                        />
                        {/* Current Period (Solid) */}
                        <Line
                            type="monotone"
                            dataKey="current"
                            stroke={isPositive ? '#D1F80C' : isNegative ? '#EF4444' : '#EAB308'}
                            strokeWidth={2}
                            dot={false}
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
