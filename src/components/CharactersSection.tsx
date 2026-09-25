import React, { useState } from 'react';
import { Character } from '../types/haikai';
import { CHARACTERS } from '../data/haikaiData';
import { User, Shield, FileText } from 'lucide-react';

interface CharactersSectionProps {
  characters?: Character[];
}

export const CharactersSection: React.FC<CharactersSectionProps> = ({ characters: propChars }) => {
  const characters = (propChars && propChars.length > 0) ? propChars : CHARACTERS;
  const [activeIdx, setActiveIdx] = useState(0);
  const active = characters[activeIdx] || characters[0];

  return (
    <section id="characters" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#121822]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
          PERSONNEL ARCHIVE // PRIMARY DOSSIERS
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl text-[#edf1f5] uppercase tracking-wider">
          THE EXPEDITION
        </h2>
        <p className="font-serif-cinematic italic text-base text-[#8c97a5]">
          «“None of them set out to uncover the truth. They simply ran out of lies that kept them alive.”»
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
        {characters.map((char, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <button
              key={char.id}
              onClick={() => setActiveIdx(idx)}
              type="button"
              className={`p-3 text-left border transition-all ${
                isSelected
                  ? 'border-[#9e2a2b] bg-[#1a080a] text-white shadow-[0_0_12px_rgba(158,42,43,0.3)]'
                  : 'border-[#1b2533] bg-[#070b10] text-[#788597] hover:border-[#2e3e52] hover:text-[#c0c9d6]'
              }`}
            >
              <span className="text-[10px] font-editorial-mono tracking-widest block text-[#9e2a2b]">
                {char.japanese}
              </span>
              <span className="font-cinzel text-xs uppercase tracking-wider block font-semibold truncate">
                {char.name}
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="border border-[#1f2837] bg-[#070b10] p-6 sm:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#161d28] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-widest uppercase font-bold">
                  {active.role} · AGE {active.age}
                </span>
                <span className="text-xs font-editorial-mono text-[#586575]">
                  // {active.origin}
                </span>
              </div>
              <h3 className="font-cinzel text-2xl sm:text-3xl text-[#edf1f5] uppercase tracking-wide mt-1">
                {active.name} <span className="text-lg text-[#616e7e]">({active.japanese})</span>
              </h3>
            </div>
            <p className="font-serif-cinematic italic text-sm text-[#9e2a2b] max-w-md">
              {active.quote}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-[#9aa4b2] leading-relaxed font-light">
              {active.description}
            </p>

            <div className="p-4 border border-[#17202c] bg-[#05070a] space-y-2">
              <span className="text-[11px] font-editorial-mono text-[#788698] uppercase tracking-wider block">
                PHYSICAL APPEARANCE:
              </span>
              <p className="text-xs text-[#8d99a8] leading-relaxed">
                {active.appearance}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {active.knownFor?.map((trait, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-[11px] font-editorial-mono border border-[#1f2937] bg-[#0b0f15] text-[#a1acba]"
                >
                  #{trait}
                </span>
              ))}
            </div>

            {active.classifiedNote && (
              <div className="p-4 border border-[#42171a] bg-[#120709] text-[#f2afb2] text-xs font-editorial-mono space-y-1 mt-4">
                <span className="text-[#9e2a2b] font-bold block uppercase tracking-widest">
                  [!] CLASSIFIED CORDON RECORD:
                </span>
                <p className="leading-relaxed opacity-90">
                  {active.classifiedNote}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
