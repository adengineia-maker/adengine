
import React from 'react';
import {
  LayoutDashboard,
  BarChart2,
  Sparkles,
  Megaphone,

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
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all gap-1 w-16 h-16 ${currentView === view
        ? 'bg-[#D1F80C] text-black font-bold shadow-[0_0_15px_rgba(209,248,12,0.3)]'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
        } `}
    >
      <Icon size={20} strokeWidth={currentView === view ? 2.5 : 1.5} />
      <span className="text-[9px] font-medium leading-none text-center">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden text-slate-50 font-sans bg-black">

      {/* Rail Sidebar */}
      <aside className="w-20 flex flex-col items-center py-6 border-r border-white/10 bg-[#111] z-50 overflow-y-auto no-scrollbar">


        {/* Logo */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D1F80C] to-[#a3c20a] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(209,248,12,0.2)] shrink-0">
          <span className="font-bold text-black text-[10px]">ADS</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-3 w-full items-center">
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />

          <NavItem view={ViewState.CAMPAIGNS} icon={BarChart2} label="Análisis" />
          <NavItem view={ViewState.AI_CREATION} icon={Sparkles} label="Creación IA" />
          <NavItem view={ViewState.MY_SPACE} icon={Megaphone} label="Mi Marca" />
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto flex flex-col gap-6 items-center pb-6">
          {/* Meta Connect - Compact Icon */}
          <div className="scale-75 origin-bottom">
            <MetaConnect compact={true} />
          </div>

          {/* User Profile */}
          <div className="scale-110 hover:scale-125 transition-transform duration-200">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-white/20 hover:ring-[#D1F80C] transition-all"
                }
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-black">
        {/* Content Area - No Header */}
        <div className={`flex-1 ${isImmersive ? 'overflow-hidden p-0' : 'overflow-y-auto px-8 py-8 scroll-smooth'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};