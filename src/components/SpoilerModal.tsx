import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SpoilerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpoilerModal: React.FC<SpoilerModalProps> = ({ isOpen, onClose }) => {
  const [acceptedWarning, setAcceptedWarning] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#040507]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full border border-[#3b171a] bg-[#090607] p-8 sm:p-12 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7f8b9b] hover:text-white border border-[#252f3f] bg-[#0c1017] transition-colors"
          aria-label="Close Spoiler Warning"
        >
          <X className="w-5 h-5" />
        </button>

        {!acceptedWarning ? (
          <div>
            {/* Warning Header */}
            <div className="flex items-center gap-3 text-xs font-editorial-mono tracking-[0.3em] text-[#9e2a2b] uppercase mb-4 font-bold">
              <ShieldAlert className="w-5 h-5" />
              <span>CLASSIFIED DEEP LORE // LEVEL 04 CLEARANCE</span>
            </div>

            <h3 className="font-cinzel text-2xl sm:text-3xl text-[#f2cecf] uppercase tracking-wide mb-6">
              SPOILER WARNING: ARCHIVE 07
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-[#bca3a5] leading-relaxed mb-8">
              <p>
                The following dossier contains revelations regarding the true architecture of the Sea of Ash, the First People, the artificial planetary containment boundary, and the outside world.
              </p>
              <div className="p-4 border border-[#521b1f] bg-[#14080a] text-[#e0989b] flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#9e2a2b]" />
                <span>
                  Proceeding will unveil major narrative revelations intended for the climax of the story. Readers seeking an unadulterated exploration of the mystery are advised to exit.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setAcceptedWarning(true)}
                type="button"
                className="w-full sm:w-auto px-6 py-3 text-xs font-cinzel tracking-[0.2em] uppercase text-white bg-[#9e2a2b] hover:bg-[#b53234] transition-colors"
              >
                [ I ACCEPT // UNSEAL DEEP ARCHIVE ]
              </button>
              <button
                onClick={onClose}
                type="button"
                className="w-full sm:w-auto px-6 py-3 text-xs font-cinzel tracking-[0.2em] uppercase text-[#8c97a5] hover:text-white border border-[#242e3d] bg-[#0b0f16] transition-colors"
              >
                [ RETURN TO SHORE ]
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#3b171a]">
              <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-widest uppercase font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                DECLASSIFIED SUMMARY // DOSSIER #007
              </span>
              <span className="text-[10px] font-editorial-mono text-[#786466]">
                AUTH: HIGH CORDON EXECUTOR
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#dfc3c5] leading-relaxed font-light">
              <div className="p-4 border-l-2 border-[#9e2a2b] bg-[#14080a]">
                <h4 className="font-cinzel text-xs text-[#f2afb2] uppercase tracking-wider font-bold mb-1">
                  01. THE NATURE OF THE SEA
                </h4>
                <p>
                  The Sea of Ash is not planetary water. It is a biological suspension field created 3,000 years ago by an advanced terrestrial civilization to seal and digest a catastrophic mutagenic outbreak.
                </p>
              </div>

              <div className="p-4 border-l-2 border-[#9e2a2b] bg-[#14080a]">
                <h4 className="font-cinzel text-xs text-[#f2afb2] uppercase tracking-wider font-bold mb-1">
                  02. THE ARTIFICIAL BASIN
                </h4>
                <p>
                  The known world (The Crownlands, the Hollow Forest, the Glass Desert) exists inside an artificial depression surrounded by a 14,000-meter carbon boundary wall.
                </p>
              </div>

              <div className="p-4 border-l-2 border-[#9e2a2b] bg-[#14080a]">
                <h4 className="font-cinzel text-xs text-[#f2afb2] uppercase tracking-wider font-bold mb-1">
                  03. THE OUTSIDE WORLD
                </h4>
                <p>
                  Beyond the perimeter lies a vast, functioning world under a blue sky that considers the inhabitants of the Sea of Ash dead or irrevocably contaminated. The Crownlands Monarchy was instituted solely to prevent anyone from attempting to breach the boundary.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#3b171a] flex justify-end">
              <button
                onClick={onClose}
                type="button"
                className="px-6 py-2 text-xs font-cinzel tracking-[0.2em] uppercase text-white border border-[#9e2a2b] bg-[#9e2a2b]/20 hover:bg-[#9e2a2b]/40 transition-colors"
              >
                [ CLOSE CLASSIFIED FILE ]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
