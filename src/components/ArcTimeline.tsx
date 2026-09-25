import React, { useState } from 'react';
import { STORY_ARCS } from '../data/haikaiData';
import { StoryArc } from '../types/haikai';
import { ChevronRight, Compass } from 'lucide-react';

export const ArcTimeline: React.FC = () => {
  const [selectedArc, setSelectedArc] = useState<StoryArc>(STORY_ARCS[0]);

  // Background visual darkness increases as arc number increases (1 to 10)
  const getDepthStyle = (arcNum: number) => {
    const darknessLevels = [
      'bg-[#080c12] border-[#222c3b]',
      'bg-[#070a0f] border-[#1f2836]',
      'bg-[#06080d] border-[#1c2431]',
      'bg-[#05070b] border-[#1a212c]',
      'bg-[#05060a] border-[#181e28]',
      'bg-[#040509] border-[#161b24]',
      'bg-[#040508] border-[#141820]',
      'bg-[#030407] border-[#12161d]',
      'bg-[#030306] border-[#10141a]',
      'bg-[#020204] border-[#0e1116]',
    ];
    return darknessLevels[arcNum - 1] || darknessLevels[0];
  };

  return (
    <section id="story" className="relative w-full bg-[#050608] py-28 md:py-36 px-6 md:px-12 border-t border-[#141b24] overflow-hidden">
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>CHRONOLOGICAL RECORD</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">ARC TIMELINE</span>
          </div>

          <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl tracking-[0.35em] text-[#e4e8ec] uppercase font-light mb-3">
            THE DESCENT
          </h2>
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.5em] text-[#84909f] uppercase mb-4">
            FROM THE REEF TO THE EVENT HORIZON
          </p>
          <p className="font-jp text-base tracking-[0.4em] text-[#717b88]">
            下降の十幕
          </p>
          <div className="w-16 h-[1px] bg-[#9e2a2b] mt-6" />
        </div>

        {/* Horizontal Scrollable Arc Step Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-12 scrollbar-none">
          {STORY_ARCS.map((arc) => {
            const isSelected = selectedArc.arcNumber === arc.arcNumber;
            return (
              <button
                key={arc.number}
                onClick={() => setSelectedArc(arc)}
                type="button"
                className={`flex-shrink-0 px-4 py-3 border text-left transition-all ${
                  isSelected
                    ? 'border-[#9e2a2b] bg-[#121824] shadow-md'
                    : 'border-[#1b232e] bg-[#07090d] text-[#717d8c] hover:border-[#2d3848] hover:text-[#b8c2ce]'
                }`}
              >
                <span className="text-[10px] font-editorial-mono text-[#9e2a2b] block font-bold">
                  {arc.number}
                </span>
                <span className="font-cinzel text-xs tracking-wider uppercase text-[#d5dbe2] whitespace-nowrap block mt-0.5">
                  {arc.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Arc Main Display */}
        <div className={`border p-8 sm:p-12 lg:p-16 transition-all duration-700 shadow-2xl relative ${getDepthStyle(selectedArc.arcNumber)}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left: Arc Details & Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#1b232e] mb-6">
                  <div className="flex items-center gap-3">
                    <span className="font-editorial-mono text-sm text-[#9e2a2b] font-bold">
                      {selectedArc.number}
                    </span>
                    <span className="text-xs text-[#526072]">·</span>
                    <span className="font-jp text-base text-[#7c8898]">
                      {selectedArc.japanese}
                    </span>
                  </div>

                  <span className="text-xs font-editorial-mono text-[#616e7e]">
                    DEPTH: {selectedArc.depthLevel}
                  </span>
                </div>

                <h3 className="font-cinzel text-3xl sm:text-4xl text-[#edf1f4] uppercase tracking-wide mb-4">
                  {selectedArc.title}
                </h3>

                {/* Synopsis without spoilers */}
                <p className="text-sm sm:text-base text-[#9ea9b7] leading-relaxed font-light mb-8">
                  {selectedArc.synopsis}
                </p>

                {/* Arc Quote */}
                <div className="p-4 border-l-2 border-[#9e2a2b] bg-[#0b1017]/70 mb-6">
                  <blockquote className="font-serif-cinematic text-xl sm:text-2xl text-[#dce1e6] italic">
                    {selectedArc.quote}
                  </blockquote>
                </div>
              </div>

              {/* Artifact & Depth Metadata */}
              <div className="pt-6 border-t border-[#18212c] flex flex-col sm:flex-row justify-between gap-4 text-xs font-editorial-mono text-[#677484]">
                <div>
                  <span className="text-[10px] tracking-widest uppercase block text-[#4b5565] mb-0.5">
                    KEY ARTIFACT
                  </span>
                  <span className="text-[#aeb8c4]">{selectedArc.keyArtifact}</span>
                </div>

                <div>
                  <span className="text-[10px] tracking-widest uppercase block text-[#4b5565] mb-0.5">
                    DESCENT SEQUENCE
                  </span>
                  <span className="text-[#9e2a2b] font-bold">
                    STEP {selectedArc.arcNumber} OF 10
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Visual Depth Atmosphere Frame */}
            <div className="lg:col-span-5 border border-[#1b232e] bg-[#07090e] p-8 flex flex-col justify-between relative overflow-hidden min-h-[360px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

              {/* Stylized depth graphic */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-70">
                <Compass className="w-28 h-28 text-[#1e2938] animate-spin-slow stroke-[0.7]" />
                <div className="text-[9px] font-editorial-mono text-[#4b5768] tracking-[0.3em] uppercase mt-4">
                  HYDROSTATIC COMPASS // CALIBRATION 0{selectedArc.arcNumber}
                </div>
              </div>

              <div className="relative z-20 flex justify-between items-center text-[10px] font-editorial-mono text-[#616e7e]">
                <span>BATHYMETRY STAMP</span>
                <span>ZONE: {selectedArc.depthLevel}</span>
              </div>

              <div className="relative z-20 pt-16">
                <span className="font-cinzel text-xs tracking-[0.25em] text-[#8692a1] uppercase block mb-1">
                  ATMOSPHERE NOTE
                </span>
                <p className="text-xs font-serif-cinematic text-[#b0bac6] italic">
                  {selectedArc.arcNumber <= 3
                    ? 'The shoreline is still visible; the air tastes of salt and coal smoke.'
                    : selectedArc.arcNumber <= 6
                    ? 'Natural daylight fades entirely; bioluminescent cold cyan replaces the sun.'
                    : 'The water stops behaving like liquid; reality shears along ancient fault lines.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Progression Indicator */}
        <div className="mt-12 flex items-center justify-between text-xs font-editorial-mono text-[#526072] uppercase">
          <span>01 · THE SALVAGE BOY</span>
          <div className="flex-1 mx-6 h-[1px] bg-[#1a222e] relative">
            <div
              className="h-[2px] bg-[#9e2a2b] absolute top-[-0.5px] transition-all duration-500"
              style={{ width: `${(selectedArc.arcNumber / 10) * 100}%` }}
            />
          </div>
          <span>10 · WHAT DESERVES TO SURVIVE?</span>
        </div>
      </div>
    </section>
  );
};
