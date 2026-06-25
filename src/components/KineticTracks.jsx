import React from 'react';

/**
 * 3D Horizontally looping typography tracks.
 * Uses 3D CSS transforms (rotateX, rotateY, translateZ) to tilt and extrude
 * text bands that slide infinitely in opposite directions.
 */
export function KineticTracks() {
  const textContent = "HIGH PROTEIN • CHOP. BLEND. SEAR. • TRACK CALORIES • 100% INVENTORY UTILIZATION • SMART INGREDIENTS • ";
  
  // Multiply text to guarantee seamless infinite looping coverage
  const repeatedText = Array(4).fill(textContent).join("");

  return (
    <div 
      className="w-full overflow-hidden select-none py-12 pointer-events-none relative z-0 flex flex-col gap-6"
      style={{
        perspective: '1400px',
      }}
    >
      {/* Track Row 1: Left-to-Right sliding loop */}
      <div 
        className="w-full flex border-y border-neutral-200/60 bg-white/40 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-[1px]"
        style={{
          transform: 'rotateX(25deg) rotateY(-15deg) rotateZ(-4deg) translateZ(-40px)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="flex whitespace-nowrap animate-loop-right font-sans text-neutral-300/80 font-black text-xl md:text-3xl uppercase tracking-[6px]">
          <span className="pr-6">{repeatedText}</span>
        </div>
      </div>

      {/* Track Row 2: Right-to-Left sliding loop */}
      <div 
        className="w-full flex border-y border-neutral-200/60 bg-white/40 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-[1px]"
        style={{
          transform: 'rotateX(25deg) rotateY(-15deg) rotateZ(-4deg) translateZ(-85px)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="flex whitespace-nowrap animate-loop-left font-sans text-neutral-400/60 font-black text-xl md:text-3xl uppercase tracking-[6px]">
          <span className="pr-6">{repeatedText}</span>
        </div>
      </div>
    </div>
  );
}
