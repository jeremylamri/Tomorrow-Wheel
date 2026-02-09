import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { NumberDraw } from './NumberDraw';
import { Gift, CheckCircle, Sparkles } from 'lucide-react';

export const WinnerOverlay: React.FC = () => {
  const { winner, setWinner, zoomStage, setZoomStage } = useStore();
  const [step, setStep] = useState<'PRIZE' | 'DRAWING_NUMBER' | 'FINISHED'>('PRIZE');

  useEffect(() => {
    if (zoomStage === 'REVEALED') {
      setStep('PRIZE');
    }
  }, [zoomStage]);

  if (zoomStage !== 'REVEALED' || !winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-700 gpu-layer">
      
      {/* 1. Backdrop: Deep Dark Opaque background to prevent wheel flickering underneath. 
          Removed backdrop-blur-xl which causes massive repaints on large surfaces. */}
      <div 
        className="absolute inset-0 bg-[#050505]/95 transition-all duration-1000 gpu-layer"
      ></div>
      
      {/* Use shared global noise class */}
      <div className="absolute inset-0 bg-noise opacity-30 gpu-layer"></div>
      
      {/* 2. Shockwave effect on entry */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full animate-shockwave pointer-events-none gpu-layer" />

      {/* 3. Main Card */}
      <div className="relative z-50 text-center p-10 max-w-5xl w-full flex flex-col items-center gpu-layer">
        
        {/* Step 1: Display Prize */}
        <div className={`transform transition-all duration-1000 gpu-layer ${step !== 'PRIZE' ? 'scale-75 opacity-50 blur-[4px] mb-8' : 'scale-100 opacity-100 mb-16'}`}>
          <div className="flex flex-col items-center gap-6">
              
              <div className="relative gpu-layer">
                  <div className="absolute inset-0 bg-brand-purple blur-[60px] opacity-60 animate-pulse-slow gpu-layer"></div>
                  <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-darkPurple flex items-center justify-center shadow-[0_20px_60px_rgba(191,90,242,0.5)] border border-white/20">
                     <Gift className="w-14 h-14 text-white drop-shadow-lg" />
                  </div>
              </div>

              <div>
                  <h2 className="text-2xl text-brand-purple font-display font-bold tracking-widest uppercase mb-4 opacity-80">Lot Remporté</h2>
                  <div className="text-5xl md:text-7xl font-black text-white font-display drop-shadow-[0_0_40px_rgba(191,90,242,0.8)] leading-tight max-w-4xl">
                    {winner.label}
                  </div>
              </div>
          </div>
        </div>

        {/* Step 2: Draw Number Interface */}
        {step === 'PRIZE' && (
          <button 
            onClick={() => setStep('DRAWING_NUMBER')}
            className="group relative px-12 py-6 bg-white text-black rounded-full font-display font-black text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] overflow-hidden gpu-layer"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
             <span className="relative flex items-center gap-3">
                TIRER LE NUMÉRO GAGNANT <Sparkles className="w-5 h-5" />
             </span>
          </button>
        )}

        {step !== 'PRIZE' && (
           <div className="w-full max-w-2xl animate-in slide-in-from-bottom-20 fade-in duration-700 glass-high rounded-[40px] p-12 border border-white/20 shadow-2xl gpu-layer">
              <NumberDraw 
                variant="overlay" 
                onComplete={() => setStep('FINISHED')} 
              />
              
              {step === 'FINISHED' && (
                <button 
                  onClick={() => {
                      setWinner(null);
                      setZoomStage('IDLE');
                  }}
                  className="mt-10 w-full py-5 bg-brand-green/20 border border-brand-green/50 text-green-400 rounded-2xl font-bold font-display tracking-widest text-lg hover:bg-brand-green/30 transition-all flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-500"
                >
                  <CheckCircle className="w-6 h-6" />
                  CONFIRMER & TERMINER
                </button>
              )}
           </div>
        )}

      </div>
    </div>
  );
};