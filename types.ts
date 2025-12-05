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
