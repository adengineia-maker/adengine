
export interface MetricData {
    label: string;
    value: number;
    previousValue?: number;
    unit?: string;
    change?: number; // percentage
}

export interface ChartPoint {
    name: string;
    value: number;
    value2?: number; // For comparison
    color?: string;
    [key: string]: any;
}

export interface ActionItem {
    category: 'Recortar' | 'Optimizar' | 'Duplicar' | 'Precio' | 'Marketing';
    title: string;
    description: string;
    impact: 'Alto' | 'Medio' | 'Bajo';
}

export interface FinancialData {
    month: string;
    currency: string;

    // BLOQUE 1: Ingresos
    totalRevenue: MetricData;
    ordersCount: MetricData;
    unitsSold: MetricData;
    clientsCount: MetricData;

    // BLOQUE 2: Costos & Devoluciones
    returns: {
        isProduct: boolean;
        cost: number;
        percentage: number;
    };
    grossMargin: MetricData;

    // BLOQUE 3: OPEX
    opex: MetricData;
    expensesByCategory: ChartPoint[];

    // BLOQUE 4: Marketing (Nuevo)
    marketing: {
        spend: number;
        roas: number;
        cac: number;
    };

    // BLOQUE 5: Flujo de Caja
    cashFlow: {
        in: number;
        out: number;
        balance: number;
    };

    // BLOQUE 6: Rentabilidad
    netProfit: MetricData;

    // Visualizaciones Generales
    revenueByDay: ChartPoint[];
    salesByDayOfWeek: ChartPoint[];
    paymentMethods: ChartPoint[];
    salesBySeller: ChartPoint[];

    // BLOQUE 7: Plan de Acción
    actionPlan: ActionItem[];

    isComplete: boolean;
}

export interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
    isThinking?: boolean;
}

export enum AppState {
    ONBOARDING,
    DASHBOARD,
}
