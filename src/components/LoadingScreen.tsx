import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 350);
    const t2 = setTimeout(() => setStep(2), 1050);
    const t3 = setTimeout(() => setStep(3), 1650);
    const t4 = setTimeout(() => setFadeOut(true), 2400);
    const t5 = setTimeout(() => onComplete(), 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#050608] flex flex-col items-center justify-center transition-opacity duration-700 select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center px-6 space-y-4">
        {/* Step 1: 灰海 */}
        <div
          className={`transition-all duration-700 transform ${
            step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="font-jp text-5xl sm:text-6xl md:text-7xl tracking-[0.3em] text-[#edf1f4] font-light">
            灰海
          </span>
        </div>

        {/* Step 2: HAIKAI */}
        <div
          className={`transition-all duration-700 transform ${
            step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-[0.35em] text-[#cbd1d8] uppercase font-medium">
            HAIKAI
          </h1>
        </div>

        {/* Step 3: THE SEA OF ASH */}
        <div
          className={`transition-all duration-700 transform ${
            step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <p className="font-serif-cinematic italic text-xs sm:text-sm text-[#9e2a2b] tracking-[0.25em] uppercase">
            THE SEA OF ASH
          </p>
        </div>
      </div>
    </div>
  );
};
