import React, { useState } from 'react';
import { Folder, FileText, Users, Target, Search, Plus, MoreVertical, Clock } from 'lucide-react';

enum SpaceTab {
    PRODUCTS = 'PRODUCTS',
    AUDIENCES = 'AUDIENCES',
    STRATEGIES = 'STRATEGIES',
    RESEARCH = 'RESEARCH'
}

interface SpaceItem {
    id: string;
    title: string;
    type: SpaceTab;
    updatedAt: string;
    description: string;
}

const MOCK_ITEMS: SpaceItem[] = [
    {
        id: '1',
        title: 'SmartWatch Pro',
        type: SpaceTab.PRODUCTS,
        updatedAt: 'Hace 2 horas',
        description: 'Reloj inteligente de alta gama con GPS y resistencia al agua.'
    },
    {
        id: '2',
        title: 'Corredores de Maratón',
        type: SpaceTab.AUDIENCES,
        updatedAt: 'Hace 1 día',
        description: 'Personas interesadas en running, maratones y fitness al aire libre.'
    },
    {
        id: '3',
        title: 'Estrategia PAS - Q3',
        type: SpaceTab.STRATEGIES,
        updatedAt: 'Hace 3 días',
        description: 'Enfoque en Problema-Agitación-Solución para la campaña de verano.'
    },
    {
        id: '4',
        title: 'Análisis Competencia - TechWear',
        type: SpaceTab.RESEARCH,
        updatedAt: 'Hace 1 semana',
        description: 'Investigación profunda sobre los principales competidores en el nicho.'
    }
];

export const MySpace: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SpaceTab>(SpaceTab.PRODUCTS);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = MOCK_ITEMS.filter(item =>
        item.type === activeTab &&
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const TabButton = ({ tab, icon: Icon, label }: { tab: SpaceTab, icon: any, label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${activeTab === tab
                    ? 'bg-primary-500 text-slate-950 shadow-glow'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="h-full flex flex-col space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-light text-white tracking-tight">Mi <span className="font-bold">Espacio</span></h2>
                    <p className="text-slate-400 mt-2 font-light text-lg">Gestiona tus activos creativos, investigaciones y documentos.</p>
                </div>
                <button className="bg-white text-slate-950 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors shadow-lg">
                    <Plus size={20} />
                    <span>Crear Nuevo</span>
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex flex-wrap gap-3">
                    <TabButton tab={SpaceTab.PRODUCTS} icon={Target} label="Productos" />
                    <TabButton tab={SpaceTab.AUDIENCES} icon={Users} label="Públicos" />
                    <TabButton tab={SpaceTab.STRATEGIES} icon={FileText} label="Estrategias" />
                    <TabButton tab={SpaceTab.RESEARCH} icon={Search} label="Research" />
                </div>

                <div className="relative w-full md:w-64 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-primary-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar documentos..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-full py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-primary-500 transition-all placeholder-slate-600"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="glass-card p-6 rounded-3xl hover:bg-white/5 transition-all group cursor-pointer border border-white/5 hover:border-primary-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                {item.type === SpaceTab.PRODUCTS && <Target size={24} className="text-blue-400" />}
                                {item.type === SpaceTab.AUDIENCES && <Users size={24} className="text-purple-400" />}
                                {item.type === SpaceTab.STRATEGIES && <FileText size={24} className="text-green-400" />}
                                {item.type === SpaceTab.RESEARCH && <Search size={24} className="text-orange-400" />}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{item.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">{item.description}</p>

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Clock size={14} />
                            <span>Actualizado {item.updatedAt}</span>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-3xl bg-white/5">
                        <Folder size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium text-slate-400">No hay documentos en esta sección</p>
                        <p className="text-sm">Crea uno nuevo para empezar a organizar tu espacio.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
