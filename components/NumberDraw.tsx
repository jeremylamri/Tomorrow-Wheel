import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { playLock, playWin } from '../utils/audio';
import { RotateCcw } from 'lucide-react';
import { getSecureRandomInt } from '../utils/random';

interface NumberDrawProps {
  variant?: 'default' | 'overlay';
  onComplete?: () => void;
}

// Single Digit Component (Slot Effect)
const DigitColumn: React.FC<{ 
  target: string; 
  isLocked: boolean; 
  delay: number;
  trigger: boolean;
}> = ({ target, isLocked, delay, trigger }) => {
  const [display, setDisplay] = useState("0");
  const [blur, setBlur] = useState(false);
  
  useEffect(() => {
    if (!trigger) {
        setDisplay("0");
        return;
    }

    if (isLocked) {
      setDisplay(target);
      setBlur(false);
      playLock(); // Mechanical Clank on lock
      return;
    }

    // Spinning state
    setBlur(true);
    const interval = setInterval(() => {
      setDisplay(Math.floor(Math.random() * 10).toString());
    }, 50);

    return () => clearInterval(interval);
  }, [trigger, isLocked, target]);

  return (
    <div className={`relative w-12 md:w-20 h-24 md:h-32 flex items-center justify-center bg-black/40 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md shadow-inner transition-all duration-300 ${isLocked ? 'border-brand-blue/50 bg-brand-blue/10 scale-105' : ''}`}>
      <span className={`text-4xl md:text-7xl font-mono font-bold text-white transition-all ${blur ? 'slot-blur opacity-70 scale-110' : 'scale-100'}`}>
        {display}
      </span>
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>
    </div>
  );
};

export const NumberDraw: React.FC<NumberDrawProps> = ({ variant = 'default', onComplete }) => {
  const { drawnNumbers, addDrawnNumber, addToHistory, resetDrawnNumbers, maxNumber } = useStore();
  
  const padLength = maxNumber.toString().length;
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [targetNumber, setTargetNumber] = useState<string>("0".repeat(padLength));
  const [lockedIndices, setLockedIndices] = useState<number[]>([]);

  // Effect to handle reset
  useEffect(() => {
    if (drawnNumbers.length === 0) {
      setHasRolled(false);
      setIsRolling(false);
      setLockedIndices([]);
      setTargetNumber("0".repeat(padLength));
    }
  }, [drawnNumbers, maxNumber, padLength]);

  const handleReset = () => {
    if(window.confirm("Réinitialiser le compteur ?")) {
      resetDrawnNumbers();
    }
  };

  const drawNumber = () => {
    if (isRolling) return;
    setIsRolling(true);
    setLockedIndices([]);

    // 1. Determine Result
    let newNum = getSecureRandomInt(1, maxNumber);
    let attempts = 0;
    while (drawnNumbers.includes(newNum) && attempts < 100) {
      newNum = getSecureRandomInt(1, maxNumber);
      attempts++;
    }
    
    if (drawnNumbers.length >= maxNumber) {
        alert("Tous les numéros ont été tirés !");
        setIsRolling(false);
        return;
    }

    const targetStr = newNum.toString().padStart(padLength, '0');
    setTargetNumber(targetStr);

    // 2. Sequence Logic (Decryption Style)
    // Lock digits one by one from left to right
    let currentLockIndex = 0;
    
    const lockInterval = setInterval(() => {
        setLockedIndices(prev => [...prev, currentLockIndex]);
        currentLockIndex++;

        if (currentLockIndex >= padLength) {
            clearInterval(lockInterval);
            finalize(newNum);
        }
    }, 800); // 800ms per digit for dramatic effect
  };

  const finalize = (num: number) => {
    addDrawnNumber(num);
    addToHistory({
        id: Date.now().toString(),
        type: 'NUMBER',
        value: num.toString(),
        timestamp: Date.now()
    });
    
    setIsRolling(false);
    setHasRolled(true);
    playWin(); // Big Finish Sound
    
    // Confetti burst on reveal
    if ((window as any).confetti) {
        (window as any).confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#0A84FF', '#ffffff', '#BF5AF2'],
            zIndex: 200
        });
    }
    
    if (onComplete) {
      setTimeout(onComplete, 1000);
    }
  };

  const isOverlay = variant === 'overlay';

  return (
    <div className={`flex flex-col items-center gap-6 transition-all ${isOverlay ? 'w-full' : 'glass p-6 rounded-[24px] min-w-[200px] hover:bg-white/5'}`}>
      
      {!isOverlay && (
        <div className="w-full flex justify-between items-center border-b border-white/10 pb-2 mb-2">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider font-display">Tirage Numéro</span>
          {drawnNumbers.length > 0 && !isRolling && (
            <button onClick={handleReset} className="p-2 text-gray-500 hover:text-red-400 rounded-full transition-colors"><RotateCcw className="w-4 h-4" /></button>
          )}
        </div>
      )}

      {/* DIGIT COLUMNS */}
      <div className="flex gap-2 md:gap-4 p-4 bg-black/20 rounded-2xl shadow-inner border border-white/5">
         {Array.from({ length: padLength }).map((_, i) => (
             <DigitColumn 
                key={i}
                target={targetNumber[i] || "0"}
                isLocked={lockedIndices.includes(i)}
                delay={i * 200}
                trigger={isRolling || hasRolled}
             />
         ))}
      </div>
      
      {!hasRolled && (
        <button 
          onClick={drawNumber}
          disabled={isRolling}
          className={`
            font-semibold transition-all active:scale-95 disabled:opacity-50 border border-white/10 shadow-lg font-display tracking-widest uppercase
            ${isOverlay 
              ? 'px-12 py-5 text-xl rounded-full bg-brand-blue hover:bg-brand-blue/80 text-white shadow-[0_0_30px_rgba(10,132,255,0.4)] animate-pulse-slow' 
              : 'w-full py-3 px-6 bg-[#2C2C2E] hover:bg-[#3A3A3C] rounded-xl'
            }
          `}
        >
          {isRolling ? 'DÉCRYPTAGE...' : 'LANCER LE PROTOCOLE'}
        </button>
      )}

      {/* Mini History */}
      {!isOverlay && drawnNumbers.length > 0 && (
        <div className="flex gap-2 mt-2 overflow-x-auto w-full pb-2 mask-linear">
           {drawnNumbers.slice(-5).reverse().map((n, i) => (
               <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-md font-mono text-gray-400 border border-white/5 whitespace-nowrap">{n}</span>
           ))}
        </div>
      )}
    </div>
  );
};