import React, { useState } from 'react';
import { OATHS } from '../data/haikaiData';
import { Oath } from '../types/haikai';
import { ArrowRight, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

export const OathSystem: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeOath, setActiveOath] = useState<Oath>(OATHS[0]);

  const categories = ['All', 'Memory', 'Lifespan', 'Relationships', 'Senses', 'Identity', 'Freedom'];

  const filteredOaths =
    selectedCategory === 'All'
      ? OATHS
      : OATHS.filter((oath) => oath.category === selectedCategory);

  return (
    <section id="oath" className="relative w-full bg-[#050608] py-28 md:py-36 px-6 md:px-12 border-t border-[#141b24] overflow-hidden">
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>FORBIDDEN BINDINGS</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">METAPHYSICS</span>
          </div>

          <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl tracking-[0.35em] text-[#e4e8ec] uppercase font-light mb-3">
            OATH
          </h2>
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.5em] text-[#8995a5] uppercase mb-4">
            POWER HAS A PRICE.
          </p>
          <p className="font-jp text-base tracking-[0.4em] text-[#717c8a]">
            誓約 — 対価と束縛
          </p>
          <div className="w-16 h-[1px] bg-[#9e2a2b] mt-6" />
        </div>

        {/* Philosophy Intro */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <blockquote className="font-serif-cinematic italic text-xl sm:text-2xl text-[#c1cbd6] leading-relaxed mb-4">
            «An Oath is a genuine restriction placed upon one's own existence.»
          </blockquote>
          <p className="text-xs sm:text-sm text-[#798595] font-light leading-relaxed">
            Words alone are meaningless. The Sea of Ash does not listen to prayers or empty proclamations. The world responds strictly to irrevocable conviction.
          </p>
        </div>

        {/* The 4-Stage Metaphysical Cycle: SACRIFICE → CONVICTION → POWER → CONSEQUENCE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="p-6 border border-[#202937] bg-[#090d14] relative">
            <span className="font-editorial-mono text-[10px] text-[#556375] tracking-widest uppercase block mb-1">
              STAGE 01
            </span>
            <h4 className="font-cinzel text-sm tracking-wider uppercase text-[#d5dce4] mb-2 font-semibold flex items-center justify-between">
              <span>SACRIFICE</span>
              <ArrowRight className="w-4 h-4 text-[#556375] hidden lg:block" />
            </h4>
            <p className="text-xs text-[#8793a2] leading-relaxed">
              Surrendering an indispensable facet of human existence: memory, mercy, sleep, or identity.
            </p>
          </div>

          <div className="p-6 border border-[#202937] bg-[#090d14] relative">
            <span className="font-editorial-mono text-[10px] text-[#556375] tracking-widest uppercase block mb-1">
              STAGE 02
            </span>
            <h4 className="font-cinzel text-sm tracking-wider uppercase text-[#d5dce4] mb-2 font-semibold flex items-center justify-between">
              <span>CONVICTION</span>
              <ArrowRight className="w-4 h-4 text-[#556375] hidden lg:block" />
            </h4>
            <p className="text-xs text-[#8793a2] leading-relaxed">
              Unyielding resolve that accepts no exception, compromise, or circumstance under mortal peril.
            </p>
          </div>

          <div className="p-6 border border-[#233549] bg-[#0c131d] relative">
            <span className="font-editorial-mono text-[10px] text-[#3b82f6] tracking-widest uppercase block mb-1">
              STAGE 03
            </span>
            <h4 className="font-cinzel text-sm tracking-wider uppercase text-[#e2e8f0] mb-2 font-semibold flex items-center justify-between">
              <span>POWER</span>
              <ArrowRight className="w-4 h-4 text-[#3b82f6] hidden lg:block" />
            </h4>
            <p className="text-xs text-[#9bb0c9] leading-relaxed">
              Authority granted by the world: immunity to pressure, true sight across mist, or kinetic absorption.
            </p>
          </div>

          <div className="p-6 border border-[#3d1417] bg-[#12080a] relative">
            <span className="font-editorial-mono text-[10px] text-[#9e2a2b] tracking-widest uppercase block mb-1">
              STAGE 04
            </span>
            <h4 className="font-cinzel text-sm tracking-wider uppercase text-[#f0afb1] mb-2 font-semibold flex items-center justify-between">
              <span>CONSEQUENCE</span>
              <AlertTriangle className="w-4 h-4 text-[#9e2a2b]" />
            </h4>
            <p className="text-xs text-[#b88688] leading-relaxed">
              Break the oath, and the restriction turns inward with devastating biological backlash.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={`px-4 py-1.5 text-xs font-editorial-mono tracking-wider uppercase border transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'border-[#9e2a2b] bg-[#141a24] text-white'
                  : 'border-[#1b232e] bg-[#080b0f] text-[#6c7786] hover:text-[#b8c2ce]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Oath Detail Card */}
        <div className="border border-[#1e2734] bg-[#080b10] p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Oath List */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-cinzel tracking-[0.2em] text-[#717f90] uppercase block mb-3">
                FORBIDDEN CODEX // {filteredOaths.length} RECORDS
              </span>
              {filteredOaths.map((oath) => {
                const isCurrent = activeOath.id === oath.id;
                return (
                  <div
                    key={oath.id}
                    onClick={() => setActiveOath(oath)}
                    className={`p-4 border transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-[#9e2a2b] bg-[#101621] shadow-lg'
                        : 'border-[#1a222c] bg-[#06080c] hover:border-[#2b3646]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-editorial-mono text-[10px] text-[#9e2a2b] uppercase">
                        CATEGORY: {oath.category}
                      </span>
                      <span className="font-jp text-xs text-[#5f6b7c]">
                        {oath.japanese}
                      </span>
                    </div>
                    <h4 className="font-cinzel text-xs sm:text-sm tracking-wider text-[#dce1e6] uppercase font-semibold">
                      {oath.title}
                    </h4>
                    <span className="text-[11px] text-[#7c8898] block mt-1">
                      Bearer: {oath.bearer}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Oath Full Anatomy */}
            <div className="lg:col-span-7 border border-[#232e3d] bg-[#0a0e15] p-6 sm:p-10 space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1b2532] mb-4">
                  <span className="font-editorial-mono text-xs text-[#9e2a2b] tracking-widest uppercase">
                    BINDING INSCRIPTION
                  </span>
                  <span className="text-xs font-editorial-mono text-[#5c697a]">
                    BEARER: {activeOath.bearer}
                  </span>
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl text-[#edf0f3] uppercase tracking-wide mb-3">
                  {activeOath.title}
                </h3>

                <div className="p-4 border-l-2 border-[#9e2a2b] bg-[#0f141d]/80 my-4">
                  <p className="font-serif-cinematic text-xl text-[#f1f4f6] italic">
                    {activeOath.vow}
                  </p>
                </div>
              </div>

              {/* Sacrifice & Conviction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 border border-[#1d2734] bg-[#080b10]">
                  <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#788596] uppercase block mb-1">
                    THE SACRIFICE
                  </span>
                  <p className="text-xs text-[#a4afbd] leading-relaxed">
                    {activeOath.sacrifice}
                  </p>
                </div>
                <div className="p-4 border border-[#1d2734] bg-[#080b10]">
                  <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#788596] uppercase block mb-1">
                    THE CONVICTION
                  </span>
                  <p className="text-xs text-[#a4afbd] leading-relaxed">
                    {activeOath.conviction}
                  </p>
                </div>
              </div>

              {/* Power Unlocked vs Consequence */}
              <div className="space-y-4 pt-2">
                <div className="p-4 border border-[#1e3a5f] bg-[#0a1420]">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-cinzel tracking-wider text-[#60a5fa] uppercase font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>ABILITY UNLOCKED</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#b9d3f5] leading-relaxed">
                    {activeOath.unlockedPower}
                  </p>
                </div>

                <div className="p-4 border border-[#4d161a] bg-[#160809]">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-cinzel tracking-wider text-[#e89a9c] uppercase font-semibold">
                    <Flame className="w-4 h-4 text-[#9e2a2b]" />
                    <span>IF THE OATH IS BROKEN</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#d6a5a7] leading-relaxed">
                    {activeOath.consequenceOfBreak}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
