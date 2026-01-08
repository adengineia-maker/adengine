import React, { useState } from 'react';
import { Layout } from './components/Layout';

import { MySpace } from './components/MySpace';
import { DashboardExecutive } from './components/DashboardExecutive';
import { AnalysisView } from './components/AnalysisView';
import { AICreationHub } from './components/AICreationHub';
import { AIStudio } from './components/AIStudio';
import { Settings } from './components/Settings';
import { ViewState } from './types';
import { Activity, Rocket, ArrowRight } from 'lucide-react';

const ToolsPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-glow-lg animate-pulse">
      <Rocket size={40} className="text-slate-400" />
    </div>
    <h2 className="text-3xl font-light text-white tracking-tight">Próximamente</h2>
    <p className="max-w-md text-center mt-4 text-slate-400 font-light">
      Herramientas avanzadas de espionaje y transcripción están en el laboratorio.
    </p>
  </div>
);

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isImmersive, setIsImmersive] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <DashboardExecutive setView={setCurrentView} />;
      case ViewState.MY_SPACE:
        return <MySpace />;

      case ViewState.CAMPAIGNS:
        return <AnalysisView />;
      case ViewState.AI_CREATION:
        return <AICreationHub setView={setCurrentView} setIsImmersive={setIsImmersive} />;
      case ViewState.AI_STUDIO:
        return <AIStudio />;
      case ViewState.TOOLS:
        return <ToolsPlaceholder />;
      case ViewState.SETTINGS:
        return <Settings />;
      default:
        return <DashboardExecutive setView={setCurrentView} />;
    }
  };

  return (
    <>

      {/* 
      <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D1F80C] to-[#a3c20a] flex items-center justify-center shadow-[0_0_30px_rgba(209,248,12,0.3)]">
            <span className="font-bold text-black text-2xl">ADS</span>
          </div>
          <h1 className="text-3xl font-light">Bienvenido a AdEngine</h1>
          <SignInButton mode="modal">
            <button className="bg-[#D1F80C] text-black px-8 py-3 rounded-full font-bold hover:bg-[#b5d60a] transition-all shadow-lg hover:shadow-[#D1F80C]/20">
              Iniciar Sesión
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
      */}
      <Layout currentView={currentView} setView={setCurrentView} isImmersive={isImmersive}>
        {renderContent()}
      </Layout>
      {/* </SignedIn> */}

    </>
  );
}

export default App;