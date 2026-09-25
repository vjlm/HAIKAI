import React, { useState, useEffect, useRef } from 'react';

interface FlipCardProps {
  value: string;
  isAccent?: boolean;
}

export const FlipCard: React.FC<FlipCardProps> = ({ value, isAccent = false }) => {
  const [currentVal, setCurrentVal] = useState(value);
  const [prevVal, setPrevVal] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const flipTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (value !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(value);
      setIsFlipping(true);

      if (flipTimeoutRef.current) {
        window.clearTimeout(flipTimeoutRef.current);
      }

      flipTimeoutRef.current = window.setTimeout(() => {
        setIsFlipping(false);
        setPrevVal(value);
      }, 540);
    }

    return () => {
      if (flipTimeoutRef.current) {
        window.clearTimeout(flipTimeoutRef.current);
      }
    };
  }, [value, currentVal]);

  const textColor = isAccent ? 'text-[#f2b3b5]' : 'text-[#edf2f7]';
  const cardBorder = isAccent
    ? 'border-[#4a181b] shadow-[0_0_15px_rgba(158,42,43,0.22)]'
    : 'border-[#1b2533] shadow-[0_4px_16px_rgba(0,0,0,0.5)]';
  const topBg = isAccent ? 'bg-[#18090d]' : 'bg-[#0d131d]';
  const bottomBg = isAccent ? 'bg-[#100609]' : 'bg-[#080d14]';

  return (
    <div
      className={`relative w-full aspect-[4/5] max-w-[120px] mx-auto rounded border select-none overflow-hidden ${cardBorder}`}
      style={{ perspective: '800px' }}
    >
      {/* 1. Static Top Half (Shows current value behind) */}
      <div
        className={`absolute inset-x-0 top-0 h-1/2 overflow-hidden flex items-end justify-center border-b border-[#040608]/70 ${topBg}`}
      >
        <span
          className={`font-editorial-mono text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-none tabular-nums tracking-tight translate-y-1/2 ${textColor}`}
        >
          {currentVal}
        </span>
        {/* Subtle top glare */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      </div>

      {/* 2. Static Bottom Half (Shows previous value until covered) */}
      <div
        className={`absolute inset-x-0 bottom-0 h-1/2 overflow-hidden flex items-start justify-center ${bottomBg}`}
      >
        <span
          className={`font-editorial-mono text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-none tabular-nums tracking-tight -translate-y-1/2 ${textColor}`}
        >
          {isFlipping ? prevVal : currentVal}
        </span>
        {/* Subtle bottom shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* 3. Flipping Top Flap (Flips down from 0 to -90deg showing prev value) */}
      {isFlipping && (
        <div
          key={`flip-top-${currentVal}`}
          className={`flip-panel-top animate-flip-top absolute inset-x-0 top-0 h-1/2 overflow-hidden flex items-end justify-center border-b border-[#040608]/70 z-20 ${topBg}`}
        >
          <span
            className={`font-editorial-mono text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-none tabular-nums tracking-tight translate-y-1/2 ${textColor}`}
          >
            {prevVal}
          </span>
          {/* Shadow during fold */}
          <div className="flip-shadow-top absolute inset-0 bg-black/40 pointer-events-none" />
        </div>
      )}

      {/* 4. Flipping Bottom Flap (Flips down from 90 to 0deg showing new value) */}
      {isFlipping && (
        <div
          key={`flip-bottom-${currentVal}`}
          className={`flip-panel-bottom animate-flip-bottom absolute inset-x-0 bottom-0 h-1/2 overflow-hidden flex items-start justify-center z-20 ${bottomBg}`}
        >
          <span
            className={`font-editorial-mono text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-none tabular-nums tracking-tight -translate-y-1/2 ${textColor}`}
          >
            {currentVal}
          </span>
          {/* Highlight settling */}
          <div className="flip-highlight-bottom absolute inset-0 bg-white/10 pointer-events-none" />
        </div>
      )}

      {/* Mechanical Center Seam Line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#020406] z-30 pointer-events-none shadow-[0_1px_0_rgba(255,255,255,0.06)]" />

      {/* Mechanical Side Notches */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-2.5 sm:h-3 bg-[#05070a] border-r border-t border-b border-[#1b2533] rounded-r z-30 pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-2.5 sm:h-3 bg-[#05070a] border-l border-t border-b border-[#1b2533] rounded-l z-30 pointer-events-none" />
    </div>
  );
};
