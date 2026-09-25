import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Menu, X, ShieldAlert, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { HaikaiLogo } from './HaikaiLogo';
import { VisibleSections } from '../types/haikai';

interface NavigationProps {
  onOpenSpoilerModal: () => void;
  visibleSections?: VisibleSections;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenSpoilerModal,
  visibleSections,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundManager.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollPosRef = useRef<number>(0);

  // Subscribe to real-time audio state changes
  useEffect(() => {
    const unsubscribe = soundManager.subscribe((muted) => {
      setIsMuted(muted);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open, restore on close
  useEffect(() => {
    if (mobileMenuOpen) {
      scrollPosRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollPosRef.current) {
        window.scrollTo(0, scrollPosRef.current);
      }
    }
  }, [mobileMenuOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSound = () => {
    const playing = soundManager.toggle();
    setIsMuted(!playing);
  };

  const allNavLinks = [
    { label: 'WORLD', href: '#world', visible: visibleSections?.world !== false },
    { label: 'CHARACTERS', href: '#characters', visible: visibleSections?.characters !== false },
    { label: 'STORY', href: '#story', visible: visibleSections?.storyArcs !== false },
    { label: 'OATH', href: '#oath', visible: visibleSections?.oathSystem !== false },
    { label: 'MYSTERIES', href: '#mysteries', visible: visibleSections?.mysteries !== false },
    { label: 'TRAILERS', href: '#trailers', visible: visibleSections?.trailers !== false },
    { label: 'GALLERY', href: '#gallery', visible: visibleSections?.gallery !== false },
    { label: 'MANGA', href: '#manga', visible: visibleSections?.manga !== false },
    { label: 'ABOUT', href: '#about', visible: visibleSections?.introduction !== false },
  ];

  const navLinks = allNavLinks.filter((l) => l.visible);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
          isScrolled
            ? 'bg-[#050608]/92 backdrop-blur-md border-b border-[#1b212c]/70 py-3 shadow-2xl'
            : 'bg-transparent py-4 sm:py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
          {/* Zone 1: Brand wordmark: Japanese Kanji + Cinematic English Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 sm:gap-3 group transition-opacity hover:opacity-90 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9e2a2b]"
            aria-label="HAIKAI — Home"
          >
            <span className="font-jp text-lg sm:text-xl tracking-widest text-[#e8ebed] font-medium shrink-0">
              灰海
            </span>
            <span className="h-4 w-[1px] bg-[#333d4b] shrink-0" />
            <HaikaiLogo className="h-5 sm:h-6 w-24 sm:w-28 md:w-32 transition-transform duration-300 group-hover:scale-105 shrink-0" />
          </a>

          {/* Zone 2: 4-8 clean text navigation links */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-[0.2em] font-medium text-[#8f98a3] hover:text-[#e8ebed] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[#9e2a2b] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <a
              href="#manga"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider text-[#f2afb2] border border-[#9e2a2b]/60 hover:border-[#9e2a2b] bg-[#16080a]/60 hover:bg-[#1f090c] hover:shadow-[0_0_15px_rgba(158,42,43,0.35)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#9e2a2b] transition-transform duration-300 group-hover:scale-110" />
              <span className="font-editorial-mono text-[11px]">VOL. 01</span>
            </a>

            <button
              onClick={toggleSound}
              type="button"
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 min-h-[38px] text-xs uppercase tracking-wider border rounded transition-all whitespace-nowrap hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9e2a2b] ${
                !isMuted
                  ? 'text-[#f6c2c4] border-[#9e2a2b]/80 bg-[#220a0d]/80 hover:bg-[#2e0e12] shadow-[0_0_14px_rgba(158,42,43,0.4)]'
                  : 'text-[#8c97a5] hover:text-[#e8ebed] border-[#202732] hover:border-[#384355] bg-[#0c1015]/60 hover:shadow-sm'
              }`}
              aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
              title={isMuted ? 'Unmute soundtrack (Continuous Loop)' : 'Mute soundtrack'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-[#7c8796] transition-transform group-hover:scale-110" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#e63946] animate-pulse" />
              )}
              <span className="hidden sm:inline font-editorial-mono text-[11px] tracking-wider">
                {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
              </span>
            </button>

            <button
              onClick={onOpenSpoilerModal}
              type="button"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] text-xs uppercase tracking-widest text-[#d8dadf] hover:text-white border border-[#2b3442] hover:border-[#9e2a2b]/80 bg-[#0e1219]/80 hover:bg-[#151c27] hover:shadow-[0_0_15px_rgba(158,42,43,0.3)] hover:scale-105 active:scale-95 rounded transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9e2a2b]"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#9e2a2b] transition-transform group-hover:rotate-12" />
              <span className="font-editorial-mono text-[11px]">ARCHIVE // 07</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              className="xl:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#9aa3ae] hover:text-white hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9e2a2b]"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Cinematic Fullscreen Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMobileMenuOpen(false);
            }
          }}
          className="fixed inset-0 z-50 bg-[#050608]/96 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-200 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-[#1b232e] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="font-jp text-xl tracking-widest text-[#e8ebed]">灰海</span>
              <span className="h-4 w-[1px] bg-[#333d4b]" />
              <HaikaiLogo className="h-5 w-24" />
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              type="button"
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#9aa3ae] hover:text-white border border-[#202936]"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links List */}
          <nav className="flex flex-col items-center justify-center gap-4 my-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base sm:text-lg tracking-[0.25em] font-cinzel text-[#c0c5cc] hover:text-[#9e2a2b] transition-colors py-2 uppercase min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSpoilerModal();
              }}
              className="mt-4 flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest text-white border border-[#9e2a2b] bg-[#9e2a2b]/20 hover:bg-[#9e2a2b]/30 min-h-[44px]"
            >
              <ShieldAlert className="w-4 h-4 text-[#9e2a2b]" />
              <span>CLASSIFIED ARCHIVE // 07</span>
            </button>

            {/* Mobile Sound Control */}
            <button
              onClick={toggleSound}
              type="button"
              className={`mt-2 flex items-center justify-center gap-2.5 px-5 py-3 text-xs uppercase tracking-widest border transition-all min-h-[44px] w-full max-w-xs ${
                !isMuted
                  ? 'text-[#f6c2c4] border-[#9e2a2b] bg-[#220a0d] shadow-[0_0_15px_rgba(158,42,43,0.3)]'
                  : 'text-[#8b95a2] border-[#252e3d] bg-[#0c1015] hover:text-[#d0d6de]'
              }`}
              aria-label={isMuted ? 'Unmute soundtrack' : 'Mute soundtrack'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-[#7c8796]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#e63946] animate-pulse" />
              )}
              <span className="font-editorial-mono text-[11px] tracking-wider">
                {isMuted ? 'SOUND: OFF (TAP TO UNMUTE)' : 'SOUND: PLAYING IN LOOP'}
              </span>
            </button>
          </nav>

          {/* Footer quote */}
          <div className="text-center pt-4 border-t border-[#161d28]">
            <p className="font-serif-cinematic italic text-xs sm:text-sm text-[#5c6470]">
              «“Was this world ever meant to be saved?”»
            </p>
          </div>
        </div>
      )}
    </>
  );
};
