export enum Platform {
  META = 'Meta',
  TIKTOK = 'TikTok',
  YOUTUBE = 'YouTube',
}

export enum AdFormat {
  VIDEO = 'Video',
  IMAGE = 'Image',
  CAROUSEL = 'Carousel',
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  AD_LIBRARY = 'AD_LIBRARY',
  AI_STUDIO = 'AI_STUDIO',
  TOOLS = 'TOOLS',
  CAMPAIGNS = 'CAMPAIGNS',
  MY_SPACE = 'MY_SPACE',
  EXECUTIVE = 'EXECUTIVE',
  AI_CREATION = 'AI_CREATION',
  SETTINGS = 'SETTINGS',
}

export interface AdItem {
  id: string;
  thumbnail: string;
  title: string;
  brand: string;
  platform: Platform;
  format: AdFormat;
  metrics: {
    ctr: number;
    conversion: number;
  };
  tags: string[];
  isSaved: boolean;
}

export interface ChartData {
  name: string;
  value: number;
  value2?: number;
}

export interface AnalysisResult {
  title: string;
  content: string;
  tags?: string[];
}

// --- Simulator Types ---
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

export interface SimulationSession {
  id: string;
  name: string;
  date: string;
  params: SimulationParams;
  projectedResults: SimulationTotals;
  actualResults?: {
    spend: number;
    revenue: number;
  };
}
