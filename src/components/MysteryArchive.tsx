import React, { useState } from 'react';
import { MYSTERY_FILES } from '../data/haikaiData';
import { MysteryFile } from '../types/haikai';
import { FileText, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const MysteryArchive: React.FC = () => {
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});

  const toggleExpand = (fileId: string) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));
  };

  return (
    <section id="mysteries" className="relative w-full bg-[#050608] py-28 md:py-36 px-6 md:px-12 border-t border-[#141b24] overflow-hidden">
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>UNRESOLVED ANOMALIES</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">FORBIDDEN DOSSIER</span>
          </div>

          <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl tracking-[0.35em] text-[#e4e8ec] uppercase font-light mb-3">
            THE ARCHIVE
          </h2>
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.5em] text-[#8793a4] uppercase mb-4">
            SOME RECORDS SHOULD HAVE BEEN LOST.
          </p>
          <p className="font-jp text-base tracking-[0.4em] text-[#717b88]">
            封印記録簿
          </p>
          <div className="w-16 h-[1px] bg-[#9e2a2b] mt-6" />
        </div>

        {/* Classified Mystery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MYSTERY_FILES.map((file: MysteryFile) => {
            const isExpanded = expandedFiles[file.id];
            return (
              <div
                key={file.id}
                className="border border-[#1f2836] bg-[#070a0f] p-8 transition-all hover:border-[#2f3d52] flex flex-col justify-between shadow-xl relative"
              >
                {/* Header Information */}
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#18212d] mb-6">
                    <span className="font-editorial-mono text-xs text-[#9e2a2b] font-bold tracking-widest uppercase">
                      {file.fileNumber}
                    </span>
                    <span className="text-[10px] font-editorial-mono text-[#616e7e] px-2.5 py-0.5 border border-[#1e2734] bg-[#0c1017]">
                      {file.classification}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="font-cinzel text-2xl text-[#edf0f4] uppercase tracking-wide">
                      {file.title}
                    </h3>
                    <span className="font-jp text-sm text-[#5d6878]">
                      {file.japanese}
                    </span>
                  </div>

                  <p className="text-sm text-[#9da8b7] leading-relaxed font-light mb-6">
                    {file.description}
                  </p>

                  {/* Dialogue snippet if exists */}
                  {file.dialogue && (
                    <div className="p-4 border-l-2 border-[#9e2a2b] bg-[#0c1119] mb-6 space-y-2">
                      {file.dialogue.map((d, i) => (
                        <p key={i} className="font-serif-cinematic text-sm sm:text-base text-[#dce1e6] italic">
                          <span className="font-editorial-mono not-italic text-[10px] text-[#697788] block">
                            {d.speaker}:
                          </span>
                          {d.text}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Inconsistencies detected */}
                  <div className="mb-6">
                    <span className="flex items-center gap-2 text-[11px] font-cinzel tracking-[0.2em] text-[#e0989b] uppercase mb-2">
                      <AlertCircle className="w-3.5 h-3.5 text-[#9e2a2b]" />
                      INCONSISTENCIES DETECTED
                    </span>
                    <ul className="space-y-2 text-xs text-[#8c97a5]">
                      {file.inconsistencies.map((inc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#9e2a2b] mt-0.5">·</span>
                          <span className="leading-relaxed">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Redacted Lore Accordion */}
                <div className="pt-6 border-t border-[#18212d]">
                  <button
                    onClick={() => toggleExpand(file.id)}
                    type="button"
                    className="w-full flex items-center justify-between text-xs font-editorial-mono text-[#8b96a4] hover:text-[#edf0f3] transition-colors py-1"
                  >
                    <span className="flex items-center gap-2 tracking-wider">
                      <FileText className="w-3.5 h-3.5 text-[#9e2a2b]" />
                      {isExpanded ? 'CONCEAL DECLASSIFIED FOOTNOTE' : 'READ DECLASSIFIED FOOTNOTE'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-4 p-4 border border-[#30161a] bg-[#12080a] animate-in fade-in duration-300">
                      <p className="text-xs sm:text-sm font-serif-cinematic text-[#e8b5b7] italic leading-relaxed">
                        «{file.redactedLore}»
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
