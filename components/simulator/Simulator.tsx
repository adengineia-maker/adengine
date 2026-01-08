import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Play,
    RotateCcw,
    TrendingUp,
    DollarSign,
    Activity,
    MousePointer,
    ShoppingCart,
    Pause,
    Target,
    BarChart3,
    ArrowLeft,
    ArrowRightLeft,
    Save,
    History as HistoryIcon,
    Bot,
    X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { DailyData, SimulationTotals, SimulationLogItem, SimulationSession } from '../../types';
import { Card } from './ui/Card';
import { MetricCard } from './MetricCard';
import { SliderControl } from './SliderControl';
import { ResultsChart } from './ResultsChart';
import { SimulatorHistory } from './SimulatorHistory';
import { analyzeSimulation } from '../../services/geminiCoach';

interface SimulatorProps {
    onBack?: () => void;
}

export default function Simulator({ onBack }: SimulatorProps) {
    // --- State: Inputs ---
    const [budget, setBudget] = useState(100);
    const [cpm, setCpm] = useState(25);
    const [ctr, setCtr] = useState(1.5);
    const [cvr, setCvr] = useState(2.0);
    const [aov, setAov] = useState(85);
    const [duration, setDuration] = useState(30);
    const [volatility, setVolatility] = useState(10);
    const [currency, setCurrency] = useState<'USD' | 'COP'>('USD');

    const EXCHANGE_RATE = 4000;

    const toggleCurrency = () => {
        setCurrency(prev => {
            const newCurrency = prev === 'USD' ? 'COP' : 'USD';
            const factor = newCurrency === 'COP' ? EXCHANGE_RATE : 1 / EXCHANGE_RATE;

            // Define limits for the target currency
            const maxBudget = newCurrency === 'USD' ? 1000 : 5000000;
            const maxCpm = newCurrency === 'USD' ? 100 : 50000;
            const maxAov = newCurrency === 'USD' ? 500 : 1000000;

            setBudget(b => Math.min(maxBudget, Math.round(b * factor)));
            setCpm(c => Math.min(maxCpm, Math.round(c * factor)));
            setAov(a => Math.min(maxAov, Math.round(a * factor)));

            return newCurrency;
        });
    };

    // --- State: Simulation ---
    const [isRunning, setIsRunning] = useState(false);
    const [currentDay, setCurrentDay] = useState(0);
    const [dailyData, setDailyData] = useState<DailyData[]>([]);
    const [logs, setLogs] = useState<SimulationLogItem[]>([]);

    // --- State: Persistence & AI ---
    const [sessions, setSessions] = useState<SimulationSession[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    // Tracking (Actual Data)
    const [actualSpend, setActualSpend] = useState<string>('');
    const [actualRevenue, setActualRevenue] = useState<string>('');

    // AI Coach
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Load sessions on mount
    useEffect(() => {
        const saved = localStorage.getItem('ad_simulator_sessions');
        if (saved) {
            try {
                setSessions(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load sessions", e);
            }
        }
    }, []);

    // Save sessions effect
    useEffect(() => {
        localStorage.setItem('ad_simulator_sessions', JSON.stringify(sessions));
    }, [sessions]);

    // --- Helper: Randomization ---
    const randomize = (baseValue: number, volatilityPercent: number) => {
        if (volatilityPercent === 0) return baseValue;
        const range = baseValue * (volatilityPercent / 100);
        const randomOffset = (Math.random() * range * 2) - range;
        return Math.max(0, baseValue + randomOffset);
    };

    // --- Helper: Daily Calculation Logic ---
    const calculateDay = (dayIndex: number): DailyData => {
        const dailyCPM = randomize(cpm, volatility);
        const dailyCTR = randomize(ctr, volatility);
        const dailyCVR = randomize(cvr, volatility);
        const dailyBudget = budget;

        // Core Ad Math
        const impressions = (dailyBudget / dailyCPM) * 1000;
        const clicks = impressions * (dailyCTR / 100);

        // Probabilistic Conversions
        const rawConversions = clicks * (dailyCVR / 100);
        const baseConversions = Math.floor(rawConversions);
        const chance = rawConversions - baseConversions;
        const extraSale = Math.random() < chance ? 1 : 0;
        const conversions = baseConversions + extraSale;

        const revenue = conversions * aov;

        // Calculated for this specific day (snapshot)
        return {
            day: dayIndex + 1,
            spend: dailyBudget,
            revenue: revenue,
            impressions: Math.floor(impressions),
            clicks: Math.floor(clicks),
            conversions: conversions,
            roas: dailyBudget > 0 ? revenue / dailyBudget : 0,
            cumRevenue: 0, // Filled in the loop
            cumSpend: 0    // Filled in the loop
        };
    };

    // --- Controls ---
    const resetSimulation = () => {
        setIsRunning(false);
        setCurrentDay(0);
        setDailyData([]);
        setLogs([]);
        setAiAnalysis(null);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const toggleSimulation = () => {
        if (isRunning) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
        } else {
            if (currentDay >= duration) {
                resetSimulation();
            }
            setIsRunning(true);
        }
    };

    // --- Effect: Simulation Loop ---
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setCurrentDay(prev => {
                    if (prev >= duration) {
                        setIsRunning(false);
                        if (timerRef.current) clearInterval(timerRef.current);
                        return prev;
                    }

                    const nextDay = prev + 1;
                    const dayResult = calculateDay(prev);

                    setDailyData(curr => {
                        const prevTotalRevenue = curr.length > 0 ? curr[curr.length - 1].cumRevenue : 0;
                        const prevTotalSpend = curr.length > 0 ? curr[curr.length - 1].cumSpend : 0;

                        return [...curr, {
                            ...dayResult,
                            cumRevenue: prevTotalRevenue + dayResult.revenue,
                            cumSpend: prevTotalSpend + dayResult.spend
                        }];
                    });

                    // Logging Logic
                    if (dayResult.conversions >= 1 || nextDay === 1 || nextDay % 7 === 0) {
                        const profit = dayResult.revenue - dayResult.spend;
                        let type: 'success' | 'neutral' | 'warning' = 'neutral';
                        if (profit > 0) type = 'success';
                        if (profit < -50) type = 'warning';

                        setLogs(currLogs => [{
                            id: Date.now(),
                            day: nextDay,
                            message: `Día ${nextDay}: Gasto $${dayResult.spend.toFixed(0)} → ${dayResult.conversions} Ventas ($${dayResult.revenue.toFixed(0)})`,
                            type
                        }, ...currLogs].slice(0, 50));
                    }

                    return nextDay;
                });
            }, 50); // Speed of simulation
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, duration, budget, cpm, ctr, cvr, aov, volatility]);

    // --- Computed: Static Projection (If simulation hasn't run) ---
    const projection = useMemo(() => {
        const totalSpend = budget * duration;
        const totalImpressions = (totalSpend / cpm) * 1000;
        const totalClicks = totalImpressions * (ctr / 100);
        const totalConversions = totalClicks * (cvr / 100);
        const totalRevenue = totalConversions * aov;
        const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

        return {
            spend: totalSpend,
            revenue: totalRevenue,
            roas: roas,
            conversions: totalConversions,
            profit: totalRevenue - totalSpend,
            cpa: totalConversions > 0 ? totalSpend / totalConversions : 0
        };
    }, [budget, cpm, ctr, cvr, aov, duration]);

    // --- Computed: Active Simulation Data ---
    const simTotals: SimulationTotals = useMemo(() => {
        if (dailyData.length === 0) return projection;

        const last = dailyData[dailyData.length - 1];
        return {
            spend: last.cumSpend,
            revenue: last.cumRevenue,
            roas: last.cumSpend > 0 ? last.cumRevenue / last.cumSpend : 0,
            profit: last.cumRevenue - last.cumSpend,
            conversions: dailyData.reduce((acc, curr) => acc + curr.conversions, 0),
            cpa: dailyData.reduce((acc, curr) => acc + curr.conversions, 0) > 0
                ? last.cumSpend / dailyData.reduce((acc, curr) => acc + curr.conversions, 0)
                : 0
        };
    }, [dailyData, projection]);

    // Determine which data to show
    const displayData = dailyData.length > 0 ? simTotals : projection;
    const isProfitable = displayData.profit > 0;

    // --- Actions ---
    const handleSaveSession = () => {
        const newSession: SimulationSession = {
            id: Date.now().toString(),
            name: `Simulación ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)}`,
            date: new Date().toISOString(),
            params: { budget, cpm, ctr, cvr, aov, duration, volatility },
            projectedResults: simTotals,
            actualResults: (actualSpend && actualRevenue) ? {
                spend: parseFloat(actualSpend),
                revenue: parseFloat(actualRevenue)
            } : undefined
        };

        // If updating existing session
        if (currentSessionId) {
            setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...newSession, id: currentSessionId, name: s.name } : s));
        } else {
            setSessions(prev => [newSession, ...prev]);
            setCurrentSessionId(newSession.id);
        }
    };

    const handleLoadSession = (session: SimulationSession) => {
        setBudget(session.params.budget);
        setCpm(session.params.cpm);
        setCtr(session.params.ctr);
        setCvr(session.params.cvr);
        setAov(session.params.aov);
        setDuration(session.params.duration);
        setVolatility(session.params.volatility);

        if (session.actualResults) {
            setActualSpend(session.actualResults.spend.toString());
            setActualRevenue(session.actualResults.revenue.toString());
        } else {
            setActualSpend('');
            setActualRevenue('');
        }

        setCurrentSessionId(session.id);
        setShowHistory(false);
        resetSimulation();
    };

    const handleDeleteSession = (id: string) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        if (currentSessionId === id) setCurrentSessionId(null);
    };

    const handleAnalyzeWithAI = async () => {
        setIsAnalyzing(true);
        setAiAnalysis(null);

        const analysis = await analyzeSimulation({
            simulationParams: { budget, cpm, ctr, cvr, aov, duration, volatility },
            dailyData: dailyData
        });

        setAiAnalysis(analysis);
        setIsAnalyzing(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans p-4 md:p-8 relative selection:bg-primary-500 selection:text-slate-950">

            <div className="max-w-7xl mx-auto transition-all duration-700">

                {/* Header */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all mr-2"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                            )}
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-slate-950 shadow-lg shadow-primary-500/20">
                                <BarChart3 size={18} />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                Simulador de Anuncios Meta
                            </h1>
                        </div>
                        <p className="text-slate-400 text-sm ml-1">Motor de pronósticos en tiempo real para campañas de medios pagados.</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className={`px-4 py-2.5 rounded-lg border font-medium transition-all flex items-center gap-2 ${showHistory ? 'bg-primary-500 text-slate-950 border-primary-500' : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'}`}
                            title="Historial"
                        >
                            <HistoryIcon size={18} />
                            <span className="hidden md:inline">Historial</span>
                        </button>

                        <button
                            onClick={handleSaveSession}
                            className="px-4 py-2.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 font-medium transition-all flex items-center gap-2"
                            title="Guardar Sesión"
                        >
                            <Save size={18} />
                            <span className="hidden md:inline">Guardar</span>
                        </button>

                        <button
                            onClick={handleAnalyzeWithAI}
                            disabled={isAnalyzing || dailyData.length === 0}
                            className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 border ${isAnalyzing
                                ? 'bg-slate-800 text-slate-400 border-slate-700 cursor-wait'
                                : 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title="Analizar con IA"
                        >
                            <Bot size={18} />
                            <span className="hidden md:inline">{isAnalyzing ? 'Analizando...' : 'Analizar IA'}</span>
                        </button>

                        <button
                            onClick={toggleSimulation}
                            className={`flex-1 md:flex-none justify-center flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all duration-200 border ${isRunning
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/50 hover:bg-amber-500/20'
                                : 'bg-primary-500 hover:bg-primary-600 text-slate-950 border-transparent shadow-lg shadow-primary-500/25 hover:scale-[1.02]'
                                }`}
                        >
                            {isRunning ? <><Pause size={18} fill="currentColor" /> Pausar</> : <><Play size={18} fill="currentColor" /> {dailyData.length > 0 ? 'Reanudar' : 'Simular'}</>}
                        </button>
                        <button
                            onClick={resetSimulation}
                            className="px-4 py-2.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 font-medium transition-all"
                            title="Reiniciar Simulación"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">

                    {/* History Modal / Overlay */}
                    {showHistory && (
                        <div className="absolute top-0 right-0 z-50 w-full md:w-96 bg-slate-950 border border-slate-800 shadow-2xl rounded-xl p-4 animate-in slide-in-from-right-10 fade-in duration-200">
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                                <h3 className="font-bold text-white flex items-center gap-2"><HistoryIcon size={16} /> Historial de Proyecciones</h3>
                                <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
                            </div>
                            <SimulatorHistory
                                sessions={sessions}
                                onSelectSession={handleLoadSession}
                                onDeleteSession={handleDeleteSession}
                            />
                        </div>
                    )}

                    {/* LEFT COLUMN: Controls */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="h-full border-t-4 border-t-slate-800">
                            <div className="flex items-center gap-2 mb-6 text-white font-semibold pb-4 border-b border-slate-800">
                                <Target size={20} className="text-primary-400" />
                                <span>Variables de Campaña</span>
                                <button
                                    onClick={toggleCurrency}
                                    className="ml-auto text-xs font-mono bg-slate-900 border border-slate-700 px-2 py-1 rounded flex items-center gap-1 hover:border-primary-500 hover:text-primary-500 transition-colors"
                                >
                                    <ArrowRightLeft size={12} />
                                    {currency}
                                </button>
                            </div>

                            <SliderControl
                                key={`budget-${currency}`}
                                label="Presupuesto Diario" value={budget} onChange={setBudget}
                                min={currency === 'USD' ? 10 : 40000}
                                max={currency === 'USD' ? 1000 : 5000000}
                                step={currency === 'USD' ? 10 : 10000}
                                unit="" prefix="$"
                                tooltip="Tu límite máximo de gasto publicitario diario."
                            />
                            <SliderControl
                                key={`cpm-${currency}`}
                                label="CPM" value={cpm} onChange={setCpm}
                                min={currency === 'USD' ? 1 : 4000}
                                max={currency === 'USD' ? 100 : 50000}
                                step={currency === 'USD' ? 1 : 1000}
                                unit="" prefix="$"
                                tooltip="Costo Por Mil: Costo por cada 1,000 impresiones."
                            />
                            <SliderControl
                                key={`ctr-${currency}`}
                                label="CTR (Enlace)" value={ctr} onChange={setCtr}
                                min={0.1} max={5} step={0.1} unit="%"
                                tooltip="Tasa de clics: % de usuarios que hacen clic en tu anuncio."
                            />
                            <SliderControl
                                key={`cvr-${currency}`}
                                label="Tasa de Conversión (CVR)" value={cvr} onChange={setCvr}
                                min={0.1} max={10} step={0.1} unit="%"
                                tooltip="Porcentaje de visitantes que realizan una compra."
                            />
                            <SliderControl
                                key={`aov-${currency}`}
                                label="Valor Promedio Pedido" value={aov} onChange={setAov}
                                min={currency === 'USD' ? 10 : 40000}
                                max={currency === 'USD' ? 500 : 1000000}
                                step={currency === 'USD' ? 5 : 5000}
                                unit="" prefix="$"
                                tooltip="Ingreso promedio por conversión exitosa."
                            />
                            <SliderControl
                                key={`duration-${currency}`}
                                label="Duración" value={duration} onChange={setDuration}
                                min={7} max={90} step={1} unit=" Días"
                                tooltip="Fechas de duración de la campaña."
                            />

                            <div className="pt-6 mt-6 border-t border-slate-800">
                                <SliderControl
                                    label="Volatilidad de Mercado" value={volatility} onChange={setVolatility}
                                    min={0} max={50} step={5} unit="%"
                                    tooltip="Simula fluctuaciones reales en los costos publicitarios."
                                />
                            </div>
                        </Card>
                    </div>

                    {/* MIDDLE COLUMN: Visualization */}
                    <div className="lg:col-span-6 space-y-6 relative">

                        {/* Blur Overlay if no data */}
                        {dailyData.length === 0 && (
                            <div className="absolute inset-0 z-20 backdrop-blur-md bg-slate-950/50 flex flex-col items-center justify-center rounded-xl border border-slate-800/50">
                                <div className="text-center p-6 max-w-sm">
                                    <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-500">
                                        <Play size={32} fill="currentColor" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Listo para Simular</h3>
                                    <p className="text-slate-400 mb-6">Configura tus variables a la izquierda y presiona "Simular" para ver la proyección.</p>
                                    <button
                                        onClick={toggleSimulation}
                                        className="bg-primary-500 hover:bg-primary-600 text-slate-950 font-bold py-3 px-8 rounded-full shadow-lg shadow-primary-500/25 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                                    >
                                        <Play size={20} fill="currentColor" /> Iniciar Simulación
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Top Metrics */}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-500 ${dailyData.length === 0 ? 'opacity-20 blur-sm pointer-events-none' : ''}`}>
                            <MetricCard
                                title="Gasto Total"
                                value={`$${displayData.spend.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                icon={DollarSign}
                            />
                            <MetricCard
                                title="Ingresos"
                                value={`$${displayData.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                icon={ShoppingCart}
                                highlight
                            />
                            <MetricCard
                                title="ROAS"
                                value={`${displayData.roas.toFixed(2)}x`}
                                subtext={displayData.roas < 1 ? "No Rentable" : "Rentable"}
                                trend={displayData.roas >= 1.5 ? 'up' : displayData.roas < 1 ? 'down' : 'neutral'}
                                trendValue={Math.abs(((displayData.roas - 1) * 100)).toFixed(0)}
                                icon={Activity}
                            />
                            <MetricCard
                                title="Beneficio Neto"
                                value={`$${displayData.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                icon={TrendingUp}
                                trend={isProfitable ? 'up' : 'down'}
                                trendValue="-"
                            />
                        </div>

                        {/* Secondary Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="p-4 flex items-center justify-between group hover:border-slate-700">
                                <div>
                                    <div className="text-slate-400 text-xs uppercase font-bold tracking-wider">CPA (Costo Por Adquisición)</div>
                                    <div className="text-2xl font-bold text-white mt-1">${displayData.cpa.toFixed(2)}</div>
                                    <div className="text-xs text-slate-400 mt-1 font-medium">Punto de Equilibrio: <span className="text-slate-50">${aov}</span></div>
                                </div>
                                <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:text-primary-500 transition-colors">
                                    <MousePointer size={24} />
                                </div>
                            </Card>
                            <Card className="p-4 flex items-center justify-between group hover:border-slate-700">
                                <div>
                                    <div className="text-slate-400 text-xs uppercase font-bold tracking-wider">Conversiones Totales</div>
                                    <div className="text-2xl font-bold text-white mt-1">{displayData.conversions.toFixed(0)}</div>
                                    <div className="text-xs text-slate-400 mt-1 font-medium">Ventas Generadas</div>
                                </div>
                                <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:text-emerald-400 transition-colors">
                                    <ShoppingCart size={24} />
                                </div>
                            </Card>
                        </div>

                        {/* Main Chart */}
                        <Card className="min-h-[400px] flex flex-col border-primary-500/20">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Pronóstico de Rendimiento</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Ingresos Acumulados vs. Gasto Publicitario</p>
                                </div>
                                <div className="flex gap-3 text-xs font-medium text-slate-400">
                                    <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                                        <span className="w-2 h-2 rounded-full bg-primary-400"></span> Ingresos
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> Gasto
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow w-full relative -ml-2">
                                <ResultsChart data={dailyData} projection={projection} />

                                {/* Overlay for 'Not Started' state */}
                                {dailyData.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-[1px] z-10">
                                        <button
                                            onClick={toggleSimulation}
                                            className="bg-slate-800 hover:bg-slate-700 text-primary-500 border border-primary-500/30 px-6 py-2 rounded-full font-bold shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                                        >
                                            <Play size={16} fill="currentColor" /> Iniciar Proyección
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* AI Analysis Section */}
                        <Card className="border-primary-500/30 bg-gradient-to-br from-slate-900 to-slate-950">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-primary-400 font-bold">
                                    <Bot size={20} />
                                    <h3>Coach de Estrategia IA</h3>
                                </div>
                            </div>

                            {aiAnalysis ? (
                                <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                                    <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                                </div>
                            ) : (
                                <div className="text-slate-500 text-sm italic p-4 text-center border border-dashed border-slate-800 rounded-lg">
                                    Ejecuta una simulación y haz clic en "Analizar" para recibir feedback estratégico de Gemini.
                                </div>
                            )}
                        </Card>


                    </div>

                    {/* RIGHT COLUMN: Live Log & Tracking */}
                    <div className="lg:col-span-3 flex flex-col gap-6 lg:h-0 lg:min-h-full">
                        {/* Tracking Input */}
                        <Card className="border-l-4 border-l-emerald-500 shrink-0">
                            <div className="flex items-center gap-2 mb-4 text-white font-semibold pb-2 border-b border-slate-800">
                                <Activity size={20} className="text-emerald-500" />
                                <span>Seguimiento Real</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Gasto Real ($)</label>
                                    <input
                                        type="number"
                                        value={actualSpend}
                                        onChange={(e) => setActualSpend(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Ingreso Real ($)</label>
                                    <input
                                        type="number"
                                        value={actualRevenue}
                                        onChange={(e) => setActualRevenue(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>

                                {(actualSpend && actualRevenue) && (
                                    <div className="pt-2 border-t border-slate-800 mt-2">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-400">ROAS Real:</span>
                                            <span className={`font-bold ${(parseFloat(actualRevenue) / parseFloat(actualSpend)) >= 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {(parseFloat(actualRevenue) / parseFloat(actualSpend)).toFixed(2)}x
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
                            <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                    <h3 className="font-medium text-white">Registro de Eventos</h3>
                                </div>
                                <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-1 rounded">Día {currentDay}/{duration}</span>
                            </div>

                            <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar" ref={logContainerRef}>
                                {logs.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400/50 text-sm italic space-y-2">
                                        <Activity size={32} />
                                        <p>Esperando datos de simulación...</p>
                                    </div>
                                ) : (
                                    logs.map((log) => (
                                        <div
                                            key={log.id}
                                            className={`text-xs p-3 rounded-lg border-l-[3px] animate-in fade-in slide-in-from-top-1 duration-300 ${log.type === 'success'
                                                ? 'bg-emerald-500/5 border-emerald-500/50 text-emerald-200'
                                                : log.type === 'warning'
                                                    ? 'bg-rose-500/5 border-rose-500/50 text-rose-200'
                                                    : 'bg-slate-800 border-slate-700 text-slate-400'
                                                }`}
                                        >
                                            <div className="flex justify-between w-full gap-2">
                                                <span>Día {log.day}:</span>
                                                <span className="font-mono">
                                                    Gasto {currency === 'USD' ? '$' : 'COP '}{parseInt(log.message.split('Gasto $')[1].split(' ')[0]).toLocaleString()} →
                                                    <span className={log.type === 'success' ? 'text-emerald-400 font-bold' : ''}> {log.message.split('→ ')[1].split(' Ventas')[0]} Ventas</span>
                                                    ({currency === 'USD' ? '$' : 'COP '}{parseInt(log.message.split('($')[1].split(')')[0]).toLocaleString()})
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>



                </main>
            </div>
        </div>
    );
}
