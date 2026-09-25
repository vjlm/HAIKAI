import React, { useState } from 'react';
import { RELATIONSHIPS } from '../data/haikaiData';
import { Relationship } from '../types/haikai';

export const RelationshipGraph: React.FC = () => {
  const [activeRel, setActiveRel] = useState<Relationship>(RELATIONSHIPS[0]);

  return (
    <section className="relative w-full bg-[#050608] py-28 md:py-36 px-6 md:px-12 border-t border-[#141b24] overflow-hidden">
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>HUMAN BONDS</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">INTERSECTIONS</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl tracking-[0.3em] text-[#e4e8ec] uppercase font-light mb-3">
            RELATIONSHIPS
          </h2>
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.45em] text-[#84909f] uppercase">
            SILENCE, MEMORY, AND COMRADESHIP
          </p>
          <div className="w-16 h-[1px] bg-[#9e2a2b] mt-6" />
        </div>

        {/* Elegant Nodes Network Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Connecting Ties */}
          <div className="lg:col-span-6 space-y-3">
            {RELATIONSHIPS.map((rel) => {
              const isActive = activeRel.id === rel.id;
              return (
                <div
                  key={rel.id}
                  onClick={() => setActiveRel(rel)}
                  onMouseEnter={() => setActiveRel(rel)}
                  className={`p-5 border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'border-[#9e2a2b] bg-[#101621] shadow-lg'
                      : 'border-[#1b232e] bg-[#080b0f] hover:border-[#2f3b4c]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cinzel text-sm sm:text-base tracking-widest uppercase text-[#dce1e6] font-semibold">
                      {rel.label}
                    </span>
                    <span className="text-xs font-editorial-mono text-[#9e2a2b]">
                      [ BOND // 0{RELATIONSHIPS.indexOf(rel) + 1} ]
                    </span>
                  </div>

                  <p className="font-serif-cinematic text-lg text-[#b8c2cd] italic">
                    {rel.quote}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Emotional Statement & Dynamic Analysis */}
          <div className="lg:col-span-6 border border-[#202936] bg-[#090d14] p-8 sm:p-12 relative min-h-[360px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#9e2a2b]/60" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#18212d] mb-6">
                <span className="font-cinzel text-xs tracking-[0.3em] text-[#8693a3] uppercase">
                  NEXUS ANALYSIS
                </span>
                <span className="font-editorial-mono text-xs text-[#526072]">
                  {activeRel.pair[0]} ↔ {activeRel.pair[1]}
                </span>
              </div>

              {/* Large Quote */}
              <div className="my-6">
                <blockquote className="font-serif-cinematic text-2xl sm:text-3xl text-[#edf1f4] italic leading-relaxed">
                  {activeRel.quote}
                </blockquote>
              </div>

              {/* Dynamic Description */}
              <div className="mt-8 pt-6 border-t border-[#18212d]">
                <h4 className="text-[11px] font-cinzel tracking-[0.2em] text-[#717e90] uppercase mb-2">
                  THE DYNAMIC
                </h4>
                <p className="text-sm text-[#9da8b6] leading-relaxed font-light mb-6">
                  {activeRel.dynamic}
                </p>

                <h4 className="text-[11px] font-cinzel tracking-[0.2em] text-[#717e90] uppercase mb-2">
                  UNSPOKEN TENSION
                </h4>
                <p className="text-sm text-[#c49799] leading-relaxed font-light italic">
                  {activeRel.tension}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#18212d] flex justify-between items-center text-[10px] font-editorial-mono text-[#525f70] uppercase">
              <span>UNCONFESSED EMOTIONS · RESTRAINT OVER SPECTACLE</span>
              <span>NO CLICHÉS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
