import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#030406] text-[#7c8796] border-t border-[#131923] py-16 px-6 md:px-12 select-none">
      <div className="max-w-7xl mx-auto flex flex-col justify-between space-y-12">
        {/* Top Tier: Wordmark and Production Committee */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-[#121822]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-jp text-2xl tracking-widest text-[#edf1f4] font-medium">灰海</span>
              <span className="h-4 w-[1px] bg-[#2d3747]" />
              <span className="font-cinzel text-lg tracking-[0.3em] text-[#d0d6dc] font-semibold">
                HAIKAI
              </span>
            </div>
            <p className="font-cinzel text-[11px] tracking-[0.4em] text-[#5e6b7c] uppercase">
              THE SEA OF ASH — OFFICIAL ANIME & MANGA PRODUCTION
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-xs font-editorial-mono tracking-wider uppercase text-[#96a2b2] hover:text-white border border-[#1e2735] hover:border-[#38465d] bg-[#070a0f] transition-all"
            >
              <span>TOP OF SHORE</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#9e2a2b]" />
            </button>
          </div>
        </div>

        {/* Middle Tier: Legal, Production Notice, Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-light">
          <div>
            <span className="font-cinzel text-xs tracking-widest uppercase text-[#98a4b4] block mb-3 font-semibold">
              PRODUCTION ARCHIVE
            </span>
            <p className="text-[#647182] leading-relaxed">
              灰海製作委員会 (HAIKAI Production Committee)
              <br />
              All rights reserved. Unauthorized reproduction, bathymetric falsification, and unsanctioned translation of the Cordon records are prohibited by imperial statute.
            </p>
          </div>

          <div>
            <span className="font-cinzel text-xs tracking-widest uppercase text-[#98a4b4] block mb-3 font-semibold">
              NAVIGATION
            </span>
            <div className="grid grid-cols-2 gap-2 text-[#7c8898] font-editorial-mono text-[11px]">
              <a href="#world" className="hover:text-white transition-colors">01. WORLD</a>
              <a href="#characters" className="hover:text-white transition-colors">02. CHARACTERS</a>
              <a href="#story" className="hover:text-white transition-colors">03. DESCENT ARCS</a>
              <a href="#oath" className="hover:text-white transition-colors">04. OATH BINDINGS</a>
              <a href="#mysteries" className="hover:text-white transition-colors">05. ARCHIVE FILES</a>
              <a href="#gallery" className="hover:text-white transition-colors">06. VISUAL GALLERY</a>
            </div>
          </div>

          <div>
            <span className="font-cinzel text-xs tracking-widest uppercase text-[#98a4b4] block mb-3 font-semibold">
              PHILOSOPHICAL CODE
            </span>
            <p className="font-serif-cinematic text-sm text-[#8c97a5] italic leading-relaxed">
              «“Truth isn't automatically freedom. But a cage with a painted sky is still a cage.”»
            </p>
          </div>
        </div>

        {/* Bottom Tier: Minimal Copyright & Zero-pill text */}
        <div className="pt-8 border-t border-[#0e131b] flex flex-col sm:flex-row justify-between items-center text-[10px] font-editorial-mono text-[#4b5563] uppercase gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 HAIKAI COMMITTEE</span>
            <span>·</span>
            <span>ORIGINAL DARK FANTASY CHRONICLE</span>
          </div>

          <div className="flex items-center gap-4">
            <span>ARCHIVE CLASSIFICATION: GA-VII</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">NO CONFIRMED BOTTOM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
