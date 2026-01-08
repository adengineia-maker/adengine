import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface SliderControlProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min: number;
    max: number;
    step: number;
    unit?: string;
    tooltip?: string;
    prefix?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
    label,
    value,
    onChange,
    min,
    max,
    step,
    unit = '',
    prefix = '',
    tooltip
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Format helper
    const formatValue = (val: number) => {
        return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(val);
    };

    // Sync external value changes when not focused
    React.useEffect(() => {
        if (!isFocused) {
            setInputValue(formatValue(value));
        }
    }, [value, isFocused]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        setInputValue(value.toString());
        e.target.select();
    };

    const handleBlur = () => {
        setIsFocused(false);
        setInputValue(formatValue(value));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);

        // Allow empty input (will be 0 or min effectively)
        if (raw === '') {
            onChange(0);
            return;
        }

        // Parse: remove dots (thousands), replace comma with dot (decimal)
        const clean = raw.replace(/\./g, '').replace(',', '.');
        const val = parseFloat(clean);

        if (!isNaN(val)) {
            onChange(val);
        }
    };

    return (
        <div className="mb-6 group">
            <div className="flex justify-between items-center mb-3">
                <label className="text-slate-50 text-sm font-medium flex items-center gap-2">
                    {label}
                    {tooltip && (
                        <div className="relative group/tooltip">
                            <span className="text-slate-400 hover:text-primary-500 cursor-help transition-colors">
                                <AlertCircle size={14} />
                            </span>
                            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-300 z-50 opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all translate-y-2 group-hover/tooltip:translate-y-0">
                                {tooltip}
                                <div className="absolute left-2 -bottom-1 w-2 h-2 bg-slate-900 border-b border-r border-slate-700 transform rotate-45"></div>
                            </div>
                        </div>
                    )}
                </label>
                <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 focus-within:border-primary-500 transition-colors">
                    <span className="text-primary-500 font-mono text-sm select-none">{prefix}</span>
                    <input
                        type="text"
                        value={inputValue}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        className="w-24 bg-transparent text-primary-500 font-mono text-sm outline-none text-right appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-primary-500 font-mono text-sm select-none">{unit}</span>
                </div>
            </div>
            <div className="relative h-2 w-full">
                <div className="absolute top-0 left-0 bottom-0 right-0 bg-slate-800 rounded-lg" />
                <div
                    className="absolute top-0 left-0 bottom-0 bg-primary-500/30 rounded-lg pointer-events-none"
                    style={{ width: `${Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full shadow-lg border-2 border-white pointer-events-none transition-transform group-hover:scale-110"
                    style={{ left: `calc(${Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))}% - 8px)` }}
                />
            </div>
        </div>
    );
};
