-- ==============================================================================
-- SUPABASE SCHEMA - AD ENGINE DASHBOARD
-- ==============================================================================

-- 1. USER PROFILES
-- Extiende la tabla auth.users para información de negocio.
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  business_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Seguridad a nivel de fila)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Política de ejemplo (Opcional, para permitir acceso):
-- CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);


-- 2. DATA SOURCES
-- Registro de las fuentes de datos (Google Sheets) por usuario.
CREATE TABLE public.data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  google_sheet_url TEXT NOT NULL,
  sheet_tab_name TEXT NOT NULL,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'syncing', 'active', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;


-- 3. META METRICS
-- Tabla central de hechos para el rendimiento de anuncios.
-- Granularidad: Por Anuncio (Ad) y Por Día (Report Date).
CREATE TABLE public.meta_metrics (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Dimensiones
  report_date DATE NOT NULL,
  platform TEXT NOT NULL, -- 'fb', 'ig', 'an' (Audience Network), etc.
  campaign_name TEXT,
  adset_name TEXT,
  ad_name TEXT,
  
  -- Métricas de Costos y Alcance
  spend NUMERIC DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  cpm NUMERIC DEFAULT 0,
  reach INTEGER DEFAULT 0,
  frequency NUMERIC DEFAULT 0,
  
  -- Tráfico y Clics (Calidad de Navegación)
  link_clicks INTEGER DEFAULT 0,
  unique_link_clicks INTEGER DEFAULT 0,
  cpc NUMERIC DEFAULT 0,
  ctr NUMERIC DEFAULT 0,        -- Click Through Rate (Todos)
  unique_ctr NUMERIC DEFAULT 0, -- Click Through Rate (Únicos)
  landing_page_views INTEGER DEFAULT 0,
  
  -- Video y Creativos (Retención y Ganchos)
  video_3s_plays INTEGER DEFAULT 0,
  video_plays_25p INTEGER DEFAULT 0,
  video_plays_50p INTEGER DEFAULT 0,
  video_plays_75p INTEGER DEFAULT 0,
  video_plays_95p INTEGER DEFAULT 0,
  video_average_play_time NUMERIC DEFAULT 0,
  hook_rate NUMERIC DEFAULT 0, -- Calculado: (video_3s_plays / impressions)
  hold_rate NUMERIC DEFAULT 0, -- Calculado: (video_plays_95p / video_3s_plays) o similar según definición
  
  -- Conversión y Eficiencia (Resultados)
  leads INTEGER DEFAULT 0,
  purchases INTEGER DEFAULT 0,
  purchase_value NUMERIC DEFAULT 0,
  cost_per_lead NUMERIC DEFAULT 0,
  cost_per_purchase NUMERIC DEFAULT 0,
  roas NUMERIC DEFAULT 0,
  cvr NUMERIC DEFAULT 0, -- Conversion Rate
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.meta_metrics ENABLE ROW LEVEL SECURITY;

-- Índices Recomendados para Consultas de Alto Rendimiento
CREATE INDEX idx_meta_metrics_user_date ON public.meta_metrics(user_id, report_date);
CREATE INDEX idx_meta_metrics_campaign ON public.meta_metrics(user_id, campaign_name);
CREATE INDEX idx_meta_metrics_ad ON public.meta_metrics(user_id, ad_name);

-- Comentarios Descriptivos
COMMENT ON TABLE public.meta_metrics IS 'Almacena métricas diarias granulares de Meta Ads por anuncio.';
COMMENT ON COLUMN public.meta_metrics.unique_ctr IS 'Click Through Rate calculado sobre clics únicos (Vital para evitar ruido).';
COMMENT ON COLUMN public.meta_metrics.hook_rate IS 'Porcentaje de impresiones que ven al menos 3 segundos.';
COMMENT ON COLUMN public.meta_metrics.hold_rate IS 'Porcentaje de retención desde el gancho hasta el final del video (o punto significativo).';
