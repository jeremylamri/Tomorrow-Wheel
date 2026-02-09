import React, { useState, useEffect } from 'react';
import { Wheel } from './components/Wheel';
import { AdminPanel } from './components/AdminPanel';
import { WinnerOverlay } from './components/WinnerOverlay';
import { Background } from './components/layout/Background';
import { Header } from './components/layout/Header';
import { HistoryHUD } from './components/game/HistoryHUD';
import { useStore } from './store';
import { toggleDrone } from './utils/audio';

export default function App() {
  const [isAdminOpen, setAdminOpen] = useState(false);
  const { resetKey, zoomStage } = useStore();
  
  // Audio Drone Management
  useEffect(() => {
    toggleDrone(true);
    return () => {
        toggleDrone(false);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden font-sans selection:bg-brand-purple selection:text-white">
      
      <Background />
      <Header onOpenAdmin={() => setAdminOpen(true)} />

      {/* Main Stage (Monolith Layout) */}
      <main key={resetKey} className="absolute inset-0 z-10">
        
        {/* 1. Center Stage: The Wheel */}
        <div 
            className={`
                absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] gpu-layer
                ${zoomStage === 'ZOOM_IN' || zoomStage === 'REVEALED' ? 'scale-[2.2] translate-y-[15vh] opacity-30' : 'scale-100 translate-y-0 opacity-100'}
            `}
            style={{ willChange: 'transform, opacity' }}
        >
          {/* Back Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow gpu-layer" />
          
          {/* Wheel Container */}
          <div className="w-[85vmin] h-[85vmin] max-w-[800px] max-h-[800px] relative z-20 gpu-layer">
            <Wheel />
          </div>
        </div>

        {/* 2. Floating HUD (History) */}
        <HistoryHUD />

      </main>

      {/* Overlays */}
      <WinnerOverlay />
      {isAdminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
      
    </div>
  );
}