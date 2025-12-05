import React, { useState } from 'react';
import { Layout } from './components/Layout';

import { MySpace } from './components/MySpace';
import { DashboardExecutive } from './components/DashboardExecutive';
import { AnalysisView } from './components/AnalysisView';
import { AICreationHub } from './components/AICreationHub';
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
      case ViewState.TOOLS:
        return <ToolsPlaceholder />;
      default:
        return <DashboardExecutive setView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} isImmersive={isImmersive}>
      {renderContent()}
    </Layout>
  );
}

export default App;