import React from 'react';
import { GitCommit, ArrowRight, ShieldCheck, HeartCrack, Flame } from 'lucide-react';

export const RelationshipGraph: React.FC = () => {
  const bonds = [
    {
      source: 'NERO VALE',
      target: 'EIRA VOSS',
      type: 'ALLIANCE // REPRESSED TENSION',
      desc: 'He trusts her maps; she fears his instinct. Neither will admit that surviving without the other has become unthinkable.',
      tag: 'CANON PAIRING',
    },
    {
      source: 'NERO VALE',
      target: 'CAEL ARDEN',
      type: 'MENTORSHIP // CAUTIONARY FATE',
      desc: 'Cael sees his younger self before the cordon wars. Nero refuses to end up drowned in cheap whiskey and regret.',
      tag: 'FRATERNAL',
    },
    {
      source: 'EIRA VOSS',
      target: 'CAEL ARDEN',
      type: 'MILITARY SHADOW // TREASON',
      desc: 'She represents the Crownlands command that condemned his regiment. He knows the secret orders her father signed.',
      tag: 'ANTAGONISM',
    },
    {
      source: 'MIRA',
      target: 'ALL EXPEDITION',
      type: 'THE ANCHOR OF NAMES',
      desc: 'As memory slips beneath the ash sea, Mira preserves their identities in carved cedar tags around her neck.',
      tag: 'PRESERVATION',
    },
    {
      source: 'REN VESSEL',
      target: 'THE ENTIRE BASIN',
      type: 'EXISTENTIAL CATALYST',
      desc: 'An ageless figure from beyond latitude 82° South who seeks not humanity’s death, but the end of its comforting quarantine.',
      tag: 'TABOO ARCHETYPE',
    },
  ];

  return (
    <section id="relationships" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#121822]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
          PSYCHOLOGICAL TENSIONS // ALLIANCES
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl text-[#edf1f5] uppercase tracking-wider">
          CHARACTER INTERPLAY
        </h2>
        <p className="font-serif-cinematic italic text-base text-[#8c97a5]">
          «“We do not cling to one another because we are fond of company. We cling because cold water is deeper when you are alone.”»
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {bonds.map((b, idx) => (
          <div
            key={idx}
            className="border border-[#1a2330] bg-[#070b10] p-6 space-y-3 relative group hover:border-[#9e2a2b]/70 transition-all"
          >
            <div className="flex items-center justify-between text-xs font-editorial-mono text-[#9e2a2b]">
              <span className="tracking-widest font-bold">{b.type}</span>
              <span className="px-2 py-0.5 border border-[#3b1215] bg-[#140608] text-[10px]">
                {b.tag}
              </span>
            </div>

            <div className="flex items-center gap-2 font-cinzel text-sm sm:text-base text-[#edf1f5] font-semibold">
              <span>{b.source}</span>
              <ArrowRight className="w-4 h-4 text-[#9e2a2b] shrink-0" />
              <span>{b.target}</span>
            </div>

            <p className="text-xs sm:text-sm text-[#8793a1] leading-relaxed font-light">
              {b.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
