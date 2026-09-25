import React, { useState } from 'react';
import { Region } from '../types/haikai';
import { REGIONS } from '../data/haikaiData';
import { MapPin, Shield, Radio, AlertTriangle } from 'lucide-react';

interface WorldSectionProps {
  regions?: Region[];
}

export const WorldSection: React.FC<WorldSectionProps> = ({ regions: propRegions }) => {
  const regions = (propRegions && propRegions.length > 0) ? propRegions : REGIONS;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = regions[selectedIdx] || regions[0];

  return (
    <section id="world" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#121822]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase block font-semibold">
          GEOGRAPHIC CARTOGRAPHY // FIVE PROVINCES
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl text-[#edf1f5] uppercase tracking-wider">
          THE FIVE REGIONS
        </h2>
        <p className="font-serif-cinematic italic text-base text-[#8c97a5]">
          «“Beyond the five frontiers lies no terra firma. Only the water that remembers our demise.”»
        </p>
      </div>

      {/* Region selector tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
        {regions.map((reg, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <button
              key={reg.id}
              onClick={() => setSelectedIdx(idx)}
              type="button"
              className={`p-3 text-left border transition-all ${
                isSelected
                  ? 'border-[#9e2a2b] bg-[#1a080a] text-white shadow-[0_0_12px_rgba(158,42,43,0.3)]'
                  : 'border-[#1b2533] bg-[#070b10] text-[#788597] hover:border-[#2e3e52] hover:text-[#c0c9d6]'
              }`}
            >
              <span className="text-[10px] font-editorial-mono tracking-widest block text-[#9e2a2b]">
                {reg.number}
              </span>
              <span className="font-cinzel text-xs uppercase tracking-wider block font-semibold truncate">
                {reg.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Region Detailed Dossier */}
      {active && (
        <div className="border border-[#1f2837] bg-[#070b10] p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#161d28] gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-widest uppercase font-bold">
                  {active.number} // {active.japanese}
                </span>
                <span className="text-xs font-editorial-mono text-[#586575]">
                  {active.depthRecord}
                </span>
              </div>
              <h3 className="font-cinzel text-2xl sm:text-3xl text-[#edf1f5] uppercase tracking-wide mt-1">
                {active.name}
              </h3>
            </div>
            <p className="font-serif-cinematic italic text-sm text-[#9e2a2b] max-w-md">
              {active.quote}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-editorial-mono tracking-widest text-[#687687] uppercase block">
                ADMINISTRATION & SOURCE
              </span>
              <p className="text-sm font-cinzel text-[#d4dae2] uppercase">
                {active.government}
              </p>
              <p className="text-xs font-editorial-mono text-[#8a96a5]">
                Power: {active.powerSource}
              </p>
              <p className="text-xs font-editorial-mono text-[#8a96a5]">
                Doctrine: {active.ideology}
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <span className="text-[11px] font-editorial-mono tracking-widest text-[#687687] uppercase block">
                TERRAIN & CARTOGRAPHIC SUMMARY
              </span>
              <p className="text-sm text-[#9aa4b2] leading-relaxed font-light">
                {active.description}
              </p>
              <p className="text-xs text-[#707c8c] italic font-serif-cinematic pt-2">
                Visual notes: {active.visualSummary}
              </p>
            </div>
          </div>

          {/* Key Locations and Hazards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#161d28]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-editorial-mono text-[#c4ccd6]">
                <MapPin className="w-3.5 h-3.5 text-[#9e2a2b]" />
                <span className="uppercase font-bold">KEY CARTOGRAPHIC LOCALES:</span>
              </div>
              <ul className="text-xs text-[#808d9e] space-y-1 list-disc list-inside">
                {active.keyLocations?.map((loc, i) => (
                  <li key={i}>{loc}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-editorial-mono text-[#c4ccd6]">
                <AlertTriangle className="w-3.5 h-3.5 text-[#9e2a2b]" />
                <span className="uppercase font-bold">DOCUMENTED HAZARDS:</span>
              </div>
              <ul className="text-xs text-[#808d9e] space-y-1 list-disc list-inside">
                {active.hazards?.map((haz, i) => (
                  <li key={i}>{haz}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
