import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useStore } from '../store';
import { playTick, playWin } from '../utils/audio';
import { getSecureRandomInt, getSecureRandomFloat } from '../utils/random';

// "Bold Pastels"
const BOLD_PASTELS = [
  ['#D989FF', '#A530FF'], // Bold Lilac
  ['#6FB9FF', '#007AFF'], // Bold Sky Blue
  ['#60E080', '#00A040'], // Bold Mint Green
  ['#FF7D9C', '#FF2D60'], // Bold Rose
  ['#FFC060', '#FF8500'], // Bold Tangerine
  ['#5FD0EE', '#0090B0'], // Bold Cyan
  ['#9090FF', '#5050D0'], // Bold Indigo
  ['#FFD65C', '#E0A000'], // Bold Yellow
];

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export const Wheel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null); // Physics ticker
  
  const { lots, history, isSpinning, setSpinning, setWinner, vipMode, forcedLotId, addToHistory, setZoomStage } = useStore();
  
  // Physics state
  const velocityRef = useRef(0);
  const rotationRef = useRef(0);
  const requestRef = useRef<number>(0);
  const lastTickRef = useRef(-1);

  const [centerSize, setCenterSize] = useState(100);

  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // ANIMATE TICKER (Physics Bounce)
  const animateTicker = useCallback(() => {
     if(tickerRef.current) {
         // Remove class to reset
         tickerRef.current.classList.remove('animate-tick');
         // Force reflow
         void tickerRef.current.offsetWidth;
         // Add class
         tickerRef.current.classList.add('animate-tick');
     }
  }, []);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = (width / 2) - 20;
    const numSegments = lots.length;
    const arcSize = (2 * Math.PI) / numSegments;
    const currentRotation = rotationRef.current;

    ctx.clearRect(0, 0, width, height);

    // 1. Shadow / Outer Glow
    ctx.shadowBlur = 60;
    ctx.shadowColor = '#BF5AF2';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(191, 90, 242, 0.6)';
    ctx.lineWidth = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 2. Segments
    lots.forEach((lot, i) => {
      const angle = currentRotation + i * arcSize;
      const isWon = history.some(h => h.type === 'WHEEL' && h.value === lot.label);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
      
      if (isWon) {
        ctx.fillStyle = '#1a1a1a';
      } else {
        const gradient = ctx.createLinearGradient(centerX, centerY, 
          centerX + Math.cos(angle + arcSize/2) * radius, 
          centerY + Math.sin(angle + arcSize/2) * radius
        );
        const colorPair = BOLD_PASTELS[i % BOLD_PASTELS.length];
        gradient.addColorStop(0, colorPair[1]);
        gradient.addColorStop(1, colorPair[0]);
        ctx.fillStyle = gradient;
      }
      ctx.fill();
      
      // Segment Borders
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      // 3. Inner Specular Highlight (Glass edge effect)
      if (!isWon) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius - 2, angle, angle + arcSize);
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 2;
          ctx.stroke();
      }

      // Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      
      if (isWon) {
        ctx.fillStyle = '#444';
      } else {
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
      }
      
      const fontSize = Math.max(14, radius / 24); // Slightly reduced from 22 to 24 to prevent cropping
      ctx.font = `700 ${fontSize}px Syne`; 
      ctx.textBaseline = 'middle'; // Improve vertical alignment logic
      const lineHeight = fontSize * 1.2;
      
      const textRadius = radius - 30;
      const lines = wrapText(ctx, lot.label, radius * 0.55);
      
      // Vertical centering for 'middle' baseline
      // Calculate total height spanned by centers of lines: (N-1) * lineHeight
      // Shift up by half of that to center the block at 0
      const totalHeightSpan = (lines.length - 1) * lineHeight;
      const startY = -totalHeightSpan / 2;

      lines.forEach((line, idx) => {
         ctx.fillText(line, textRadius, startY + (idx * lineHeight));
      });
      ctx.restore();
    });

    // 4. Global Specular Highlight (Static Shine Overlay)
    // This creates the "Glass Cover" look that stays fixed while wheel spins
    const shine = ctx.createLinearGradient(0, 0, width, height);
    shine.addColorStop(0, 'rgba(255,255,255,0.05)');
    shine.addColorStop(0.4, 'rgba(255,255,255,0)');
    shine.addColorStop(0.6, 'rgba(255,255,255,0)');
    shine.addColorStop(1, 'rgba(255,255,255,0.05)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = shine;
    ctx.fill();

    // Center Hub
    const hubRadius = radius * 0.17; 
    setCenterSize(hubRadius * 2);

    ctx.beginPath();
    ctx.arc(centerX, centerY, hubRadius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, hubRadius + 6, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.stroke();

  }, [lots, history]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const size = Math.min(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = size * dpr;
        canvasRef.current.height = size * dpr;
        canvasRef.current.style.width = `${size}px`;
        canvasRef.current.style.height = `${size}px`;
        drawWheel();
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [lots, drawWheel]);

  const handleWinSequence = (winningLot: any) => {
      // 1. Play Win Sound
      playWin();

      // 2. Start Zoom Sequence (The Reveal)
      // Wait a tiny bit for the wheel to settle completely
      setTimeout(() => {
          setZoomStage('ZOOM_IN');
          
          // 3. Show Overlay after zoom completes (approx 0.8s later)
          setTimeout(() => {
             setWinner(winningLot);
             setZoomStage('REVEALED');
             
             // Confetti burst on reveal
             if ((window as any).confetti) {
                (window as any).confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ['#BF5AF2', '#0A84FF', '#ffffff'],
                    zIndex: 200
                });
            }
             
             addToHistory({
                id: Date.now().toString(),
                type: 'WHEEL',
                value: winningLot.label,
                timestamp: Date.now()
            });
          }, 800);
      }, 200);
  };

  const spin = () => {
    if (isSpinning) return;
    setZoomStage('IDLE'); // Reset camera
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    setWinner(null);
    setSpinning(true);
    
    const T_SPIN = 2000;
    const T_DECEL = 6000;
    const TOTAL_DURATION = T_SPIN + T_DECEL;
    
    const currentRot = rotationRef.current;
    let finalAngle = 0;
    let v_max = 0;
    let targetIndex = -1;

    const availableLotsIndices = lots.map((l, idx) => ({ ...l, originalIndex: idx }))
                                     .filter(l => !history.some(h => h.type === 'WHEEL' && h.value === l.label))
                                     .map(l => l.originalIndex);

    if (availableLotsIndices.length === 0) {
        alert("Reset required.");
        setSpinning(false);
        return;
    }

    if (vipMode && forcedLotId) {
        const foundIndex = lots.findIndex(l => l.id === forcedLotId);
        targetIndex = foundIndex !== -1 ? foundIndex : availableLotsIndices[getSecureRandomInt(0, availableLotsIndices.length - 1)];
    } else {
        targetIndex = availableLotsIndices[getSecureRandomInt(0, availableLotsIndices.length - 1)];
    }

    const numSegments = lots.length;
    const arcSize = (2 * Math.PI) / numSegments;
    const randomOffset = (getSecureRandomFloat() - 0.5) * (arcSize * 0.8);
    const targetRotationBase = - (targetIndex * arcSize + arcSize/2 + randomOffset);
    
    const desiredTotal = 120; 
    const k = Math.ceil((desiredTotal + currentRot - targetRotationBase) / (2 * Math.PI));
    finalAngle = targetRotationBase + k * 2 * Math.PI;
    v_max = (finalAngle - currentRot) / (T_SPIN + T_DECEL / 3);

    const startTime = performance.now();
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

    const animateFrame = (time: number) => {
        const elapsed = time - startTime;
        
        if (elapsed >= TOTAL_DURATION) {
            rotationRef.current = finalAngle;
            velocityRef.current = 0;
            drawWheel();
            setSpinning(false);
            
            // Determine winner locally to pass to sequence
            const normalizedRot = finalAngle % (2 * Math.PI);
            const correctedRot = normalizedRot < 0 ? normalizedRot + 2 * Math.PI : normalizedRot;
            const angleAtNeedle = (2 * Math.PI - correctedRot) % (2 * Math.PI);
            const winningIndex = Math.floor(angleAtNeedle / arcSize);
            handleWinSequence(lots[winningIndex]);
            return;
        }

        let newRot = 0;
        if (elapsed < T_SPIN) {
            newRot = currentRot + v_max * elapsed;
            velocityRef.current = v_max;
        } else {
            const t_decel = elapsed - T_SPIN;
            const progress = t_decel / T_DECEL;
            const ease = easeOutCubic(progress);
            const dist_spin = v_max * T_SPIN;
            const dist_decel = (v_max * T_DECEL / 3) * ease;
            newRot = currentRot + dist_spin + dist_decel;
            velocityRef.current = v_max * Math.pow(1 - progress, 2);
        }
        
        rotationRef.current = newRot;
        
        const currentTick = Math.floor((newRot * numSegments) / (2 * Math.PI));
        if (currentTick !== lastTickRef.current) {
            playTick();
            animateTicker(); // Trigger visual bounce
            lastTickRef.current = currentTick;
        }
        
        drawWheel();
        requestRef.current = requestAnimationFrame(animateFrame);
    };

    requestRef.current = requestAnimationFrame(animateFrame);
  };

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);
  
  // Motion Blur Calculation
  const blurAmount = Math.min(velocityRef.current * 100, 8); // Cap blur

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center wheel-reflection">
       
       {/* 0. Metallic Chassis Wrapper */}
       <div className="wheel-chassis p-1 md:p-2 bg-[#1a1a1a] shadow-2xl relative z-10">
           {/* Canvas with Motion Blur */}
           <canvas 
             ref={canvasRef} 
             className="max-w-full max-h-full transition-all duration-75 block"
             style={{ filter: `blur(${blurAmount}px)` }}
           />
           
           {/* Physics Ticker (The Needle) - Inside Chassis */}
           <div 
              ref={tickerRef}
              className="absolute right-[-24px] top-1/2 -translate-y-1/2 z-30 pointer-events-none origin-right"
              style={{ transformOrigin: '100% 50%' }}
           >
               <div className="absolute top-3 right-4 w-8 h-6 bg-black/50 blur-md transform -skew-y-6"></div>
               <div 
                 className="w-16 h-12 bg-gradient-to-l from-gray-100 to-white relative drop-shadow-lg"
                 style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}
               >
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-brand-purple rounded-l-full blur-[1px]"></div>
               </div>
           </div>
       </div>
       
       {/* High-End Center Hub */}
       <div 
         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
         style={{ width: centerSize, height: centerSize }}
       >
          <button 
             onClick={spin}
             disabled={isSpinning}
             className={`
               relative w-full h-full rounded-full flex flex-col items-center justify-center
               transition-all duration-300 ease-out group
               border-[4px] border-[#1C1C1E]
               shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_0_4px_10px_rgba(255,255,255,0.2)]
               ${isSpinning 
                  ? 'bg-[#222] cursor-default scale-95 opacity-80' 
                  : 'bg-gradient-to-br from-[#BF5AF2] via-[#5E2B77] to-[#2C2C2E] hover:scale-105 hover:shadow-[0_0_40px_rgba(191,90,242,0.5)] active:scale-95'
               }
             `}
          >
             <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none" />
             {isSpinning ? (
                 <div className="relative z-10 w-8 h-8 border-2 border-brand-purple/30 border-t-white rounded-full animate-spin" />
             ) : (
                 <div className="relative z-10 flex flex-col items-center leading-none">
                    <span className="text-[7px] md:text-[8px] font-bold text-white/80 tracking-[0.2em] uppercase drop-shadow-md mb-0">Lancer</span>
                    <span className="text-xl md:text-2xl lg:text-3xl font-black italic text-white tracking-tighter uppercase drop-shadow-lg group-hover:scale-110 transition-transform">LA ROUE</span>
                 </div>
             )}
          </button>
       </div>
    </div>
  );
};