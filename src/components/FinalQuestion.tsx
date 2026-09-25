import React, { useState } from 'react';

export const FinalQuestion: React.FC = () => {
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);

  const survivalChoices = ['The truth?', 'Civilization?', 'Memory?', 'Love?', 'The world?'];

  return (
    <section className="relative w-full bg-[#030304] text-[#c0c5cc] py-36 md:py-52 px-6 md:px-12 border-t border-[#12161f] overflow-hidden select-none">
      {/* Absolute dark void backdrop */}
      <div className="film-grain pointer-events-none absolute inset-0 opacity-15" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Archival Terminal Marker */}
        <div className="text-[10px] font-editorial-mono tracking-[0.4em] text-[#4d5663] uppercase mb-16">
          TERMINAL RECKONING // COGNITIVE TRIAL
        </div>

        {/* 19. FINAL QUESTION */}
        <div className="space-y-16 md:space-y-24 mb-32 w-full">
          <div>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.3em] text-[#edf0f3] uppercase font-light leading-tight">
              WHAT DESERVES TO SURVIVE?
            </h2>
            <div className="w-12 h-[1px] bg-[#9e2a2b] mx-auto mt-6" />
          </div>

          {/* Survival Choices */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {survivalChoices.map((choice) => (
              <button
                key={choice}
                onClick={() => setSelectedResponse(choice)}
                type="button"
                className={`font-serif-cinematic text-xl sm:text-2xl md:text-3xl italic tracking-wide transition-all ${
                  selectedResponse === choice
                    ? 'text-white border-b border-[#9e2a2b]'
                    : 'text-[#677382] hover:text-[#c4ccd6]'
                }`}
              >
                «{choice}»
              </button>
            ))}
          </div>

          {/* Moral Dilemma */}
          <div className="max-w-2xl mx-auto py-10 border-y border-[#161c26]">
            <p className="font-serif-cinematic text-xl sm:text-2xl md:text-3xl text-[#b8c2cc] font-light italic leading-relaxed">
              «If you could erase one truth from the world so everyone you love could live peacefully…»
            </p>
          </div>

          {/* Large final text: WOULD YOU? */}
          <div className="pt-8">
            <h3 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.4em] text-[#eaeef1] uppercase font-medium">
              WOULD YOU?
            </h3>
          </div>
        </div>

        {/* Generous Empty Space */}
        <div className="h-32 md:h-48" />

        {/* 20. FINAL IMAGE / CLOSING SCENE */}
        <div className="w-full max-w-3xl border border-[#19202c] bg-[#050608] p-8 sm:p-14 mb-36 shadow-2xl">
          <div className="text-[10px] font-editorial-mono tracking-[0.3em] text-[#475262] uppercase mb-10 pb-4 border-b border-[#141a24]">
            RECOVERY RECORD · SHORELINE EPILOGUE
          </div>

          <div className="space-y-12 text-left max-w-xl mx-auto py-4">
            <p className="font-serif-cinematic text-base sm:text-lg text-[#7c8898] italic">
              A quiet black gravel seashore. An older woman. A child. The vast silent sea.
            </p>

            <div className="space-y-4">
              <p className="font-serif-cinematic text-xl sm:text-2xl text-[#a4afbd] italic">
                «“Was the sea always black?”»
              </p>
              <p className="font-serif-cinematic text-xl sm:text-2xl text-[#d4dae0] italic">
                «“No.”»
              </p>
              <p className="font-serif-cinematic text-xl sm:text-2xl text-[#a4afbd] italic">
                «“What color was it?”»
              </p>
            </div>

            <div className="py-2 pl-4 border-l border-[#3a4759]">
              <span className="text-[10px] font-editorial-mono text-[#526072] uppercase tracking-widest block mb-2">
                [ PAUSE ]
              </span>
              <p className="font-serif-cinematic text-2xl sm:text-3xl text-[#eaeef1] italic font-normal">
                «“I don't remember.”»
              </p>
            </div>

            <div className="pt-6 border-t border-[#161d27]">
              <p className="font-serif-cinematic text-sm sm:text-base text-[#8c97a5] italic leading-relaxed">
                She touches an old, scarred bronze diving knife hanging from her leather belt.
              </p>
            </div>
          </div>
        </div>

        {/* Final Fade To Black Logo Reveal */}
        <div className="flex flex-col items-center space-y-6 pt-12">
          <span className="font-jp text-6xl sm:text-7xl md:text-8xl tracking-[0.3em] text-[#dce1e6] font-light">
            灰海
          </span>
          <div className="space-y-2">
            <h4 className="font-cinzel text-2xl sm:text-3xl md:text-4xl tracking-[0.35em] text-[#cfd5dc] uppercase font-semibold">
              HAIKAI
            </h4>
            <p className="font-cinzel text-xs sm:text-sm tracking-[0.55em] text-[#717c8a] uppercase">
              THE SEA OF ASH
            </p>
          </div>

          <div className="pt-4 pb-12">
            <span className="text-xs font-editorial-mono tracking-[0.4em] text-[#9e2a2b] uppercase">
              — END —
            </span>
          </div>

          {/* FINAL BRAND STATEMENT */}
          <div className="pt-16 border-t border-[#161c26] max-w-lg mx-auto">
            <p className="font-cinzel text-xs tracking-[0.3em] text-[#697686] uppercase mb-4">
              HAIKAI — THE SEA OF ASH
            </p>
            <blockquote className="font-serif-cinematic text-2xl sm:text-3xl text-[#dbe0e6] italic mb-6">
              «“Truth isn't automatically freedom.”»
            </blockquote>
            <p className="font-cinzel text-base sm:text-lg tracking-[0.3em] text-[#9e2a2b] uppercase font-bold">
              WHAT WOULD YOU HAVE DONE?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
