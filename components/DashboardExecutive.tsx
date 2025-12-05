import React, { useState } from 'react';
import {
    LayoutDashboard,
    BarChart2,
    Megaphone,
    Search,
    Bell,
    User,
    Calendar,
    AlertTriangle,
    Lightbulb,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    Sun,
    Moon
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalysisView } from './AnalysisView';
import { AICreationHub } from './AICreationHub';
import './DashboardExecutive.css';
import { ViewState } from '../types';

const CHART_DATA = [
    { name: 'Semana 1', inversion: 4000, facturacion: 2400 },
    { name: '1.5', inversion: 3000, facturacion: 1398 },
    { name: '2', inversion: 2000, facturacion: 9800 },
    { name: '2.5', inversion: 2780, facturacion: 3908 },
    { name: 'Semana 2', inversion: 1890, facturacion: 4800 },
    { name: '3.5', inversion: 2390, facturacion: 3800 },
    { name: '4', inversion: 3490, facturacion: 4300 },
    { name: 'Semana 3', inversion: 4000, facturacion: 2400 },
    { name: '5.5', inversion: 3000, facturacion: 1398 },
    { name: '6', inversion: 2000, facturacion: 9800 },
    { name: '6.5', inversion: 2780, facturacion: 3908 },
    { name: 'Semana 4', inversion: 1890, facturacion: 4800 },
];

interface DashboardExecutiveProps {
    setView?: (view: ViewState) => void;
}

export const DashboardExecutive: React.FC<DashboardExecutiveProps> = ({ setView }) => {
    const [currentView, setCurrentView] = useState<'DASHBOARD' | 'ANALYSIS' | 'CREATION'>('DASHBOARD');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className={`overflow-y-auto custom-scrollbar ${theme === 'light' ? 'light-mode' : ''}`}>
            {currentView === 'DASHBOARD' ? (
                <>
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Dashboard Ejecutivo</h1>
                        <button className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] px-4 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all">
                            <Calendar size={16} />
                            <span>Últimos 30 días</span>
                        </button>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <MetricCard
                            title="ROAS Total"
                            value="4.2x"
                            trend="+5.2%"
                            isPositive={true}
                        />
                        <MetricCard
                            title="Inversión Total"
                            value="$82,450"
                            trend="+1.8%"
                            isPositive={true}
                        />
                        <MetricCard
                            title="Conversiones"
                            value="1,230"
                            trend="+8.1%"
                            isPositive={true}
                        />
                        <MetricCard
                            title="Costo por Adquisición"
                            value="$67.03"
                            trend="-2.5%"
                            isPositive={false}
                        />
                    </div>

                    {/* Charts & Alerts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[450px]">
                        {/* Chart */}
                        <div className="lg:col-span-2 chart-card p-6 flex flex-col">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <p className="text-[var(--text-secondary)] text-sm mb-1">Inversión vs. Facturación</p>
                                    <h3 className="text-2xl font-bold text-[var(--text-primary)]">$82k / <span className="text-[var(--text-secondary)]">$346k</span></h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-[var(--text-secondary)] mb-1">vs. Últimos 30 días</p>
                                    <p className="text-[#D1F80C] font-bold flex items-center justify-end gap-1">
                                        <ArrowUpRight size={16} /> 3.4%
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={CHART_DATA}>
                                        <defs>
                                            <linearGradient id="colorFacturacion" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D1F80C" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#D1F80C" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                            itemStyle={{ color: 'var(--text-primary)' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="facturacion"
                                            stroke="#D1F80C"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorFacturacion)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex justify-between px-4 mt-2 text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                                <span>Semana 1</span>
                                <span>Semana 2</span>
                                <span>Semana 3</span>
                                <span>Semana 4</span>
                            </div>
                        </div>

                        {/* Alerts */}
                        <div className="lg:col-span-1 flex flex-col gap-4">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Alertas de IA</h3>

                            <AlertCard
                                type="warning"
                                icon={AlertTriangle}
                                title="Fatiga de anuncio detectada"
                                description='La audiencia "Lookalike 1%" muestra un CTR decreciente. Se recomienda actualizar creatividades.'
                            />

                            <AlertCard
                                type="info"
                                icon={Lightbulb}
                                title="Oportunidad de presupuesto"
                                description='Campaña "Venta de Verano" tiene un ROAS alto. Considera aumentar la inversión un 15%.'
                            />

                            <AlertCard
                                type="error"
                                icon={XCircle}
                                title="Anuncio rechazado"
                                description='El anuncio "Video-03b" fue rechazado en Meta. Revisa las políticas de la plataforma.'
                            />
                        </div>
                    </div>
                </>
            ) : currentView === 'ANALYSIS' ? (
                <AnalysisView />
            ) : (
                <AICreationHub setView={setView || (() => { })} />
            )}
        </div>
    );
};

const MetricCard = ({ title, value, trend, isPositive }: { title: string, value: string, trend: string, isPositive: boolean }) => (
    <div className="metric-card p-6">
        <p className="text-[var(--text-secondary)] text-sm font-medium mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{value}</h3>
        <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-[#D1F80C]' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{trend}</span>
        </div>
    </div>
);

const AlertCard = ({ type, icon: Icon, title, description }: { type: 'warning' | 'info' | 'error', icon: any, title: string, description: string }) => {
    const colors = {
        warning: 'text-amber-500',
        info: 'text-sky-500',
        error: 'text-red-500'
    };

    return (
        <div className={`alert-card ${type} p-4 flex gap-4`}>
            <div className={`mt-1 ${colors[type]}`}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className="text-[var(--text-primary)] font-bold text-sm mb-1">{title}</h4>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed">{description}</p>
            </div>
        </div>
    );
};
