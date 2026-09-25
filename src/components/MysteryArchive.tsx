import React, { useState } from 'react';
import { MysteryFile } from '../types/haikai';
import { MYSTERY_FILES } from '../data/haikaiData';
import { Lock, Unlock, AlertTriangle, FileText } from 'lucide-react';

interface MysteryArchiveProps {
  mysteries?: MysteryFile[];
}

export const MysteryArchive: React.FC<MysteryArchiveProps> = ({ mysteries: propMysteries }) => {
  const files = (propMysteries && propMysteries.length > 0) ? propMysteries : MYSTERY_FILES;
  const [unlockedFiles, setUnlockedFiles] = useState<Record<string, boolean>>({});

  const toggleUnlock = (id: string) => {
    setUnlockedFiles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="mysteries" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#121822]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
          TOP SECRET // INQUISITORIAL DOSSIERS
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl text-[#edf1f5] uppercase tracking-wider">
          THE MYSTERY ARCHIVE
        </h2>
        <p className="font-serif-cinematic italic text-base text-[#8c97a5]">
          «“Some documents were not meant for citizens. Read at the peril of your own sanity.”»
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {files.map((file) => {
          const isUnlocked = unlockedFiles[file.id] || false;
          return (
            <div
              key={file.id}
              className="border border-[#1f2837] bg-[#070b10] p-6 sm:p-7 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-editorial-mono">
                  <span className="text-[#9e2a2b] font-bold">{file.fileNumber}</span>
                  <span className="text-[#596677] uppercase text-[10px]">{file.classification}</span>
                </div>

                <h3 className="font-cinzel text-lg sm:text-xl text-[#edf1f5] uppercase tracking-wide">
                  {file.title} <span className="text-sm text-[#616e7e]">({file.japanese})</span>
                </h3>

                <p className="text-sm text-[#8c98a7] leading-relaxed font-light">
                  {file.description}
                </p>

                {file.dialogue && file.dialogue.length > 0 && (
                  <div className="p-3 border-l-2 border-[#9e2a2b] bg-[#0c0608] space-y-1.5 text-xs font-editorial-mono">
                    {file.dialogue.map((d, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-[#9e2a2b] font-bold shrink-0">{d.speaker}:</span>
                        <span className="text-[#d8dde3]">{d.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inconsistencies */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-editorial-mono text-[#717e8f] uppercase block font-semibold">
                    DOCUMENTED ANOMALIES:
                  </span>
                  <ul className="text-xs text-[#808c9c] space-y-1 list-disc list-inside">
                    {file.inconsistencies?.map((inc, i) => (
                      <li key={i}>{inc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Redacted Lore Toggle */}
              <div className="pt-4 border-t border-[#161f2c]">
                <button
                  onClick={() => toggleUnlock(file.id)}
                  type="button"
                  className={`w-full py-2.5 px-4 text-xs font-editorial-mono uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${
                    isUnlocked
                      ? 'border-[#9e2a2b] bg-[#1a080a] text-[#f2afb2]'
                      : 'border-[#222d3d] bg-[#05070a] text-[#818f9f] hover:text-[#d3dbe5]'
                  }`}
                >
                  {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-[#9e2a2b]" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isUnlocked ? '[ HIDE REDACTED LORE ]' : '[ DECRYPT REDACTED LORE ]'}</span>
                </button>

                {isUnlocked && (
                  <div className="mt-3 p-3.5 border border-[#4a181c] bg-[#140608] text-[#f2afb2] text-xs font-editorial-mono leading-relaxed animate-in fade-in duration-300">
                    <span className="text-[#9e2a2b] font-bold block uppercase tracking-widest mb-1">
                      [!] UNSEALED CLEARANCE LEVEL 07:
                    </span>
                    {file.redactedLore}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
