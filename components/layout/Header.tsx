import React from 'react';
import { Maximize2, Settings } from 'lucide-react';
import { useStore } from '../../store';

interface HeaderProps {
    onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  const { zoomStage } = useStore();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header className={`absolute top-0 left-0 w-full p-6 md:p-8 z-40 flex justify-between items-start pointer-events-none transition-all duration-700 ${zoomStage !== 'IDLE' ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'}`}>
        {/* Watermark Logo */}
        <div className="flex flex-col gap-1 pointer-events-auto select-none opacity-80 hover:opacity-100 transition-opacity">
           <h1 className="text-3xl md:text-5xl font-black tracking-widest kinetic-text leading-none font-display pr-4 pb-1">
              TOMORROW<br/>WHEEL
           </h1>
           <div className="flex items-center gap-2 mt-2">
              <div className="h-[1px] w-8 bg-brand-purple/50"></div>
              <span className="text-white/40 font-bold tracking-[0.3em] text-[10px] uppercase font-display">
                BY TOMORROW THEORY
              </span>
           </div>
        </div>
        
        <div className="flex gap-3 pointer-events-auto">
          <button onClick={toggleFullScreen} className="p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur border border-white/5 transition-colors text-white/50 hover:text-white"><Maximize2 className="w-5 h-5" /></button>
          <button onClick={onOpenAdmin} className="p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur border border-white/5 transition-colors text-white/50 hover:text-white"><Settings className="w-5 h-5" /></button>
        </div>
      </header>
  );
};