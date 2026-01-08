import React from 'react';
import { Settings as SettingsIcon, Link2 } from 'lucide-react';
import FacebookConnect from './FacebookConnect';

export const Settings = () => {
    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <SettingsIcon size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-light text-white tracking-tight">Configuración</h1>
                    <p className="text-slate-400 font-light">Gestiona tus preferencias e integraciones</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl space-y-8">

                {/* Integrations Section */}
                <div className="space-y-4">
                    <h2 className="text-sm uppercase tracking-wider text-slate-500 font-medium ml-1">Integraciones</h2>

                    <div className="bg-[#131314] rounded-2xl border border-white/5 overflow-hidden">
                        {/* Facebook Ads */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-[#1877F2]/10 rounded-xl flex items-center justify-center border border-[#1877F2]/20">
                                        <Link2 size={24} className="text-[#1877F2]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white">Facebook Ads</h3>
                                        <p className="text-sm text-slate-400 mt-1 max-w-sm">
                                            Conecta tu cuenta publicitaria para importar campañas, analíticas y creativos directamente a AdEngine.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pl-16">
                                <FacebookConnect onAccountSelect={(id, name) => console.log('Selected:', id, name)} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
