import React from 'react';
import { FileX, ShieldOff, AlertOctagon } from 'lucide-react';

export const WarRecords: React.FC = () => {
  return (
    <section id="war-records" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#121822]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
          DECLASSIFIED ARCHIVES // CENSORSHIP AUDIT
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl text-[#edf1f5] uppercase tracking-wider">
          THE WAR RECORDS // FORTRESS ZERO
        </h2>
        <p className="font-serif-cinematic italic text-base text-[#8c97a5]">
          «“The history of our glorious defense was rewritten three times. The blood, however, dried only once.”»
        </p>
      </div>

      <div className="border border-[#261518] bg-[#0c0608] p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 text-xs font-editorial-mono text-[#9e2a2b] uppercase tracking-widest font-bold">
          <FileX className="w-4 h-4" />
          <span>IMPERIAL ARCHIVE // DISPATCH 412 (RECONSTRUCTED)</span>
        </div>

        <div className="font-editorial-mono text-xs sm:text-sm text-[#b5a2a6] leading-relaxed space-y-4 border-l-2 border-[#9e2a2b] pl-4 sm:pl-6">
          <p>
            «“To: High Command, Iron Bastion 01.<br />
            Subject: Incident Report regarding Third Cordon Regiment 09 under Captain Cael Arden.<br />
            Date: Cordon Year 2991, 14th of Ash.”»
          </p>
          <p>
            «“The enemy was not advancing from the sea. Repeat: the vessels approaching Fortress Zero were our own civilian refugees from the Southern Shoreline attempting to construct rafts and leave the basin.”»
          </p>
          <p className="bg-[#1a070a] p-3 text-[#f2afb2] border border-[#3b1216]">
            [REDACTED BY ORDER OF HIGH INQUISITOR VOSS]: All seventy-four transports were scuttled under imperial naval fire. Cael Arden refused the execution order and surrendered his command insignia.
          </p>
        </div>

        <div className="pt-4 border-t border-[#230f13] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-editorial-mono text-[#7d6569] gap-2">
          <span>AUTHENTICITY STATUS: VERIFIED VIA EYEWITNESS DEPOSITION</span>
          <span className="text-[#9e2a2b]">[CENSORED IN ALL PUBLIC TEXTBOOKS]</span>
        </div>
      </div>
    </section>
  );
};
