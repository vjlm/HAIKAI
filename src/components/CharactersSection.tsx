import React, { useState } from 'react';
import { CHARACTERS } from '../data/haikaiData';
import { Character } from '../types/haikai';
import { Lock, Eye } from 'lucide-react';

export const CharactersSection: React.FC = () => {
  const [activeChar, setActiveChar] = useState<Character>(CHARACTERS[0]);
  const [revealedClassified, setRevealedClassified] = useState<Record<string, boolean>>({});

  const toggleClassified = (charId: string) => {
    setRevealedClassified((prev) => ({
      ...prev,
      [charId]: !prev[charId],
    }));
  };

  return (
    <section id="characters" className="relative w-full bg-[#050608] py-28 md:py-36 px-6 md:px-12 border-t border-[#141b24] overflow-hidden">
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>DRAMATIS PERSONAE</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">KEY DOSSIERS</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl tracking-[0.28em] text-[#e4e8ec] uppercase font-light mb-3">
            THE PEOPLE WHO WILL CHANGE THE WORLD
          </h2>
          <p className="font-jp text-base tracking-[0.4em] text-[#717b88]">
            登場人物録
          </p>
          <div className="w-16 h-[1px] bg-[#9e2a2b] mt-6" />
        </div>

        {/* Character Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10">
          {CHARACTERS.map((char) => {
            const isActive = activeChar.id === char.id;
            return (
              <button
                key={char.id}
                onClick={() => setActiveChar(char)}
                type="button"
                className={`p-4 text-left border transition-all duration-300 relative ${
                  isActive
                    ? 'border-[#9e2a2b] bg-[#111722] shadow-xl'
                    : 'border-[#1b222c] bg-[#07090d] hover:border-[#2d3848]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-editorial-mono text-[10px] text-[#9e2a2b]">
                    DOSSIER
                  </span>
                  <span className="font-jp text-xs text-[#5f6a78]">
                    {char.japanese.slice(0, 3)}
                  </span>
                </div>
                <h3 className="font-cinzel text-xs sm:text-sm tracking-wider uppercase text-[#d5dbe2] font-semibold truncate">
                  {char.name}
                </h3>
                <span className="text-[11px] text-[#758190] block truncate mt-0.5">
                  {char.role}
                </span>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9e2a2b]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Cinematic Character Poster Panel */}
        <div
          className={`border transition-all duration-500 p-8 sm:p-12 lg:p-14 ${
            activeChar.id === 'ren-vessel'
              ? 'border-[#30161a] bg-[#090506]'
              : 'border-[#1c2430] bg-[#080b10]'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left: Cinematic Poster Illustration / Silhouette */}
            <div className="lg:col-span-5 relative flex flex-col justify-between border border-[#1f2835] bg-[#0d121a] p-8 overflow-hidden min-h-[460px]">
              {/* Artistic Background Texture */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040609] via-[#090e17]/80 to-transparent z-10" />

              {/* Character-specific artistic silhouette & mood */}
              <div className="absolute inset-0 flex items-center justify-center">
                {activeChar.id === 'nero-vale' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center opacity-80">
                    <div className="w-44 h-44 rounded-full border border-[#2b3a4e]/40 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full border border-[#9e2a2b]/30" />
                    </div>
                    <span className="text-[10px] font-editorial-mono text-[#546274] tracking-widest uppercase mt-6">
                      SALVAGE HARNESS #402 // RECOVERED
                    </span>
                  </div>
                )}

                {activeChar.id === 'eira-voss' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center opacity-80">
                    <div className="w-48 h-60 border border-[#253347] rotate-3 flex items-center justify-center">
                      <div className="w-36 h-48 border border-[#485b75]/30 -rotate-6" />
                    </div>
                    <span className="text-[10px] font-editorial-mono text-[#546274] tracking-widest uppercase mt-6">
                      IMPERIAL CHART FOLIO // UNAUTHORIZED
                    </span>
                  </div>
                )}

                {activeChar.id === 'cael-arden' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center opacity-80">
                    <div className="w-40 h-40 border border-[#422e1e]/40 rotate-45 flex items-center justify-center">
                      <div className="w-24 h-24 border border-[#85532a]/30" />
                    </div>
                    <span className="text-[10px] font-editorial-mono text-[#745a47] tracking-widest uppercase mt-6">
                      FORTRESS ZERO MEDAL // DEFACED
                    </span>
                  </div>
                )}

                {activeChar.id === 'mira' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center opacity-80">
                    <div className="flex gap-2">
                      <div className="w-8 h-24 border border-[#274838] bg-[#0d2218]/40" />
                      <div className="w-8 h-28 border border-[#274838] bg-[#0d2218]/60 -translate-y-2" />
                      <div className="w-8 h-20 border border-[#274838] bg-[#0d2218]/40" />
                    </div>
                    <span className="text-[10px] font-editorial-mono text-[#3e6a53] tracking-widest uppercase mt-6">
                      CARVED WHITE PINE PLAQUES // COUNT: 842
                    </span>
                  </div>
                )}

                {activeChar.id === 'ren-vessel' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <div className="w-52 h-52 bg-[radial-gradient(circle_at_center,_rgba(158,42,43,0.3)_0%,_transparent_75%)]" />
                    <div className="w-32 h-32 border border-[#4d161a] rounded-full" />
                    <span className="text-[10px] font-editorial-mono text-[#8a3337] tracking-widest uppercase mt-6">
                      IDENTITY RESTRICTED // 116 YEARS UNCHANGED
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Visual Poster Overlay */}
              <div className="relative z-20">
                <span className="font-jp text-3xl sm:text-4xl text-[#edf1f4] tracking-widest font-light block mb-2">
                  {activeChar.japanese}
                </span>
                <span className="text-xs font-editorial-mono text-[#8894a4] tracking-widest uppercase">
                  AGE: {activeChar.age} · ORIGIN: {activeChar.origin}
                </span>
              </div>
            </div>

            {/* Right: Character Narrative, Known For, and Classified Dossier */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                {/* Header Information */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1b232e] mb-4">
                  <div>
                    <h3 className="font-cinzel text-3xl sm:text-4xl text-[#edf0f3] tracking-wide uppercase font-semibold">
                      {activeChar.name}
                    </h3>
                    <span className="font-editorial-mono text-xs text-[#9e2a2b] tracking-widest uppercase">
                      {activeChar.role}
                    </span>
                  </div>
                  <span className="font-editorial-mono text-xs text-[#525f70] tracking-widest">
                    ID // {activeChar.id.toUpperCase()}
                  </span>
                </div>

                {/* Key Character Highlight */}
                <div className="my-6 p-4 border-l-2 border-[#9e2a2b] bg-[#0e141d]/70">
                  <p className="font-serif-cinematic text-xl text-[#d4dae0] italic">
                    «{activeChar.highlight}»
                  </p>
                </div>

                {/* Narrative Description */}
                <p className="text-sm sm:text-base text-[#9ea9b7] leading-relaxed font-light mb-6">
                  {activeChar.description}
                </p>

                {/* Known For (Tags) */}
                <div className="mb-8">
                  <span className="text-[11px] font-cinzel tracking-[0.2em] text-[#697686] uppercase block mb-3">
                    KNOWN FOR
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeChar.knownFor.map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1 text-xs font-editorial-mono tracking-wider text-[#b8c2cd] border border-[#242e3d] bg-[#0c1017]"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Classified Record Toggle Area */}
              {activeChar.classifiedNote && (
                <div className="pt-6 border-t border-[#18212c]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2 text-xs font-editorial-mono tracking-widest text-[#9e2a2b] uppercase font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      CLASSIFIED DOSSIER RECORD
                    </span>
                    <button
                      onClick={() => toggleClassified(activeChar.id)}
                      type="button"
                      className="flex items-center gap-1.5 text-xs font-editorial-mono text-[#8c97a5] hover:text-white border border-[#2a3444] px-3 py-1 bg-[#0b0f16] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{revealedClassified[activeChar.id] ? 'CONCEAL' : 'DECRYPT'}</span>
                    </button>
                  </div>

                  {revealedClassified[activeChar.id] ? (
                    <div className="p-4 border border-[#9e2a2b]/40 bg-[#160c0e] animate-in fade-in duration-300">
                      <p className="text-xs sm:text-sm font-editorial-mono text-[#dca6a8] leading-relaxed">
                        {activeChar.classifiedNote}
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={() => toggleClassified(activeChar.id)}
                      className="p-3 border border-[#202835] bg-[#0b0e14] cursor-pointer hover:border-[#374457] transition-colors flex items-center justify-between"
                    >
                      <span className="redacted-bar text-xs">
                        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                      </span>
                      <span className="text-[10px] font-editorial-mono text-[#546070] tracking-widest uppercase">
                        [ ACCESS RESTRICTED · CLICK TO DECRYPT ]
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
