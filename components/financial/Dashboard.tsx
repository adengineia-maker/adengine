import React from 'react';
import { FinancialData, ActionItem } from '../../types/financialTypes';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from 'recharts';
import {
    ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign,
    Wallet, ShoppingBag, Users, Package,
    RefreshCcw, UserCheck, Megaphone, Target,
    Banknote, Box, Percent, CreditCard, Activity, Zap
} from 'lucide-react';

interface DashboardProps {
    data: FinancialData;
}

const formatCurrency = (val: number, currency: string) => {
    if (val === undefined || val === null) return '$0';
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(val);
};

const formatNumber = (val: number) => {
    return new Intl.NumberFormat('es-CO').format(val);
}

// Module Component - The fundamental building block
const Module: React.FC<{
    title: string;
    value: React.ReactNode;
    subValue?: string;
    icon?: React.ReactNode;
    trend?: number;
    className?: string;
    variant?: 'default' | 'highlight' | 'danger' | 'success' | 'warning';
}> = ({ title, value, subValue, icon, trend, className = "", variant = 'default' }) => {

    let variantStyles = "bg-[#181b21] border-gray-800";
    let iconColor = "text-gray-400 bg-gray-800/50";
    let valueColor = "text-white";

    switch (variant) {
        case 'highlight':
            variantStyles = "bg-gradient-to-br from-blue-900/20 to-[#181b21] border-blue-500/30";
            iconColor = "text-blue-400 bg-blue-500/20";
            valueColor = "text-blue-100";
            break;
        case 'success':
            variantStyles = "bg-gradient-to-br from-green-900/10 to-[#181b21] border-green-500/20";
            iconColor = "text-green-400 bg-green-500/20";
            valueColor = "text-green-100";
            break;
        case 'danger':
            variantStyles = "bg-gradient-to-br from-red-900/10 to-[#181b21] border-red-500/20";
            iconColor = "text-red-400 bg-red-500/20";
            valueColor = "text-red-100";
            break;
        case 'warning':
            variantStyles = "bg-gradient-to-br from-yellow-900/10 to-[#181b21] border-yellow-500/20";
            iconColor = "text-yellow-400 bg-yellow-500/20";
            valueColor = "text-yellow-100";
            break;
    }

    return (
        <div className={`p-5 rounded-2xl border flex flex-col justify-between shadow-lg backdrop-blur-sm ${variantStyles} ${className} hover:scale-[1.02] transition-transform duration-300`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{title}</span>
                {icon && <div className={`p-2 rounded-lg ${iconColor}`}>{icon}</div>}
            </div>
            <div>
                <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
                {(subValue || trend !== undefined) && (
                    <div className="flex items-center gap-2 mt-1">
                        {trend !== undefined && (
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {trend > 0 ? '+' : ''}{trend}%
                            </span>
                        )}
                        {subValue && <span className="text-xs text-gray-500 truncate">{subValue}</span>}
                    </div>
                )}
            </div>
        </div>
    );
};

// Section Header
const SectionHeader: React.FC<{ title: string; subtitle?: string; color?: string }> = ({ title, subtitle, color = "bg-blue-500" }) => (
    <div className="flex items-center gap-3 mb-4 mt-8">
        <div className={`w-1 h-8 rounded-full ${color}`}></div>
        <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
    </div>
);

const ActionCard: React.FC<{ item: ActionItem }> = ({ item }) => {
    const variants: Record<string, string> = {
        'Recortar': 'border-red-500/50 bg-red-900/10 hover:bg-red-900/20 text-red-200',
        'Optimizar': 'border-blue-500/50 bg-blue-900/10 hover:bg-blue-900/20 text-blue-200',
        'Duplicar': 'border-green-500/50 bg-green-900/10 hover:bg-green-900/20 text-green-200',
        'Precio': 'border-yellow-500/50 bg-yellow-900/10 hover:bg-yellow-900/20 text-yellow-200',
        'Marketing': 'border-purple-500/50 bg-purple-900/10 hover:bg-purple-900/20 text-purple-200',
    };

    return (
        <div className={`p-4 rounded-xl border transition-all cursor-pointer ${variants[item.category] || variants['Optimizar']}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase border border-current px-2 py-0.5 rounded-md opacity-80">{item.category}</span>
                <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full">Impacto: {item.impact}</span>
            </div>
            <h4 className="font-bold text-sm mb-1">{item.title}</h4>
            <p className="text-xs opacity-70 leading-relaxed">{item.description}</p>
        </div>
    );
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const COLORS = ['#6366f1', '#3b82f6', '#14b8a6', '#8b5cf6', '#ec4899', '#f59e0b'];
    const hasRevenueData = data.revenueByDay && data.revenueByDay.length > 0;

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto pb-32">

            {/* HEADER */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Dashboard Financiero
                    </h1>
                    <p className="text-gray-400 mt-1 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-gray-800 rounded text-xs border border-gray-700">{data.month}</span>
                        <span className="text-sm">Vista Ejecutiva</span>
                    </p>
                </div>
                <div className="bg-[#181b21] px-5 py-3 rounded-xl border border-gray-800 flex flex-col items-end shadow-xl">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Utilidad Neta</span>
                    <div className={`text-2xl font-mono font-bold ${data.netProfit?.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(data.netProfit?.value || 0, data.currency)}
                    </div>
                </div>
            </header>

            {/* BLOQUE 1: VENTAS (MODULES) */}
            <SectionHeader title="Ingresos & Ventas" subtitle="Desglose comercial" color="bg-blue-500" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <Module
                    title="Facturación Total"
                    value={formatCurrency(data.totalRevenue?.value, data.currency)}
                    icon={<DollarSign size={20} />}
                    variant="highlight"
                    className="col-span-2 md:col-span-2"
                />
                <Module
                    title="Órdenes"
                    value={formatNumber(data.ordersCount?.value)}
                    icon={<ShoppingBag size={20} />}
                />
                <Module
                    title="Unidades"
                    value={formatNumber(data.unitsSold?.value)}
                    icon={<Package size={20} />}
                />
                <Module
                    title="Clientes"
                    value={formatNumber(data.clientsCount?.value)}
                    icon={<Users size={20} />}
                />
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div className="lg:col-span-2 bg-[#181b21] p-4 rounded-2xl border border-gray-800 h-[300px]">
                    <h4 className="text-sm text-gray-400 mb-4 font-semibold flex items-center gap-2">
                        <Activity size={16} /> Tendencia Diaria
                    </h4>
                    {hasRevenueData ? (
                        <ResponsiveContainer width="100%" height="90%">
                            <AreaChart data={data.revenueByDay}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 10 }} minTickGap={30} />
                                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                                    formatter={(value: number) => formatCurrency(value, data.currency)}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : <div className="h-full flex items-center justify-center text-gray-600 text-sm">Sin datos de tendencia</div>}
                </div>
                <div className="bg-[#181b21] p-4 rounded-2xl border border-gray-800 h-[300px] flex flex-col">
                    <h4 className="text-sm text-gray-400 mb-2 font-semibold flex items-center gap-2">
                        <CreditCard size={16} /> Métodos de Pago
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data.paymentMethods} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                                {data.paymentMethods?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px' }} formatter={(val: number) => `${val}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* BLOQUE 2 & 3: COSTOS Y GASTOS (MODULES) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div>
                    <SectionHeader title="Costos Directos" subtitle="Eficiencia operativa" color="bg-purple-500" />
                    <div className="grid grid-cols-2 gap-4">
                        <Module
                            title="Margen Bruto"
                            value={`${data.grossMargin?.value || 0}%`}
                            icon={<Percent size={20} />}
                            variant="highlight"
                        />
                        <Module
                            title="Costo Ventas"
                            value={formatCurrency((data.totalRevenue?.value || 0) * (1 - (data.grossMargin?.value || 0) / 100), data.currency)}
                            icon={<Box size={20} />}
                        />
                        {data.returns?.isProduct && (
                            <>
                                <Module
                                    title="Devoluciones $"
                                    value={formatCurrency(data.returns.cost, data.currency)}
                                    variant="danger"
                                    icon={<RefreshCcw size={20} />}
                                />
                                <Module
                                    title="Tasa Devolución"
                                    value={`${data.returns.percentage}%`}
                                    variant="danger"
                                />
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <SectionHeader title="Gastos (OPEX)" subtitle="Estructura de costos fijos" color="bg-pink-500" />
                    <div className="grid grid-cols-2 gap-4">
                        <Module
                            title="Total OPEX"
                            value={formatCurrency(data.opex?.value, data.currency)}
                            icon={<Wallet size={20} />}
                            className="col-span-2"
                        />
                        {data.expensesByCategory?.slice(0, 2).map((exp, i) => (
                            <Module
                                key={i}
                                title={exp.name}
                                value={formatCurrency(exp.value, data.currency)}
                                icon={<ArrowDownRight size={20} />}
                                variant="warning"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* BLOQUE 4: MARKETING (MODULES) */}
            <SectionHeader title="Performance Marketing" subtitle="Eficiencia de Ad Spend" color="bg-teal-500" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Module
                    title="Inversión Ads"
                    value={formatCurrency(data.marketing?.spend, data.currency)}
                    icon={<Megaphone size={20} />}
                    variant="highlight"
                />
                <Module
                    title="ROAS"
                    value={`${data.marketing?.roas}x`}
                    subValue="Retorno Ad Spend"
                    icon={<Target size={20} />}
                    variant="success"
                />
                <Module
                    title="CAC"
                    value={formatCurrency(data.marketing?.cac, data.currency)}
                    subValue="Costo Adquisición"
                    icon={<UserCheck size={20} />}
                    variant="warning"
                />
            </div>

            {/* BLOQUE 5: CAJA (MODULES) */}
            <SectionHeader title="Flujo de Caja" subtitle="Liquidez real" color="bg-green-500" />
            <div className="bg-[#181b21] p-6 rounded-2xl border border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="flex flex-col gap-1 border-r border-gray-800/50 pr-4">
                    <span className="text-gray-500 text-sm font-medium">Entradas Reales</span>
                    <span className="text-2xl font-bold text-green-400">{formatCurrency(data.cashFlow?.in, data.currency)}</span>
                </div>
                <div className="flex flex-col gap-1 border-r border-gray-800/50 pr-4">
                    <span className="text-gray-500 text-sm font-medium">Salidas Reales</span>
                    <span className="text-2xl font-bold text-red-400">{formatCurrency(data.cashFlow?.out, data.currency)}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-sm font-medium">Balance Caja</span>
                    <span className={`text-3xl font-bold ${data.cashFlow?.balance >= 0 ? 'text-blue-400' : 'text-red-500'}`}>
                        {formatCurrency(data.cashFlow?.balance, data.currency)}
                    </span>
                </div>
            </div>

            {/* BLOQUE 7: DECISIONES */}
            <SectionHeader title="Plan de Acción IA" subtitle="Recomendaciones estratégicas" color="bg-indigo-500" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.actionPlan?.map((action, i) => (
                    <ActionCard key={i} item={action} />
                ))}
                {(!data.actionPlan || data.actionPlan.length === 0) && (
                    <div className="col-span-full py-8 text-center text-gray-500 bg-[#181b21] rounded-xl border border-dashed border-gray-800">
                        <Zap className="mx-auto mb-2 opacity-20" size={32} />
                        Esperando análisis para generar acciones...
                    </div>
                )}
            </div>

        </div>
    );
};
