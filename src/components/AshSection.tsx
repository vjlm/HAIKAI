import React from 'react';
import { Flame, Sparkles, AlertOctagon } from 'lucide-react';

export const AshSection: React.FC = () => {
  return (
    <section id="ash" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#121822]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
          ANOMALY DOSSIER // PHENOMENOLOGY
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl text-[#edf1f5] uppercase tracking-wider">
          THE ASH // MIRACLES & MUTATIONS
        </h2>
        <p className="font-serif-cinematic italic text-base text-[#8c97a5]">
          «“Ash gives warmth to our bastions and sight to our lamps. In return, it demands that you surrender your tomorrow.”»
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Miracles */}
        <div className="border border-[#1f2837] bg-[#070b10] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-[#f2afb2]">
            <Sparkles className="w-5 h-5 text-[#9e2a2b]" />
            <h3 className="font-cinzel text-xl uppercase tracking-wider text-[#e6ebf1]">
              THE BLESSING // INDUSTRIAL FUEL
            </h3>
          </div>
          <p className="text-sm text-[#8a96a5] leading-relaxed font-light">
            When refined in the Crownland Bastion blast-furnaces, the black precipitate burns with white heat for weeks without consuming oxygen. It powers steam turbines, melts glass, and protects cities from the cold maritime mist.
          </p>
          <ul className="text-xs font-editorial-mono text-[#717e8f] space-y-2 border-t border-[#151c27] pt-4">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#9e2a2b] rounded-full" />
              Perpetual Combustion without carbon monoxide
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#9e2a2b] rounded-full" />
              Antiseptic preservation of tissue and parchment
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#9e2a2b] rounded-full" />
              Thermal refraction shielding against outer radiation
            </li>
          </ul>
        </div>

        {/* Mutations */}
        <div className="border border-[#381518] bg-[#0c0608] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-[#f2afb2]">
            <AlertOctagon className="w-5 h-5 text-[#9e2a2b]" />
            <h3 className="font-cinzel text-xl uppercase tracking-wider text-[#f5c2c4]">
              THE PRICE // CALCIFICATION
            </h3>
          </div>
          <p className="text-sm text-[#9c8286] leading-relaxed font-light">
            Prolonged inhalation of raw ocean ash calcifies human soft tissue into gray basalt. Divers lose their peripheral vision, their veins turn dark silver, and within five years their vocal cords harden into brittle quartz.
          </p>
          <ul className="text-xs font-editorial-mono text-[#917176] space-y-2 border-t border-[#220d11] pt-4">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#9e2a2b] rounded-full" />
              Vocal Quartz Mutation (Silencing of speech)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#9e2a2b] rounded-full" />
              Memory Severance (Forgetting childhood names)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#9e2a2b] rounded-full" />
              Tidal Sleepwalking (Wandering into midnight surf)
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
