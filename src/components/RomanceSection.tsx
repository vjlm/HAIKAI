import React from 'react';
import { Compass, Anchor, Sparkles } from 'lucide-react';

export const RomanceSection: React.FC = () => {
  return (
    <section id="romance" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#121822]">
      <div className="border border-[#2a171a] bg-[#0d070a] p-8 sm:p-12 relative overflow-hidden">
        {/* Subtle crimson radial gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#9e2a2b]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
            SUBTEXT // NERO & EIRA
          </span>

          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl text-[#edf1f5] uppercase tracking-wider">
            SOME THINGS ARE NEVER SAID
          </h2>

          <p className="font-serif-cinematic italic text-base sm:text-lg text-[#cca1a6] leading-relaxed">
            «“She learned very young that showing weakness allows other people to decide what you are allowed to feel. He learned very young that speaking aloud draws the tide closer. Between their silences lies the only warmth this frozen ocean allows.”»
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-6 border-t border-[#261317]">
            <div className="p-4 bg-[#070406] border border-[#2b1216] space-y-2">
              <div className="flex items-center gap-2 text-xs font-editorial-mono text-[#f2afb2]">
                <Anchor className="w-3.5 h-3.5 text-[#9e2a2b]" />
                <span className="font-bold uppercase">NERO’S SILENCE</span>
              </div>
              <p className="text-xs text-[#9c8489] leading-relaxed font-light">
                He watches her hands steady themselves when the tremors from night-watch cold set in. He adjusts the lamp hood without a word so the glare does not hurt her eyes.
              </p>
            </div>

            <div className="p-4 bg-[#070406] border border-[#2b1216] space-y-2">
              <div className="flex items-center gap-2 text-xs font-editorial-mono text-[#f2afb2]">
                <Compass className="w-3.5 h-3.5 text-[#9e2a2b]" />
                <span className="font-bold uppercase">EIRA’S MAP</span>
              </div>
              <p className="text-xs text-[#9c8489] leading-relaxed font-light">
                In her private field ledger, under coordinate 78° South, she has written his dive depth limit in pencil. Three times erased. Three times rewritten closer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
