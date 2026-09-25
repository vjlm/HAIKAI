import React from 'react';

export const Introduction: React.FC = () => {
  return (
    <section className="relative w-full bg-[#050608] py-32 md:py-48 px-6 md:px-12 border-t border-[#141a24] overflow-hidden">
      {/* Subtle background gradient and haze */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,22,32,0.6)_0%,_rgba(5,6,8,1)_70%)] pointer-events-none" />
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Archival Section Marker */}
        <div className="flex items-center gap-3 mb-8 text-[11px] font-editorial-mono tracking-[0.35em] text-[#6d7785] uppercase">
          <span>HISTORICAL ANNALS</span>
          <span>·</span>
          <span className="text-[#9e2a2b]">RECORD 00</span>
        </div>

        {/* Section Heading */}
        <h2 className="font-cinzel text-xs md:text-sm tracking-[0.45em] text-[#8692a0] uppercase mb-4">
          THE FIRST FLOOD
        </h2>

        {/* 3000 YEARS AGO */}
        <div className="my-10 md:my-14 py-2 border-y border-[#1d2633] w-full max-w-md">
          <p className="font-editorial-mono text-2xl md:text-3xl lg:text-4xl tracking-[0.3em] text-[#d6dbdf] font-light">
            3000 YEARS AGO
          </p>
        </div>

        {/* Gradual Staggered Story Statements with generous spacing */}
        <div className="space-y-24 md:space-y-36 my-12 w-full">
          {/* Statement 1 */}
          <div className="max-w-2xl mx-auto">
            <blockquote className="font-serif-cinematic text-xl sm:text-2xl md:text-3xl leading-relaxed text-[#c2c8d0] font-light italic">
              «Three thousand years ago, humanity survived an event known only as The First Flood.»
            </blockquote>
            <p className="text-xs font-editorial-mono text-[#545e6d] tracking-widest uppercase mt-4">
              [ OFFICIAL IMPERIAL RECKONING · YEAR 0001 ]
            </p>
          </div>

          {/* Statement 2 */}
          <div className="max-w-2xl mx-auto">
            <blockquote className="font-serif-cinematic text-xl sm:text-2xl md:text-3xl leading-relaxed text-[#c2c8d0] font-light italic">
              «After it, an impossible black sea appeared around the known world.»
            </blockquote>
            <p className="text-xs font-editorial-mono text-[#545e6d] tracking-widest uppercase mt-4">
              [ HYDROSTATIC RECORD · SURFACE ELEVATION CONSTANT ]
            </p>
          </div>

          {/* Statement 3 — HAIKAI Reveal */}
          <div className="max-w-xl mx-auto pt-8 border-t border-[#19222e]">
            <span className="font-jp text-5xl sm:text-6xl md:text-7xl tracking-[0.25em] text-[#eaeef1] block mb-4 font-light">
              灰海
            </span>
            <span className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-[0.4em] text-[#9e2a2b] font-medium block mb-4">
              HAIKAI
            </span>
            <p className="font-serif-cinematic text-2xl sm:text-3xl md:text-4xl text-[#dde2e6] italic font-normal">
              «The Sea of Ash.»
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
