import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { DailyData } from './types';

interface ResultsChartProps {
    data: DailyData[];
    projection: {
        revenue: number;
        spend: number;
    };
}

export const ResultsChart: React.FC<ResultsChartProps> = ({ data, projection }) => {
    // If no simulation data yet, show a flat line or projection line
    const chartData = data.length > 0
        ? data
        : [
            { day: 1, cumRevenue: 0, cumSpend: 0 },
            { day: 30, cumRevenue: projection.revenue, cumSpend: projection.spend }
        ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg shadow-xl text-xs">
                    <p className="font-bold text-slate-50 mb-2">Día {label}</p>
                    <div className="space-y-1">
                        <p className="text-primary-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary-400"></span>
                            Ingresos: <span className="font-mono text-white">${payload[0].value.toFixed(0)}</span>
                        </p>
                        <p className="text-rose-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                            Gasto: <span className="font-mono text-white">${payload[1].value.toFixed(0)}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[300px] select-none">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#B8F30B" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#B8F30B" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis
                        dataKey="day"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickFormatter={(value) => `$${value / 1000}k`}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#B8F30B', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area
                        type="monotone"
                        dataKey="cumRevenue"
                        name="Ingresos"
                        stroke="#B8F30B"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        animationDuration={500}
                    />
                    <Area
                        type="monotone"
                        dataKey="cumSpend"
                        name="Gasto"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSpend)"
                        animationDuration={500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
