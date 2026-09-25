import React from 'react';

export const RomanceSection: React.FC = () => {
  return (
    <section className="relative w-full bg-[#050608] py-32 md:py-44 px-6 md:px-12 border-t border-[#141b24] overflow-hidden">
      {/* Cold oceanic night backdrop with dark blue haze */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(12,20,32,0.7)_0%,_rgba(5,6,8,1)_80%)] pointer-events-none" />
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Archival Subdued Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>INTIMATE SILENCE</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">SHORELINE FRAGMENT</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl tracking-[0.3em] text-[#e4e8ec] uppercase font-light mb-4">
            SOME THINGS ARE NEVER SAID
          </h2>
          <p className="font-jp text-base tracking-[0.4em] text-[#717c8a]">
            波打ち際の無言
          </p>
          <div className="w-12 h-[1px] bg-[#9e2a2b] mx-auto mt-6" />
        </div>

        {/* Visual Composition: The Coastal Edge at Midnight */}
        <div className="relative border border-[#1b232f] bg-[#070a0f] p-8 md:p-16 mb-16 shadow-2xl">
          {/* Subtle decorative framing */}
          <div className="absolute top-4 left-4 text-[10px] font-editorial-mono text-[#4b5565] tracking-widest uppercase">
            LAT 38°S · SHELF BASTION FOOTING
          </div>
          <div className="absolute bottom-4 right-4 text-[10px] font-editorial-mono text-[#4b5565] tracking-widest uppercase">
            LOW TIDE
          </div>

          {/* Dialogue Fragments with generous, quiet spacing */}
          <div className="space-y-16 md:space-y-24 py-6 max-w-2xl mx-auto">
            {/* Fragment 1 */}
            <div className="space-y-3">
              <p className="font-serif-cinematic text-xl sm:text-2xl text-[#d4dae0] italic">
                «“Can you walk?”»
              </p>
              <p className="font-serif-cinematic text-xl sm:text-2xl text-[#9fa9b7] italic">
                «“Yes.”»
              </p>
              <div className="pt-3 pl-4 border-l border-[#3a4555]">
                <p className="font-serif-cinematic text-base sm:text-lg text-[#7c8898] italic">
                  He knows she's lying.
                </p>
                <p className="font-serif-cinematic text-base sm:text-lg text-[#b8c2ce] italic">
                  He simply walks slower.
                </p>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="w-8 h-[1px] bg-[#222c3a]" />

            {/* Fragment 2 */}
            <div className="space-y-3">
              <p className="font-serif-cinematic text-xl sm:text-2xl text-[#9fa9b7] italic">
                «“You don't have to protect me.”»
              </p>
              <p className="font-serif-cinematic text-xl sm:text-2xl text-[#d4dae0] italic">
                «“I know.”»
              </p>
              <p className="font-serif-cinematic text-xl sm:text-2xl text-[#9fa9b7] italic">
                «“Then why do you keep doing it?”»
              </p>
              <div className="pt-3 pl-4 border-l border-[#9e2a2b]/70">
                <p className="font-serif-cinematic text-xl sm:text-2xl text-[#e8ebed] italic font-normal">
                  «“I don't know.”»
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Footnote */}
        <div className="text-center">
          <p className="font-editorial-mono text-xs tracking-[0.25em] text-[#556070] uppercase">
            [ NO CONFESSIONS · NO PROMISES · ONLY THE TIDE ]
          </p>
        </div>
      </div>
    </section>
  );
};
