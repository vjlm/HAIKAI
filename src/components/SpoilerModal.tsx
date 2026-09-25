import React, { useState } from 'react';
import { Modal } from './Modal';
import { ShieldAlert, Unlock, AlertTriangle } from 'lucide-react';

interface SpoilerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpoilerModal: React.FC<SpoilerModalProps> = ({ isOpen, onClose }) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="RESTRICTED ARCHIVE // CLEARANCE 07">
      <div className="space-y-6 text-[#9ba6b5] text-sm">
        {!confirmed ? (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-4 rounded-full bg-[#1b080b] border border-[#9e2a2b] text-[#9e2a2b]">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="font-cinzel text-xl text-[#edf1f5] uppercase tracking-wide">
              MANDATORY CLEARANCE WARNING
            </h3>

            <p className="max-w-md mx-auto text-xs sm:text-sm text-[#8792a0] leading-relaxed">
              This dossier contains major narrative revelations regarding Arc 07–10, the true origin of the Sea of Ash, and the identities of the quarantine constructors.
            </p>

            <button
              onClick={() => setConfirmed(true)}
              type="button"
              className="px-6 py-2.5 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-widest uppercase font-semibold border border-[#9e2a2b] transition-all"
            >
              [ I ACCEPT SPOILERS · UNSEAL ARCHIVE ]
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-4 border border-[#9e2a2b] bg-[#140608] text-xs font-editorial-mono space-y-2">
              <span className="text-[#9e2a2b] font-bold block uppercase tracking-widest">
                [!] TOP SECRET // CLASSIFICATION OMEGA:
              </span>
              <p className="text-[#f2afb2] leading-relaxed">
                The Sea of Ash is not natural seawater. It is a biological coolant bath keeping eighty million cryo-preserved citizens in suspended stasis beneath the tectonic seabed.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-cinzel text-base text-[#e6ebf1] uppercase">
                THE IDENTITY OF REN VESSEL
              </h4>
              <p className="text-xs text-[#8792a0] leading-relaxed">
                Ren is the sole remaining technician from the orbital station that oversaw the First Flood. His mission was to open the drainage valves in year 3000—or terminate the simulation if humanity repeated the weapons crisis.
              </p>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-full mt-4 py-2 border border-[#2b3544] bg-[#090d14] text-xs font-editorial-mono uppercase tracking-wider text-[#a0abb8] hover:text-white"
            >
              [ CLOSE DOSSIER ]
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
