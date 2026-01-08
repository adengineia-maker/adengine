export interface DailyData {
    day: number;
    spend: number;
    revenue: number;
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
    cumRevenue: number;
    cumSpend: number;
}

export interface SimulationTotals {
    spend: number;
    revenue: number;
    roas: number;
    profit: number;
    conversions: number;
    cpa: number;
}

export interface SimulationLogItem {
    id: number;
    day: number;
    message: string;
    type: 'success' | 'neutral' | 'warning';
}

export interface SimulationParams {
    budget: number;
    cpm: number;
    ctr: number;
    cvr: number;
    aov: number;
    duration: number;
    volatility: number;
}
