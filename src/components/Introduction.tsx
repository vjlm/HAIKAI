import React from 'react';
import { Waves, Droplet, Archive } from 'lucide-react';

export const Introduction: React.FC = () => {
  return (
    <section id="introduction" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#121822]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
          CHAPTER ZERO // ANTECEDENT
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl text-[#edf1f5] uppercase tracking-wider">
          THE FIRST FLOOD
        </h2>
        <p className="font-serif-cinematic italic text-base text-[#8c97a5]">
          «“The water did not rise to cleanse us. The water fell because something above shattered.”»
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-[#1a2330] bg-[#080c12]/80 p-6 sm:p-7 relative group hover:border-[#9e2a2b]/60 transition-all">
          <Waves className="w-6 h-6 text-[#9e2a2b] mb-4" />
          <h3 className="font-cinzel text-lg text-[#e6ebf1] mb-2 uppercase tracking-wide">
            THE TIDE OF ASH
          </h3>
          <p className="text-sm text-[#8792a0] leading-relaxed font-light">
            It is not salt water. The black sea that surrounds the known continents is thick with dissolved bone and ancient sediment. Ships that sink do not decompose; they turn to iron-black stone.
          </p>
        </div>

        <div className="border border-[#1a2330] bg-[#080c12]/80 p-6 sm:p-7 relative group hover:border-[#9e2a2b]/60 transition-all">
          <Droplet className="w-6 h-6 text-[#9e2a2b] mb-4" />
          <h3 className="font-cinzel text-lg text-[#e6ebf1] mb-2 uppercase tracking-wide">
            THE PERIMETER LINE
          </h3>
          <p className="text-sm text-[#8792a0] leading-relaxed font-light">
            At latitude 82° South, the water stops. There is no shore or horizon beyond it—only a black void that absorbs telegraph signals and swallows imperial explorers without sound.
          </p>
        </div>

        <div className="border border-[#1a2330] bg-[#080c12]/80 p-6 sm:p-7 relative group hover:border-[#9e2a2b]/60 transition-all">
          <Archive className="w-6 h-6 text-[#9e2a2b] mb-4" />
          <h3 className="font-cinzel text-lg text-[#e6ebf1] mb-2 uppercase tracking-wide">
            FORGOTTEN PROTOCOLS
          </h3>
          <p className="text-sm text-[#8792a0] leading-relaxed font-light">
            The Crownlands teach that the First Flood was divine judgment. But deep divers recover brass cylinders inscribed with instructions: humanity was never indigenous to this basin.
          </p>
        </div>
      </div>
    </section>
  );
};
