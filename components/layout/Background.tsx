import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store';

export const Background: React.FC = React.memo(() => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const { isSpinning } = useStore();

  // Mouse Tracking for Spotlight with rAF for performance
  useEffect(() => {
    let rAFId: number;
    const handleMouseMove = (e: MouseEvent) => {
        if (spotlightRef.current) {
            cancelAnimationFrame(rAFId);
            rAFId = requestAnimationFrame(() => {
                if(spotlightRef.current) {
                    spotlightRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(191, 90, 242, 0.06), transparent 40%)`;
                }
            });
        }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(rAFId);
    };
  }, []);

  return (
    <>
        {/* 0. Reactive God Rays */}
        <div className={`god-rays ${isSpinning ? 'spinning' : ''}`}></div>

        {/* 1. Global Noise Texture */}
        <div className="bg-noise gpu-layer"></div>

        {/* 2. Interactive Spotlight Overlay */}
        <div ref={spotlightRef} className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 opacity-100 gpu-layer"></div>

        {/* 3. Deep Vignette */}
        <div className="vignette"></div>

        {/* 4. Liquid Glass Background */}
        {/* Optimization: Removed scale transition on the blurred container to stop repaints. Only opacity changes. */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
            
            {/* The Liquid Container */}
            <div 
                className={`absolute inset-0 filter blur-[100px] transition-opacity duration-1000 gpu-layer ${isSpinning ? 'opacity-80' : 'opacity-60'}`}
            >
                
                {/* Shape 1: Primary Purple - Top Left */}
                <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-brand-purple/40 rounded-full mix-blend-screen animate-morph animate-color-cycle gpu-layer" />
                
                {/* Shape 2: Secondary Blue - Bottom Right */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-brand-blue/30 rounded-full mix-blend-screen animate-morph-slow animate-color-cycle gpu-layer" style={{ animationDelay: '-5s' }} />
                
                {/* Shape 3: Accent Dark Purple - Center/Floating */}
                <div className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] bg-brand-darkPurple/50 rounded-full mix-blend-screen animate-morph gpu-layer" style={{ animationDuration: '20s', animationDelay: '-10s' }} />
                
                {/* Shape 4: High Key Highlight - Moving slowly */}
                <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-[#9e4bc1]/20 rounded-full mix-blend-screen animate-morph-slow gpu-layer" style={{ animationDuration: '30s' }} />

            </div>
            
            {/* Overlay Gradient to ensure text readability at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        </div>
    </>
  );
});