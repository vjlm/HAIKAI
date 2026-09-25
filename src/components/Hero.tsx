import React from 'react';
import { SiteSettings } from '../types/haikai';
import { DEFAULT_SETTINGS } from '../data/haikaiData';
import { ChevronDown, Compass, ShieldAlert } from 'lucide-react';

interface HeroProps {
  settings?: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings: propSettings }) => {
  const settings = propSettings || DEFAULT_SETTINGS;

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 pb-16 overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#18090b] via-[#080a0e] to-[#040507] opacity-80" />
      
      {/* Subtle ash grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141c2808_1px,transparent_1px),linear-gradient(to_bottom,#141c2808_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6">
        {/* Notice badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#9e2a2b]/40 bg-[#16080a]/60 text-[#f2afb2] text-[11px] font-editorial-mono tracking-widest uppercase">
          <ShieldAlert className="w-3.5 h-3.5 text-[#9e2a2b]" />
          <span>{settings.heroNotice || 'PRE-FLOOD RECKONING'}</span>
        </div>

        {/* Japanese Title */}
        <span className="font-jp text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#f0f4f8] font-light tracking-[0.25em] select-none opacity-90">
          {settings.japaneseTitle || '灰海'}
        </span>

        {/* English Title */}
        <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#edf1f5] uppercase tracking-[0.3em] font-medium leading-tight">
          {settings.siteTitle || 'HAIKAI — The Sea of Ash'}
        </h1>

        {/* Tagline quote */}
        <p className="font-serif-cinematic italic text-base sm:text-xl md:text-2xl text-[#9aa4b2] max-w-2xl leading-relaxed">
          {settings.tagline || '“Was this world ever meant to be saved?”'}
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
          <a
            href="#manga"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#9e2a2b] hover:bg-[#b53235] text-white font-cinzel text-xs uppercase tracking-[0.25em] font-semibold border border-[#9e2a2b] shadow-[0_0_25px_rgba(158,42,43,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <span>{settings.ctaPrimaryLabel || '[ ENTER THE WORLD → ]'}</span>
          </a>

          <a
            href="#characters"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#0b0f15]/80 hover:bg-[#131b26] text-[#c4ccd6] hover:text-white font-cinzel text-xs uppercase tracking-[0.25em] border border-[#222c3a] hover:border-[#3b495c] transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#9e2a2b]" />
            <span>{settings.ctaSecondaryLabel || '[ MEET THE CHARACTERS ]'}</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1.5 text-[#5e6978] animate-bounce pointer-events-none">
        <span className="text-[10px] font-editorial-mono tracking-widest uppercase">SCROLL</span>
        <ChevronDown className="w-4 h-4 text-[#9e2a2b]" />
      </div>
    </section>
  );
};
