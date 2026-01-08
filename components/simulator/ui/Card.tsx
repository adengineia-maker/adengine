import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm transition-all duration-300 ${className}`}>
        {children}
    </div>
);
