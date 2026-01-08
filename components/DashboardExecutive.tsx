
import React, { useState } from 'react';
import {
    TrendingUp,
    DollarSign,
    Users,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    Search,
    Filter,
    Download,
    Calendar,
    MoreHorizontal,
    XCircle,
    AlertTriangle,
    Lightbulb
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { ViewState } from '../types';
import { MetricCard } from './simulator/MetricCard'; // Using the updated MetricCard

// --- Data ---
const performanceData = [
    { name: 'Lun', roas: 3.2, spend: 1200, revenue: 3840 },
    { name: 'Mar', roas: 3.8, spend: 1350, revenue: 5130 },
    { name: 'Mie', roas: 3.5, spend: 1100, revenue: 3850 },
    { name: 'Jue', roas: 4.2, spend: 1550, revenue: 6510 },
    { name: 'Vie', roas: 4.5, spend: 1800, revenue: 8100 },
    { name: 'Sab', roas: 5.1, spend: 2100, revenue: 10710 },
    { name: 'Dom', roas: 4.8, spend: 1950, revenue: 9360 },
];

const channelData = [
    { name: 'Meta Ads', value: 45000, color: '#c6ef4e' },
    { name: 'Google Ads', value: 28000, color: '#a3c20a' },
    { name: 'TikTok Ads', value: 15000, color: '#e3f5ab' },
    { name: 'Email', value: 12000, color: '#f5f7ea' },
];

const funnelData = [
    { subject: 'Impresiones', A: 100, fullMark: 100 },
    { subject: 'Clics', A: 45, fullMark: 100 },
    { subject: 'Visitas', A: 35, fullMark: 100 },
    { subject: 'Add to Cart', A: 20, fullMark: 100 },
    { subject: 'Checkout', A: 15, fullMark: 100 },
    { subject: 'Purchase', A: 8, fullMark: 100 },
];

// --- Sub-components ---
const AlertCard = ({ type, icon: Icon, title, description }: { type: 'warning' | 'info' | 'error', icon: any, title: string, description: string }) => {
    const colors = {
        warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        info: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
        error: 'text-red-500 bg-red-500/10 border-red-500/20'
    };

    return (
        <div className={`p-4 rounded-2xl flex gap-4 border ${colors[type].split(' ').slice(1).join(' ')} group hover:bg-opacity-20 transition-all`}>
            <div className={`mt-1 p-2 rounded-full bg-white/5 ${colors[type].split(' ')[0]}`}>
                <Icon size={18} />
            </div>
            <div>
                <h4 className="text-slate-200 font-bold text-sm mb-1 group-hover:text-white transition-colors">{title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
            </div>
        </div>
    );
};


interface DashboardProps {
    setView: (view: ViewState) => void;
}

export const DashboardExecutive: React.FC<DashboardProps> = ({ setView }) => {
    const [timeRange, setTimeRange] = useState('7d');

    return (
        <div className="space-y-6 pb-10">

            {/* --- Header Glass --- */}
            <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-light text-slate-200 tracking-tight">
                        Hola, <span className="font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Valentina</span>
                    </h1>
                    <p className="text-slate-400 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#c6ef4e] shadow-[0_0_10px_#c6ef4e]"></span>
                        Resumen de rendimiento en tiempo real
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors backdrop-blur-sm">
                        <Calendar size={16} />
                        <span>Últimos 7 días</span>
                    </button>
                    <button className="p-2 rounded-full bg-[#c6ef4e] text-black hover:bg-[#b0d640] transition-all shadow-[0_0_15px_rgba(198,239,78,0.4)] hover:shadow-[0_0_25px_rgba(198,239,78,0.6)]">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* --- KPI Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Gasto Total"
                    value="$12,450"
                    trend={12.5}
                    trendLabel="vs periodo anterior"
                    icon={DollarSign}
                />
                <MetricCard
                    title="Retorno (ROAS)"
                    value="4.2x"
                    trend={8.2}
                    trendLabel="vs periodo anterior"
                    icon={TrendingUp}
                />
                <MetricCard
                    title="Conversiones"
                    value="842"
                    trend={-2.4}
                    trendLabel="vs periodo anterior"
                    icon={Target}
                />
                <MetricCard
                    title="CPA Promedio"
                    value="$14.20"
                    trend={-5.1}
                    trendLabel="vs periodo anterior"
                    icon={Users}
                />
            </div>

            {/* --- Charts Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart: Revenue vs Spend */}
                <div className="lg:col-span-2 glass-panel p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Evolución de Ingresos y Gasto</h3>
                            <p className="text-sm text-slate-400">Comparativa diaria de rendimiento</p>
                        </div>
                        <button className="text-slate-500 hover:text-white transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#c6ef4e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#c6ef4e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                                        backdropFilter: 'blur(12px)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#c6ef4e"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    className="drop-shadow-[0_0_10px_rgba(198,239,78,0.3)]"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="spend"
                                    stroke="#cbd5e1"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorSpend)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary: Alerts Panel */}
                <div className="glass-panel p-6 flex flex-col relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20"></div>

                    <div className="mb-4 flex items-center gap-2 relative z-10">
                        <div className="p-2 bg-[#c6ef4e]/10 rounded-full border border-[#c6ef4e]/20">
                            <RefreshCw size={16} className="text-[#c6ef4e] animate-spin-slow" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Alertas de IA</h3>
                            <p className="text-xs text-slate-400">Insights en tiempo real</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                        <AlertCard
                            type="warning"
                            icon={AlertTriangle}
                            title="Fatiga de anuncio"
                            description='La audiencia "Lookalike 1%" muestra CTR decreciente.'
                        />
                        <AlertCard
                            type="info"
                            icon={Lightbulb}
                            title="Oportunidad"
                            description='Aumentar presupuesto en "Venta de Verano" (+15% ROAS).'
                        />
                        <AlertCard
                            type="error"
                            icon={XCircle}
                            title="Rechazado"
                            description='Anuncio "Video-03b" política de música.'
                        />
                    </div>
                </div>

            </div>

            {/* Bottom Section: Mix & Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Channel Mix */}
                <div className="glass-panel p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 min-h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={channelData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {channelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                                        backdropFilter: 'blur(8px)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-3">
                        <h3 className="font-semibold text-white mb-2">Mix de Canales</h3>
                        {channelData.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-slate-300">{item.name}</span>
                                </div>
                                <span className="font-bold text-white">${(item.value / 1000).toFixed(1)}k</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Funnel Radar */}
                <div className="glass-panel p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 text-center">Salud del Funnel</h3>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={funnelData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Actual"
                                    dataKey="A"
                                    stroke="#c6ef4e"
                                    strokeWidth={2}
                                    fill="#c6ef4e"
                                    fillOpacity={0.3}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                                        backdropFilter: 'blur(8px)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                    }}
                                    itemStyle={{ color: '#c6ef4e' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Action */}
                <div className="glass-panel p-6 flex flex-col justify-center items-center text-center group">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#c6ef4e]/20 to-transparent border border-[#c6ef4e]/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(198,239,78,0.1)] group-hover:shadow-[0_0_30px_rgba(198,239,78,0.2)] transition-all duration-500">
                        <Download className="text-[#c6ef4e]" size={24} />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Exportar Reporte Mensual</h3>
                    <p className="text-xs text-slate-400 mb-4 max-w-[200px]">Descarga el análisis completo en PDF con bioluminiscencia.</p>
                    <button className="px-6 py-2.5 rounded-full bg-[#c6ef4e] text-black text-xs font-bold hover:bg-[#b0d640] transition-all shadow-[0_0_15px_rgba(198,239,78,0.3)] hover:shadow-[0_0_25px_rgba(198,239,78,0.5)] active:scale-95">
                        Descargar PDF
                    </button>
                </div>
            </div>

        </div>
    );
};
