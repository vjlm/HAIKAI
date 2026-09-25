import React, { useState } from 'react';
import { StoryArc } from '../types/haikai';
import { STORY_ARCS } from '../data/haikaiData';
import { Layers, ChevronRight, Bookmark } from 'lucide-react';

interface ArcTimelineProps {
  storyArcs?: StoryArc[];
}

export const ArcTimeline: React.FC<ArcTimelineProps> = ({ storyArcs: propArcs }) => {
  const arcs = (propArcs && propArcs.length > 0) ? propArcs : STORY_ARCS;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = arcs[selectedIdx] || arcs[0];

  return (
    <section id="story" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#121822]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
          NARRATIVE CHRONOLOGY // TEN CHAPTERS
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl text-[#edf1f5] uppercase tracking-wider">
          THE DESCENT // STORY ARCS
        </h2>
        <p className="font-serif-cinematic italic text-base text-[#8c97a5]">
          «“Every meter descended strips away another layer of the history we were told to believe.”»
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Arc Selector List */}
        <div className="lg:col-span-5 space-y-2 max-h-[560px] overflow-y-auto pr-1">
          {arcs.map((arc, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={arc.id}
                onClick={() => setSelectedIdx(idx)}
                type="button"
                className={`w-full text-left p-3.5 sm:p-4 border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'border-[#9e2a2b] bg-[#1a080a] text-white shadow-[0_0_12px_rgba(158,42,43,0.3)]'
                    : 'border-[#1b2533] bg-[#070b10] text-[#7d8b9e] hover:border-[#2e3e52] hover:text-[#c4ccd6]'
                }`}
              >
                <div>
                  <span className="text-[10px] font-editorial-mono tracking-widest block text-[#9e2a2b]">
                    {arc.number} // {arc.japanese}
                  </span>
                  <span className="font-cinzel text-xs sm:text-sm uppercase tracking-wide block font-semibold mt-0.5">
                    {arc.title}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-[#9e2a2b]' : 'text-[#414d5e]'}`} />
              </button>
            );
          })}
        </div>

        {/* Selected Arc Detail Dossier */}
        <div className="lg:col-span-7 border border-[#1f2837] bg-[#070b10] p-6 sm:p-10 space-y-6">
          {active && (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-[#161d28]">
                <div>
                  <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-widest uppercase font-bold">
                    {active.number} · DEPTH LEVEL: {active.depthLevel}
                  </span>
                  <h3 className="font-cinzel text-2xl sm:text-3xl text-[#edf1f5] uppercase tracking-wide mt-1">
                    {active.title} <span className="text-lg text-[#616e7e]">({active.japanese})</span>
                  </h3>
                </div>
              </div>

              <p className="font-serif-cinematic italic text-base text-[#9e2a2b]">
                {active.quote}
              </p>

              <div className="space-y-3">
                <span className="text-xs font-editorial-mono tracking-widest text-[#717e8f] uppercase block">
                  CANONICAL SYNOPSIS:
                </span>
                <p className="text-sm text-[#9aa4b2] leading-relaxed font-light">
                  {active.synopsis}
                </p>
              </div>

              <div className="p-4 border border-[#1b2432] bg-[#05070a] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-editorial-mono text-[#cbd2dc]">
                  <Bookmark className="w-3.5 h-3.5 text-[#9e2a2b]" />
                  <span className="font-bold uppercase">RECOVERED KEY ARTIFACT:</span>
                </div>
                <span className="text-xs font-editorial-mono text-[#f2afb2]">
                  {active.keyArtifact}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
