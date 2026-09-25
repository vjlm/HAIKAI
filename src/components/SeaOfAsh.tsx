import React, { useState } from 'react';
import { THREE_RULES } from '../data/haikaiData';
import { AshParticles } from './AshParticles';

export const SeaOfAsh: React.FC = () => {
  const [activeRuleIndex, setActiveRuleIndex] = useState<number>(0);

  // Background ambiance tint depending on which rule is hovered
  const bgGradients = [
    'from-[#070b12] via-[#05070a] to-[#040507]',
    'from-[#0a0710] via-[#060509] to-[#030305]',
    'from-[#0d0708] via-[#070405] to-[#030203]',
  ];

  return (
    <section className="relative w-full bg-[#050608] py-28 md:py-36 px-6 md:px-12 border-t border-[#141b24] overflow-hidden">
      {/* Dynamic atmospheric background tint */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${bgGradients[activeRuleIndex]} transition-colors duration-700 pointer-events-none opacity-80`}
      />
      <div className="cinematic-vignette pointer-events-none absolute inset-0 z-0" />
      <div className="film-grain pointer-events-none absolute inset-0 z-0 opacity-25" />
      <AshParticles density={28} speedMultiplier={0.7} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <div className="flex items-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>MARITIME LAWS</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">NATURAL ARCHITECTURE</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl tracking-[0.3em] text-[#e4e8ec] uppercase font-normal mb-3">
            THE SEA OF ASH
          </h2>
          <p className="font-jp text-lg tracking-[0.4em] text-[#717b88]">
            黒海三律
          </p>
          <div className="w-16 h-[1px] bg-[#9e2a2b] mt-6" />
        </div>

        {/* Three Rules: Large Numbered Cinematic Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {THREE_RULES.map((rule, idx) => {
            const isHovered = activeRuleIndex === idx;
            return (
              <div
                key={rule.number}
                onMouseEnter={() => setActiveRuleIndex(idx)}
                className={`group relative p-8 md:p-10 border transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[380px] ${
                  isHovered
                    ? 'border-[#9e2a2b]/70 bg-[#0d131c]/90 shadow-[0_10px_35px_rgba(0,0,0,0.8)] -translate-y-1'
                    : 'border-[#1b232e] bg-[#080b0f]/60 hover:border-[#2d394b]'
                }`}
              >
                {/* Rule Top Accent & Japanese Label */}
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-[#1c2430]">
                    <span className="font-editorial-mono text-xs tracking-[0.35em] text-[#9e2a2b] uppercase font-semibold">
                      {rule.number}
                    </span>
                    <span className="font-jp text-sm tracking-widest text-[#5e6978]">
                      {rule.ruleJp}
                    </span>
                  </div>

                  {/* Depth Boundary */}
                  <div className="mt-4 mb-6">
                    <span className="text-[11px] font-editorial-mono tracking-widest uppercase text-[#546070]">
                      DEPTH RANGE: {rule.depthBoundary}
                    </span>
                  </div>

                  {/* Primary Rule Statement */}
                  <h3 className="font-serif-cinematic text-2xl lg:text-3xl text-[#eaeef1] leading-snug font-normal tracking-wide group-hover:text-white transition-colors">
                    «{rule.statement}»
                  </h3>
                </div>

                {/* Elaboration */}
                <div className="pt-6 border-t border-[#18212c] mt-8">
                  <p className="text-xs sm:text-sm text-[#8c97a5] leading-relaxed font-light">
                    {rule.elaboration}
                  </p>
                </div>

                {/* Corner hairline highlight */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#9e2a2b]/0 group-hover:border-[#9e2a2b] transition-all" />
              </div>
            );
          })}
        </div>

        {/* Ambient footnote */}
        <div className="mt-14 text-center">
          <p className="font-editorial-mono text-xs tracking-[0.25em] text-[#4d5663] uppercase">
            [ VERIFIED BY CROWNLANDS BATHYMETRIC EXPEDITIONS · CASUALTY RATE 92% ]
          </p>
        </div>
      </div>
    </section>
  );
};
