
import React from 'react';
import {
  LayoutDashboard,
  BarChart2,
  Sparkles,
  Megaphone,
  Settings as SettingsIcon,
} from 'lucide-react';
import { ViewState } from '../types';
import { MetaConnect } from './MetaConnect';

import { UserButton } from "@clerk/clerk-react";

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
  isImmersive?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children, isImmersive = false }) => {

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setView(view)}
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 gap-1 w-16 h-16 ${currentView === view
        ? 'text-[#c6ef4e] bg-white/5 backdrop-blur-md border border-white/5 shadow-[0_0_12px_rgba(198,239,78,0.5)]'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
        } `}
    >
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 1.5} className={currentView === view ? "drop-shadow-[0_0_8px_rgba(198,239,78,0.8)]" : ""} />
      <span className="text-[9px] font-medium leading-none text-center mt-1">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden text-slate-200 font-sans bg-transparent">

      {/* Rail Sidebar - Dark Crystal */}
      <aside className="w-20 flex flex-col items-center py-6 z-50 overflow-y-auto no-scrollbar"
        style={{
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)'
        }}>


        {/* Logo */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c6ef4e] to-[#a3c20a] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(198,239,78,0.4)] shrink-0 group hover:shadow-[0_0_30px_rgba(198,239,78,0.6)] transition-shadow duration-500">
          <span className="font-bold text-black text-[10px]">ADS</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-4 w-full items-center">
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />

          <NavItem view={ViewState.CAMPAIGNS} icon={BarChart2} label="Análisis" />
          <NavItem view={ViewState.AI_CREATION} icon={Sparkles} label="Creación IA" />
          <NavItem view={ViewState.MY_SPACE} icon={Megaphone} label="Mi Marca" />
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto flex flex-col gap-6 items-center pb-6">
          <button
            onClick={() => setView(ViewState.SETTINGS)}
            className={`p-2 rounded-xl transition-all duration-300 ${currentView === ViewState.SETTINGS
              ? 'text-[#c6ef4e] bg-white/5 shadow-[0_0_12px_rgba(198,239,78,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            title="Configuración"
          >
            <SettingsIcon size={20} />
          </button>

          {/* Meta Connect - Compact Icon */}
          <div className="scale-75 origin-bottom opacity-80 hover:opacity-100 transition-opacity">
            <MetaConnect compact={true} />
          </div>

          {/* User Profile */}
          <div className="scale-110 hover:scale-125 transition-transform duration-200">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-white/20 hover:ring-[#c6ef4e] transition-all shadow-lg hover:shadow-[0_0_15px_rgba(198,239,78,0.4)]"
                }
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-transparent">
        {/* Content Area - No Header */}
        <div className={`flex-1 ${isImmersive ? 'overflow-hidden p-0' : 'overflow-y-auto px-8 py-8 scroll-smooth'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};