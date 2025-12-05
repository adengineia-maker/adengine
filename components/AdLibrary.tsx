import React, { useState } from 'react';
import { Platform, AdFormat, AdItem } from '../types';
import { Filter, Play, Heart, Download, Share2 } from 'lucide-react';

const MOCK_ADS: AdItem[] = Array.from({ length: 9 }).map((_, i) => ({
  id: `ad-${i}`,
  title: [
    "Escala tus ingresos SaaS hoy",
    "La sudadera más cómoda",
    "Deja de perder tiempo en hojas de cálculo",
    "Obtén 30% de descuento en tu primer pedido",
    "Nuevas funciones de IA lanzadas",
    "Detrás de cámaras en nuestra fábrica",
    "Testimonio de cliente: Sarah K.",
    "Venta Flash termina en 24h",
    "Cómo usar nuestro producto"
  ][i],
  brand: ["TechFlow", "ComfyWear", "SheetMaster", "GlowUp", "BrainBox", "CraftCo", "Healthify", "QuickBuy", "LearnIt"][i],
  platform: i % 3 === 0 ? Platform.META : i % 3 === 1 ? Platform.TIKTOK : Platform.YOUTUBE,
  format: i % 2 === 0 ? AdFormat.VIDEO : AdFormat.IMAGE,
  thumbnail: `https://picsum.photos/400/500?random=${i}`,
  metrics: {
    ctr: Number((Math.random() * 2 + 0.5).toFixed(2)),
    conversion: Number((Math.random() * 5 + 1).toFixed(2))
  },
  tags: ["ecom", "b2b", "saas", "moda"].slice(0, 2),
  isSaved: false
}));

export const AdLibrary: React.FC = () => {
  const [ads, setAds] = useState<AdItem[]>(MOCK_ADS);
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'ALL'>('ALL');

  const filteredAds = ads.filter(ad =>
    filterPlatform === 'ALL' || ad.platform === filterPlatform
  );

  const toggleSave = (id: string) => {
    setAds(ads.map(ad => ad.id === id ? { ...ad, isSaved: !ad.isSaved } : ad));
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-bold tracking-widest uppercase border border-primary-500/20">
              Inspiración
            </span>
          </div>
          <h2 className="text-4xl font-light text-white tracking-tight">Biblioteca <span className="font-bold text-slate-100">Creativa</span></h2>
        </div>

        <div className="flex gap-3">
          <div className="glass-panel rounded-full px-2 flex items-center p-1">
            <button
              onClick={() => setFilterPlatform('ALL')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterPlatform === 'ALL' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterPlatform(Platform.META)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterPlatform === Platform.META ? 'bg-[#0668E1] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Meta
            </button>
            <button
              onClick={() => setFilterPlatform(Platform.TIKTOK)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterPlatform === Platform.TIKTOK ? 'bg-black text-white shadow-lg border border-slate-700' : 'text-slate-400 hover:text-white'}`}
            >
              TikTok
            </button>
          </div>

          <button className="glass-panel w-12 h-12 rounded-full flex items-center justify-center text-slate-300 hover:text-primary-500 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredAds.map((ad) => (
          <div key={ad.id} className="group relative glass-card rounded-3xl overflow-hidden hover:shadow-glow transition-all duration-500">
            {/* Thumbnail */}
            <div className="aspect-[4/5] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-90 transition-opacity"></div>
              <img
                src={ad.thumbnail}
                alt={ad.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <span className="glass-panel px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-wide uppercase backdrop-blur-md">
                  {ad.platform}
                </span>
              </div>

              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={() => toggleSave(ad.id)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-xl border border-white/10 transition-colors ${ad.isSaved ? 'bg-primary-500 text-black' : 'bg-black/50 text-white hover:bg-black/70'}`}
                >
                  <Heart size={18} fill={ad.isSaved ? "currentColor" : "none"} />
                </button>
              </div>

              {ad.format === AdFormat.VIDEO && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
                    <Play size={28} className="fill-white text-white ml-1" />
                  </div>
                </div>
              )}

              {/* Metrics Overlay on Hover */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/60 backdrop-blur rounded-2xl p-3 text-center border border-white/5">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">CTR</p>
                    <p className="text-lg font-bold text-primary-500">{ad.metrics.ctr}%</p>
                  </div>
                  <div className="bg-black/60 backdrop-blur rounded-2xl p-3 text-center border border-white/5">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Conv.</p>
                    <p className="text-lg font-bold text-white">{ad.metrics.conversion}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content info below */}
            <div className="p-5 relative z-20 bg-[#151515]">
              <h3 className="font-medium text-slate-200 text-lg leading-tight line-clamp-1 mb-1 group-hover:text-primary-500 transition-colors">{ad.title}</h3>
              <p className="text-sm text-slate-500">{ad.brand}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};