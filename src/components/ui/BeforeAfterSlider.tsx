import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  labelBefore?: string;
  labelAfter?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  before,
  after,
  labelBefore = "Before",
  labelAfter = "After"
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`Before and after comparison: ${labelBefore} vs ${labelAfter}`}
      className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-col-resize select-none border border-sky/10 shadow-lg"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* After Image (Background) */}
      <img 
        src={after} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />

      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img 
          src={before} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-3 bg-sky-deep/20 rounded-full" />
            <div className="w-0.5 h-3 bg-sky-deep/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
          {labelBefore}
        </span>
      </div>
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
        <span className="bg-sun/80 backdrop-blur-md text-sky-deep text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
          {labelAfter}
        </span>
      </div>
    </div>
  );
};
