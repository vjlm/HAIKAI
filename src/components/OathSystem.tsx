import React from 'react';
import { ShieldCheck, Flame, Scale } from 'lucide-react';

export const OathSystem: React.FC = () => {
  const oaths = [
    {
      title: 'THE OATH OF DEPTH',
      swornBy: 'Salvage Divers',
      consequence: 'Never rise faster than the tide permits; in return, your lungs extract oxygen from suspended ash.',
      penalty: 'Immediate calcification of heart valves upon surfacing in panic.',
    },
    {
      title: 'THE OATH OF THE BOUNDARY',
      swornBy: 'Cordon Garrison Officers',
      consequence: 'Never speak of what lies beyond latitude 82°; in return, blade wounds bleed silver and knit in hours.',
      penalty: 'Speaking a forbidden name turns your blood to vitreous sand within ninety heartbeats.',
    },
    {
      title: 'THE OATH OF THE NAME-KEEPER',
      swornBy: 'Hollow Forest Elders',
      consequence: 'Never refuse a dying stranger’s name; in return, the mist cannot sever your consciousness.',
      penalty: 'Forgetting a registered name wipes your own mother’s face from your memory forever.',
    },
  ];

  return (
    <section id="oath" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#121822]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
          METAPHYSICS // COVENANT DOCTRINE
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl text-[#edf1f5] uppercase tracking-wider">
          THE OATH SYSTEM // POWER HAS A PRICE
        </h2>
        <p className="font-serif-cinematic italic text-base text-[#8c97a5]">
          «“There is no magic in this world that does not demand you sign away a piece of what makes you human.”»
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {oaths.map((o, idx) => (
          <div
            key={idx}
            className="border border-[#1f2837] bg-[#070b10] p-6 sm:p-7 space-y-4 flex flex-col justify-between group hover:border-[#9e2a2b]/70 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-editorial-mono text-[#9e2a2b]">
                <Scale className="w-4 h-4" />
                <span className="tracking-wider">{o.swornBy}</span>
              </div>
              <h3 className="font-cinzel text-lg text-[#edf1f5] uppercase tracking-wide">
                {o.title}
              </h3>
              <p className="text-sm text-[#8a96a5] leading-relaxed font-light">
                {o.consequence}
              </p>
            </div>

            <div className="pt-4 border-t border-[#17202d] text-xs font-editorial-mono text-[#e5989b] space-y-1">
              <span className="text-[#9e2a2b] font-bold block uppercase tracking-wider">
                [!] BREACH BACKLASH:
              </span>
              <p className="opacity-90">{o.penalty}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
