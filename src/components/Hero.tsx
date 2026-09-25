import React from 'react';
import { OceanCanvas } from './OceanCanvas';
import { AshParticles } from './AshParticles';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden bg-[#050608] pt-28 pb-12 select-none">
      {/* Dynamic ocean canvas */}
      <OceanCanvas className="opacity-90" />

      {/* Atmospheric ash particle layer */}
      <AshParticles density={50} speedMultiplier={0.9} />

      {/* Subtle vignette and film grain */}
      <div className="cinematic-vignette pointer-events-none absolute inset-0 z-10" />
      <div className="film-grain pointer-events-none absolute inset-0 z-10 opacity-30" />

      {/* Subtle top archival metadata */}
      <div className="relative z-20 w-full max-w-7xl px-6 md:px-10 flex justify-between items-center text-[10px] md:text-xs font-editorial-mono tracking-[0.25em] text-[#616b78] uppercase">
        <span className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#9e2a2b] animate-pulse" />
          CHRONICLE RECORD // LAT 41°N
        </span>
        <span className="hidden sm:inline">ORIGINAL CINEMATIC ARCHIVE</span>
      </div>

      {/* Main Title Centerpiece */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl my-auto">
        {/* Japanese Title */}
        <div className="relative mb-2">
          <h2 className="font-jp text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[0.3em] text-[#eef1f3] drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] opacity-95">
            灰海
          </h2>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.4em] font-editorial-mono text-[#9e2a2b] font-medium whitespace-nowrap">
            PRE-FLOOD RECKONING
          </div>
        </div>

        {/* English Title & Subtitle */}
        <div className="space-y-3 mb-6">
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.35em] text-[#dce1e6] font-medium uppercase drop-shadow-lg">
            HAIKAI
          </h1>
          <p className="font-cinzel text-xs sm:text-sm md:text-base tracking-[0.55em] text-[#8c96a3] uppercase font-light">
            THE SEA OF ASH
          </p>
        </div>

        {/* Central Philosophical Question */}
        <div className="max-w-xl mx-auto my-6 px-4 py-2 border-y border-[#263140]/60 bg-[#070a0e]/40 backdrop-blur-xs">
          <blockquote className="font-serif-cinematic italic text-lg sm:text-xl md:text-2xl text-[#b8c0c9] tracking-wide font-normal">
            «“Was this world ever meant to be saved?”»
          </blockquote>
        </div>

        {/* Cinematic Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-5 mt-6 w-full sm:w-auto">
          <a
            href="#world"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-cinzel tracking-[0.25em] text-[#e8ebed] uppercase border border-[#3b4759] bg-[#0c1118]/80 hover:bg-[#121924] hover:border-[#9e2a2b] transition-all duration-300 shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              [ ENTER THE WORLD <span className="text-[#9e2a2b] transition-transform duration-300 group-hover:translate-x-1">→</span> ]
            </span>
          </a>

          <a
            href="#characters"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-cinzel tracking-[0.25em] text-[#909aa6] hover:text-[#e8ebed] uppercase border border-[#202733] hover:border-[#404c5e] bg-[#07090d]/60 hover:bg-[#0c1016] transition-all duration-300"
          >
            <span>[ MEET THE CHARACTERS ]</span>
          </a>
        </div>
      </div>

      {/* Tiny bottom indicator: SCROLL TO DESCEND */}
      <div className="relative z-20 flex flex-col items-center gap-3">
        <span className="text-[10px] font-editorial-mono tracking-[0.3em] uppercase text-[#616b78]">
          SCROLL TO DESCEND
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#616b78] via-[#9e2a2b] to-transparent relative overflow-hidden">
          <div className="w-full h-3 bg-white/80 animate-pulse absolute top-0" />
        </div>
      </div>
    </section>
  );
};
