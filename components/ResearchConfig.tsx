import React, { useState } from 'react';
import { ArrowRight, Plus, X, Link as LinkIcon, ChevronDown, Check, Globe } from 'lucide-react';

interface ResearchConfigProps {
    onStart: (data: any) => void;
    onCancel: () => void;
}

export const ResearchConfig: React.FC<ResearchConfigProps> = ({ onStart, onCancel }) => {
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [selectedObjective, setSelectedObjective] = useState<string>('');
    const [referenceLinks, setReferenceLinks] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

    const products = ['E-commerce Fashion', 'SaaS B2B', 'Real Estate Premium'];
    const countries = ['Global', 'Estados Unidos', 'España', 'México', 'Colombia', 'Argentina', 'Chile'];
    const objectives = ['Ventas', 'Leads', 'Awareness', 'Tráfico', 'Otro'];

    const handleStart = () => {
        setIsLoading(true);
        // Simulate system processing time (400-600ms)
        setTimeout(() => {
            onStart({ product: selectedProduct, countries: selectedCountries, objective: selectedObjective, links: referenceLinks });
        }, 600);
    };

    const toggleCountry = (country: string) => {
        if (selectedCountries.includes(country)) {
            setSelectedCountries(selectedCountries.filter(c => c !== country));
        } else {
            if (country === 'Global') {
                setSelectedCountries(['Global']);
            } else {
                const newSelection = selectedCountries.filter(c => c !== 'Global');
                setSelectedCountries([...newSelection, country]);
            }
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div
                className={`w-full max-w-2xl rounded-[40px] border border-[var(--border-color)] p-10 shadow-2xl relative overflow-visible backdrop-blur-md transition-all duration-500 ${isLoading ? 'scale-95 opacity-90' : ''}`}
                style={{ background: 'linear-gradient(to bottom, var(--gradient-start), var(--gradient-end))' }}
            >
                {/* Header */}
                <div className={`text-center mb-8 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">Configuración del Research</h2>
                    <p className="text-[var(--text-secondary)] text-sm">Define el contexto para que la IA realice un análisis preciso.</p>
                </div>

                <div className={`space-y-8 transition-opacity duration-300 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                    {/* 1. Product or Service */}
                    <div className="space-y-3">
                        <label className="text-[var(--text-primary)] text-sm font-medium block">¿Cuál es el producto o servicio?</label>
                        <div className="relative">
                            <button
                                onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-4 text-left flex items-center justify-between text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
                            >
                                <span className={selectedProduct ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}>
                                    {selectedProduct || 'Selecciona un producto...'}
                                </span>
                                <ChevronDown size={20} className="text-[var(--text-secondary)]" />
                            </button>

                            {isProductDropdownOpen && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl shadow-xl z-50 overflow-hidden">
                                    {products.map(product => (
                                        <button
                                            key={product}
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setIsProductDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-between group"
                                        >
                                            <span>{product}</span>
                                            {selectedProduct === product && <Check size={16} className="text-[var(--accent-color)]" />}
                                        </button>
                                    ))}
                                    <div className="p-2 border-t border-[var(--border-color)]">
                                        <button className="w-full border border-[var(--accent-color)] text-[var(--accent-color)] rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-[var(--accent-color)] hover:text-black transition-all font-medium text-sm">
                                            <Plus size={16} />
                                            Crear nuevo producto
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Country Focus */}
                    <div className="space-y-3">
                        <label className="text-[var(--text-primary)] text-sm font-medium block">¿En qué país o países se hará foco?</label>
                        <div className="relative">
                            <div
                                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-3 min-h-[56px] flex flex-wrap gap-2 cursor-pointer hover:border-[var(--border-hover)] transition-colors"
                                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                            >
                                {selectedCountries.length === 0 && (
                                    <span className="text-[var(--text-secondary)] self-center ml-1">Selecciona países...</span>
                                )}
                                {selectedCountries.map(country => (
                                    <span key={country} className="bg-[var(--bg-primary)] border border-[var(--accent-color)] text-[var(--text-primary)] text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                                        {country}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleCountry(country);
                                            }}
                                            className="hover:text-[var(--accent-color)]"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                <div className="ml-auto self-center">
                                    <ChevronDown size={20} className="text-[var(--text-secondary)]" />
                                </div>
                            </div>

                            {isCountryDropdownOpen && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                                    {countries.map(country => (
                                        <button
                                            key={country}
                                            onClick={() => toggleCountry(country)}
                                            className="w-full text-left px-4 py-3 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>{country}</span>
                                                {country === 'Global' && (
                                                    <span className="bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-[10px] px-2 py-0.5 rounded-full border border-[var(--accent-color)]/20">Recomendado</span>
                                                )}
                                            </div>
                                            {selectedCountries.includes(country) && <Check size={16} className="text-[var(--accent-color)]" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Objective */}
                    <div className="space-y-3">
                        <label className="text-[var(--text-primary)] text-sm font-medium block">¿Cuál es el objetivo principal del Research?</label>
                        <div className="flex flex-wrap gap-3">
                            {objectives.map(obj => (
                                <button
                                    key={obj}
                                    onClick={() => setSelectedObjective(obj)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedObjective === obj
                                        ? 'bg-[var(--accent-color)] text-black shadow-[0_0_15px_rgba(184,243,11,0.2)]'
                                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    {obj}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Reference Links */}
                    <div className="space-y-3">
                        <label className="text-[var(--text-primary)] text-sm font-medium block">Links de referencia (opcional)</label>
                        <div className="relative">
                            <div className="absolute top-4 left-4 text-[var(--text-secondary)]">
                                <LinkIcon size={18} />
                            </div>
                            <textarea
                                value={referenceLinks}
                                onChange={(e) => setReferenceLinks(e.target.value)}
                                placeholder="Agrega links de competidores, anuncios, landings o referencias a considerar..."
                                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-color)] min-h-[100px] resize-y text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* CTA Actions */}
                <div className="mt-10 flex flex-col gap-4">
                    <button
                        onClick={handleStart}
                        disabled={isLoading}
                        className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(184,243,11,0.2)] ${isLoading
                                ? 'bg-[var(--accent-color)]/80 text-black cursor-wait'
                                : 'bg-[var(--accent-color)] text-black hover:bg-[var(--accent-hover)] hover:shadow-[0_0_30px_rgba(184,243,11,0.3)] hover:-translate-y-0.5'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                <span>Iniciando...</span>
                            </>
                        ) : (
                            <>
                                <span>Iniciar Research</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className={`w-full text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition-colors py-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
