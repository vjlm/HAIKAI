import React from 'react';
import { WAR_RECORDS } from '../data/haikaiData';
import { WarRecord } from '../types/haikai';

export const WarRecords: React.FC = () => {
  return (
    <section className="relative w-full bg-[#050608] py-28 md:py-36 px-6 md:px-12 border-t border-[#141b24] overflow-hidden">
      <div className="film-grain pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>OFFICIAL CENSORSHIP BOARD</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">WAR ARCHIVES</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl tracking-[0.25em] text-[#e4e8ec] uppercase font-light max-w-3xl mb-4 leading-snug">
            HISTORY IS WHAT SURVIVED LONG ENOUGH TO BE WRITTEN DOWN.
          </h2>
          <p className="font-jp text-sm tracking-[0.4em] text-[#6e7887]">
            戦時記録断簡
          </p>
          <div className="w-16 h-[1px] bg-[#9e2a2b] mt-6" />
        </div>

        {/* War Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WAR_RECORDS.map((rec: WarRecord) => (
            <div
              key={rec.id}
              className="border border-[#28221c] bg-[#0c0a08]/90 p-8 sm:p-10 shadow-2xl relative font-mono text-xs flex flex-col justify-between"
            >
              {/* Paper border aging effect */}
              <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end max-w-[200px]">
                {rec.stamps.map((stamp, sIdx) => (
                  <span
                    key={sIdx}
                    className="border border-[#8f393b] text-[#c96365] px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold rotate-[-2deg]"
                  >
                    {stamp}
                  </span>
                ))}
              </div>

              <div>
                {/* Document Metadata */}
                <div className="border-b border-[#2a241f] pb-4 mb-6">
                  <div className="text-[10px] text-[#786c5e] uppercase tracking-widest mb-1">
                    REFERENCE: {rec.recordId}
                  </div>
                  <div className="text-xs text-[#a69888] font-bold">
                    DATE: {rec.date}
                  </div>
                  <div className="text-[11px] text-[#8c7f70] mt-1">
                    ISSUED BY: {rec.department}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-cinzel text-base sm:text-lg text-[#e0d6c8] tracking-wider uppercase mb-6 leading-snug">
                  {rec.title}
                </h3>

                {/* Body with intentional redacted words */}
                <div className="text-xs text-[#b8ab9a] leading-relaxed mb-8 bg-[#080605] p-4 border border-[#231e1a]">
                  {rec.body}
                </div>
              </div>

              {/* Handwritten Note (Faded pencil aesthetic) */}
              <div className="pt-4 border-t border-[#26201a]">
                <span className="text-[10px] text-[#806f5c] tracking-widest uppercase block mb-1">
                  HANDWRITTEN MARGINAL NOTE:
                </span>
                <p className="font-serif-cinematic text-base text-[#cf9d84] italic leading-relaxed">
                  {rec.handwrittenNote}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-editorial-mono text-[11px] tracking-[0.25em] text-[#554e46] uppercase">
            [ ADDITIONAL 4,120 PROTOCOL PAGES WERE BURNED IN CITADEL FURNACE 02 · MANDATE OF HIGH COUNCIL ]
          </p>
        </div>
      </div>
    </section>
  );
};
