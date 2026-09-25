import React from 'react';
import { EyeOff, Anchor, Skull } from 'lucide-react';

export const SeaOfAsh: React.FC = () => {
  const rules = [
    {
      num: 'RULE 01',
      title: 'NEVER UTTER A REAL NAME OVER OPEN DEEP',
      desc: 'The ash records vibration. When you speak a name into the tide, the sea remembers the speaker, and sooner or later the fog will come to claim the remainder of that person.',
      icon: EyeOff,
    },
    {
      num: 'RULE 02',
      title: 'WHAT SINKS INTO ASH NEVER DECAYS',
      desc: 'Wooden hulls petrify into brittle iron. Human corpses become porcelain statues that float vertically between the thermoclines, facing the southern boundary.',
      icon: Anchor,
    },
    {
      num: 'RULE 03',
      title: 'DO NOT LOOK DOWN WHEN FOOTSTEPS ECHO ON SURFACE',
      desc: 'On windless midnight watches, crew members hear human strides walking across the black swells. If you shine a lantern onto the water, the surface will be empty—but you will never sleep again.',
      icon: Skull,
    },
  ];

  return (
    <section id="sea-of-ash" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#121822]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
          THE THREE LAWS // SURVIVAL DOCTRINE
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl text-[#edf1f5] uppercase tracking-wider">
          THE SEA OF ASH
        </h2>
        <p className="font-serif-cinematic italic text-base text-[#8c97a5]">
          «“A sailor who respects the tide might drown. A sailor who disobeys the rules will cease to have ever been born.”»
        </p>
      </div>

      <div className="space-y-5">
        {rules.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div
              key={idx}
              className="border border-[#1a2330] bg-[#070b10] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-[#9e2a2b]/70 transition-all"
            >
              <div className="p-3 bg-[#110608] border border-[#3b1215] text-[#9e2a2b] shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-2">
                <span className="text-xs font-editorial-mono tracking-widest text-[#9e2a2b] font-bold">
                  {rule.num}
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl text-[#e6ebf1] tracking-wide uppercase">
                  {rule.title}
                </h3>
                <p className="text-sm text-[#8792a0] leading-relaxed font-light">
                  {rule.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
