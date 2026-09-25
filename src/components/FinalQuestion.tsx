import React, { useState } from 'react';
import { HelpCircle, Eye, EyeOff } from 'lucide-react';

export const FinalQuestion: React.FC = () => {
  const [choice, setChoice] = useState<'illusion' | 'truth' | null>(null);

  return (
    <section className="py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center border-t border-[#121822]">
      <div className="space-y-6">
        <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
          THE ULTIMATE DIVERGENCE
        </span>

        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#edf1f5] uppercase tracking-wider">
          WAS THIS WORLD EVER MEANT TO BE SAVED?
        </h2>

        <p className="font-serif-cinematic italic text-base sm:text-xl text-[#8d98a7] max-w-2xl mx-auto leading-relaxed">
          «“If you break the quarantine, billions outside will remember that humanity failed. If you maintain the cage, your descendants will live in peace, believing the sky is real.”»
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button
            onClick={() => setChoice('illusion')}
            type="button"
            className={`w-full sm:w-auto px-6 py-3.5 border text-xs font-cinzel uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 ${
              choice === 'illusion'
                ? 'border-[#3b4c60] bg-[#121924] text-white shadow-[0_0_15px_rgba(59,76,96,0.3)]'
                : 'border-[#1b2432] bg-[#070b10] text-[#788597] hover:border-[#2f3e52] hover:text-[#cbd4e0]'
            }`}
          >
            <EyeOff className="w-4 h-4 text-[#5e7087]" />
            <span>[ PRESERVE THE PEACEFUL ILLUSION ]</span>
          </button>

          <button
            onClick={() => setChoice('truth')}
            type="button"
            className={`w-full sm:w-auto px-6 py-3.5 border text-xs font-cinzel uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 ${
              choice === 'truth'
                ? 'border-[#9e2a2b] bg-[#1d080b] text-[#f2afb2] shadow-[0_0_15px_rgba(158,42,43,0.35)]'
                : 'border-[#2e1518] bg-[#0d0608] text-[#9c8489] hover:border-[#9e2a2b] hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4 text-[#9e2a2b]" />
            <span>[ SHATTER THE QUARANTINE SEAL ]</span>
          </button>
        </div>

        {choice && (
          <div className="mt-8 p-6 border border-[#222d3b] bg-[#070b10] max-w-xl mx-auto animate-in fade-in duration-500 text-left">
            <span className="text-xs font-editorial-mono text-[#9e2a2b] uppercase tracking-widest block font-bold mb-2">
              CONSEQUENCE REGISTERED:
            </span>
            <p className="text-xs sm:text-sm text-[#9aa4b2] leading-relaxed font-light">
              {choice === 'illusion'
                ? 'You choose the quiet life of the bastions. Nero returns to the salvage skiff, Eira buries her ledger, and the Crownlands continue their three-thousand-year reign in peaceful ignorance.'
                : 'The Keystones shatter. The black ocean begins to drain into the outer world. Whatever cast humanity down three millennia ago turns its eye back toward the basin.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
