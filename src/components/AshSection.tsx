import React, { useState } from 'react';
import { ASH_PROPERTIES } from '../data/haikaiData';
import { AshParticles } from './AshParticles';

export const AshSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'miracle' | 'mutation'>('miracle');

  return (
    <section className="relative w-full bg-[#050608] py-28 md:py-36 px-6 md:px-12 border-t border-[#141b24] overflow-hidden">
      {/* Background tone changes as user switches or scrolls */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${
          viewMode === 'miracle'
            ? 'bg-[radial-gradient(ellipse_at_center,_rgba(25,35,50,0.4)_0%,_rgba(5,6,8,1)_70%)]'
            : 'bg-[radial-gradient(ellipse_at_center,_rgba(45,15,18,0.45)_0%,_rgba(5,6,8,1)_70%)]'
        }`}
      />
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />
      <AshParticles density={viewMode === 'miracle' ? 20 : 60} speedMultiplier={viewMode === 'miracle' ? 0.7 : 1.4} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>MATERIAL ANOMALY</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">SUBSTANCE 01</span>
          </div>

          <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl tracking-[0.35em] text-[#e4e8ec] uppercase font-light mb-3">
            ASH
          </h2>
          <p className="font-jp text-lg tracking-[0.4em] text-[#788494] mb-8">
            灰 — 創生と変異
          </p>

          <blockquote className="font-serif-cinematic italic text-xl sm:text-2xl text-[#b0bac6] max-w-xl mx-auto font-light">
            «Nobody knows exactly where Ash comes from.»
          </blockquote>
        </div>

        {/* Dual Mode Switcher: Miracle vs Mutation */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex p-1 border border-[#202936] bg-[#090d13] rounded">
            <button
              onClick={() => setViewMode('miracle')}
              type="button"
              className={`px-5 py-2 text-xs uppercase tracking-[0.2em] font-cinzel transition-all ${
                viewMode === 'miracle'
                  ? 'bg-[#182230] text-[#e0e5eb] shadow-md border-b border-[#3b82f6]/40'
                  : 'text-[#6f7a88] hover:text-[#c0c7d0]'
              }`}
            >
              [ CIVILIZATION’S MIRACLE ]
            </button>
            <button
              onClick={() => setViewMode('mutation')}
              type="button"
              className={`px-5 py-2 text-xs uppercase tracking-[0.2em] font-cinzel transition-all ${
                viewMode === 'mutation'
                  ? 'bg-[#260e10] text-[#f2c6c7] shadow-md border-b border-[#9e2a2b]'
                  : 'text-[#6f7a88] hover:text-[#c0c7d0]'
              }`}
            >
              [ THE MUTATION / THE TAX ]
            </button>
          </div>
        </div>

        {/* View Mode: Miracle */}
        {viewMode === 'miracle' && (
          <div className="animate-in fade-in duration-300">
            <div className="border border-[#1e2733] bg-[#080c12]/80 p-8 md:p-12 mb-10">
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#1b232e]">
                <span className="font-cinzel text-sm tracking-[0.25em] text-[#d0d7e0] uppercase">
                  FOUNDATION OF HUMAN RECOVERY
                </span>
                <span className="text-xs font-editorial-mono text-[#5f6a78]">
                  IMPERIAL APPLICATION AUDIT
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ASH_PROPERTIES.miracles.map((item, i) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="font-editorial-mono text-sm text-[#455264] font-bold">
                      0{i + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-cinzel tracking-wider text-[#d5dbe2] uppercase mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#8792a0] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="font-serif-cinematic text-lg text-[#95a0af] italic">
                “Without the fallout, humanity would have starved three centuries ago.”
              </p>
            </div>
          </div>
        )}

        {/* View Mode: Mutation (Disturbing, unsettling) */}
        {viewMode === 'mutation' && (
          <div className="animate-in fade-in duration-300">
            <div className="border border-[#3d1316] bg-[#0f0708]/90 p-8 md:p-12 mb-10">
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#301013]">
                <span className="font-cinzel text-sm tracking-[0.25em] text-[#e89a9c] uppercase">
                  BIOLOGICAL REWRITE PROTOCOLS
                </span>
                <span className="text-xs font-editorial-mono text-[#9e2a2b]">
                  CLASSIFIED // MEDICAL CONTAMINATION
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ASH_PROPERTIES.mutations.map((item, i) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="font-editorial-mono text-sm text-[#8c3133] font-bold">
                      0{i + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-cinzel tracking-wider text-[#e6a8aa] uppercase mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#a88284] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chilling Final Statement */}
            <div className="text-center max-w-xl mx-auto py-4 border-y border-[#3d1417]">
              <p className="font-serif-cinematic text-2xl md:text-3xl text-[#f0afb1] italic font-normal">
                «It can also change living things.»
              </p>
              <p className="text-xs font-editorial-mono text-[#784649] tracking-widest uppercase mt-3">
                [ THE FIRST FLESH RESTRUCTURE WAS LOGGED IN YEAR 084 ]
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
