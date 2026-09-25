import React, { useState } from 'react';
import { REGIONS } from '../data/haikaiData';
import { Region } from '../types/haikai';

export const WorldSection: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(REGIONS[0]);

  return (
    <section id="world" className="relative w-full bg-[#050608] py-28 md:py-36 px-6 md:px-12 border-t border-[#141b24] overflow-hidden">
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>IMPERIAL CARTOGRAPHIC REGISTRY</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">TERRITORIES</span>
          </div>

          <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl tracking-[0.3em] text-[#e4e8ec] uppercase font-light mb-3">
            THE WORLD
          </h2>
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.5em] text-[#8692a0] uppercase">
            FIVE REGIONS. ONE SEA.
          </p>
          <div className="w-16 h-[1px] bg-[#9e2a2b] mt-6" />
        </div>

        {/* Region Selector Ribbon */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto pb-4 mb-12 gap-2 scrollbar-none">
          {REGIONS.map((region) => {
            const isSelected = selectedRegion.id === region.id;
            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                type="button"
                className={`px-4 sm:px-6 py-3 text-xs font-cinzel tracking-[0.2em] uppercase whitespace-nowrap transition-all border flex items-center gap-2.5 ${
                  isSelected
                    ? 'border-[#9e2a2b] bg-[#10151f] text-white shadow-lg'
                    : 'border-[#1b222d] bg-[#080b0f] text-[#717b88] hover:text-[#b8c0c8] hover:border-[#2d3747]'
                }`}
              >
                <span className="font-editorial-mono text-[10px] text-[#9e2a2b]">
                  {region.number.replace('REGION ', '')}
                </span>
                <span>{region.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Region Showcase Card */}
        <div className="border border-[#1f2836] bg-[#070a0f] p-8 md:p-14 transition-all duration-500 shadow-2xl relative">
          {/* Subtle backdrop aesthetic visual based on region */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Visual Artwork Canvas & Identity */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              {/* Region Label Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#18212d] mb-6">
                <span className="font-editorial-mono text-xs tracking-[0.35em] text-[#9e2a2b] uppercase font-bold">
                  {selectedRegion.number}
                </span>
                <span className="font-jp text-base tracking-widest text-[#7c8898]">
                  {selectedRegion.japanese}
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-cinzel text-3xl sm:text-4xl text-[#edf0f2] tracking-wider mb-4 font-normal">
                {selectedRegion.name}
              </h3>
              <p className="text-sm sm:text-base text-[#9faab8] leading-relaxed mb-8 font-light">
                {selectedRegion.tagline}
              </p>

              {/* Styled Visual Frame / Concept Art Mockup */}
              <div className="relative aspect-video w-full border border-[#202936] bg-[#0c1017] overflow-hidden mb-6 flex flex-col justify-end p-6">
                {/* Visual art textures */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040609] via-transparent to-transparent z-10" />

                {/* Region-specific stylistic ambient art */}
                {selectedRegion.id === 'crownlands' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_rgba(180,83,9,0.15)_0%,_transparent_60%)]" />
                    <div className="absolute bottom-6 left-6 right-6 border-b border-[#3b4759] flex items-end justify-between text-xs text-[#526072] font-editorial-mono pb-2">
                      <span>BASTION 01 // HIGH CORDON RAMPARTS</span>
                      <span>+180m ELEVATION</span>
                    </div>
                  </div>
                )}
                {selectedRegion.id === 'hollow-forest' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)]" />
                    <div className="absolute bottom-6 left-6 right-6 border-b border-[#1e3a2d] flex items-end justify-between text-xs text-[#3d5e4b] font-editorial-mono pb-2">
                      <span>THE NAME BOUGH // PALE MIST HORIZON</span>
                      <span>-45m FORESTRY BASIN</span>
                    </div>
                  </div>
                )}
                {selectedRegion.id === 'glass-desert' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(96,165,250,0.12)_0%,_transparent_60%)]" />
                    <div className="absolute bottom-6 left-6 right-6 border-b border-[#213247] flex items-end justify-between text-xs text-[#405875] font-editorial-mono pb-2">
                      <span>VITRIFIED OBSIDIAN PLAINS</span>
                      <span>STELLAR REFLECTION AXIS</span>
                    </div>
                  </div>
                )}
                {selectedRegion.id === 'drowned-kingdom' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.12)_0%,_transparent_70%)]" />
                    <div className="absolute bottom-6 left-6 right-6 border-b border-[#163c48] flex items-end justify-between text-xs text-[#2c687a] font-editorial-mono pb-2">
                      <span>THE CYCLOPEAN SHELF // NERAI VAULTS</span>
                      <span>-1,400m ABYSS</span>
                    </div>
                  </div>
                )}
                {selectedRegion.id === 'the-end' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(158,42,43,0.15)_0%,_transparent_80%)]" />
                    <div className="absolute bottom-6 left-6 right-6 border-b border-[#3d1a1b] flex items-end justify-between text-xs text-[#6e3739] font-editorial-mono pb-2">
                      <span>PERIMETER ZERO // MONOLITH HORIZON</span>
                      <span>NULL COORDINATES</span>
                    </div>
                  </div>
                )}

                <div className="relative z-20">
                  <p className="text-xs text-[#b8c2cc] font-light italic max-w-sm">
                    {selectedRegion.visualSummary}
                  </p>
                </div>
              </div>

              {/* Philosophical Quote */}
              <div className="p-4 border-l-2 border-[#9e2a2b] bg-[#0c1017]/60">
                <blockquote className="font-serif-cinematic text-lg sm:text-xl text-[#d4dae0] italic">
                  {selectedRegion.quote}
                </blockquote>
              </div>
            </div>

            {/* Right Column: Classified Imperial Metadata & Survey Dossier */}
            <div className="lg:col-span-6 space-y-8">
              {/* Metadata Triad */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-[#19212d]">
                <div>
                  <span className="text-[10px] font-editorial-mono tracking-widest uppercase text-[#546070] block mb-1">
                    GOVERNMENT
                  </span>
                  <span className="text-xs font-cinzel text-[#d5dbe2] tracking-wider uppercase font-semibold">
                    {selectedRegion.government}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-editorial-mono tracking-widest uppercase text-[#546070] block mb-1">
                    POWER SOURCE
                  </span>
                  <span className="text-xs font-cinzel text-[#d5dbe2] tracking-wider uppercase font-semibold">
                    {selectedRegion.powerSource}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-editorial-mono tracking-widest uppercase text-[#546070] block mb-1">
                    IDEOLOGY
                  </span>
                  <span className="text-xs font-cinzel text-[#9e2a2b] tracking-wider uppercase font-semibold">
                    {selectedRegion.ideology}
                  </span>
                </div>
              </div>

              {/* Archival Description */}
              <div>
                <h4 className="text-xs font-cinzel tracking-[0.25em] text-[#7d8b9d] uppercase mb-3">
                  SURVEY NARRATIVE
                </h4>
                <p className="text-sm text-[#9da8b6] leading-relaxed font-light">
                  {selectedRegion.description}
                </p>
              </div>

              {/* Bathymetric Depth Gauge */}
              <div className="p-4 border border-[#19222e] bg-[#0a0e14]">
                <span className="text-[10px] font-editorial-mono tracking-widest uppercase text-[#616e7e] block mb-1">
                  ELEVATION / HYDROSTATIC RECORD
                </span>
                <span className="font-editorial-mono text-xs text-[#bac4ce] font-medium">
                  {selectedRegion.depthRecord}
                </span>
              </div>

              {/* Identified Hazards & Key Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <h5 className="text-[11px] font-cinzel tracking-[0.2em] text-[#717e8f] uppercase mb-2">
                    SURFACE HAZARDS
                  </h5>
                  <ul className="space-y-1.5 text-xs text-[#8f9aa6]">
                    {selectedRegion.hazards.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-[#9e2a2b]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-[11px] font-cinzel tracking-[0.2em] text-[#717e8f] uppercase mb-2">
                    RECOGNIZED SECTORS
                  </h5>
                  <ul className="space-y-1.5 text-xs text-[#8f9aa6]">
                    {selectedRegion.keyLocations.map((loc) => (
                      <li key={loc} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-[#3b4759]" />
                        <span>{loc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
