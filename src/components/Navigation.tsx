import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ShieldAlert } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavigationProps {
  onOpenSpoilerModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenSpoilerModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const playing = soundManager.toggle();
    setIsMuted(!playing);
  };

  const navLinks = [
    { label: 'WORLD', href: '#world' },
    { label: 'CHARACTERS', href: '#characters' },
    { label: 'STORY', href: '#story' },
    { label: 'OATH', href: '#oath' },
    { label: 'MYSTERIES', href: '#mysteries' },
    { label: 'GALLERY', href: '#gallery' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050608]/90 backdrop-blur-md border-b border-[#1b212c]/70 py-3 shadow-2xl'
            : 'bg-transparent py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="flex items-center gap-2 group transition-opacity hover:opacity-80"
            aria-label="HAIKAI — Home"
          >
            <span className="font-jp text-lg tracking-widest text-[#e8ebed] font-medium">灰海</span>
            <span className="h-3 w-[1px] bg-[#333d4b]" />
            <span className="font-cinzel text-base tracking-[0.28em] text-[#d4d9de] font-semibold">
              HAIKAI
            </span>
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-[0.2em] font-medium text-[#8f98a3] hover:text-[#e8ebed] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[#9e2a2b] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSound}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-wider text-[#9aa3ae] hover:text-[#e8ebed] border border-[#202732] hover:border-[#384355] bg-[#0c1015]/60 rounded transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9e2a2b]"
              aria-label={isMuted ? 'Turn ambient ocean sound on' : 'Mute ambient sound'}
              title={isMuted ? 'Enable ambient soundscape' : 'Mute soundscape'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#9e2a2b]" />}
              <span className="hidden sm:inline font-mono text-[11px]">
                {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
              </span>
            </button>

            <button
              onClick={onOpenSpoilerModal}
              type="button"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#d8dadf] hover:text-white border border-[#2b3442] hover:border-[#9e2a2b]/80 bg-[#0e1219]/80 hover:bg-[#151c27] rounded transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9e2a2b]"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#9e2a2b]" />
              <span className="font-editorial-mono text-[11px]">ARCHIVE // 07</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden p-2 text-[#9aa3ae] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9e2a2b]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Cinematic Fullscreen Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050608]/98 backdrop-blur-xl flex flex-col justify-center px-8 lg:hidden animate-in fade-in duration-200">
          <div className="mb-10 text-center">
            <span className="font-jp text-3xl tracking-widest text-[#e8ebed] block mb-2">灰海</span>
            <span className="font-cinzel text-xl tracking-[0.3em] text-[#9aa3ae] block">
              THE SEA OF ASH
            </span>
          </div>

          <nav className="flex flex-col items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base tracking-[0.25em] font-medium text-[#c0c5cc] hover:text-[#9e2a2b] transition-colors py-2 uppercase"
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSpoilerModal();
              }}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest text-white border border-[#9e2a2b] bg-[#9e2a2b]/20 rounded"
            >
              <ShieldAlert className="w-4 h-4 text-[#9e2a2b]" />
              <span>CLASSIFIED ARCHIVE // 07</span>
            </button>
          </nav>

          <p className="text-center font-serif-cinematic italic text-sm text-[#5c6470] mt-12">
            «“Was this world ever meant to be saved?”»
          </p>
        </div>
      )}
    </>
  );
};
