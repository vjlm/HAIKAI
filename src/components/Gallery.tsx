import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GALLERY_ITEMS } from '../data/haikaiData';
import { GalleryItem } from '../types/haikai';
import { X, Maximize2, Tag, ChevronLeft, ChevronRight, Share2, Copy, Check } from 'lucide-react';
import { useTextProtection } from '../utils/textProtection';

interface GalleryProps {
  galleryItems?: GalleryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ galleryItems: propItems }) => {
  const itemsList = propItems && propItems.length > 0 ? propItems : GALLERY_ITEMS;
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const { openMenu } = useTextProtection();

  const categories = ['ALL', 'CHARACTERS', 'LANDSCAPES', 'THE SEA', 'RUINS', 'WAR', 'CONCEPT ART'];

  const filteredItems =
    activeCategory === 'ALL'
      ? itemsList
      : itemsList.filter((item) => item.category === activeCategory);

  const activeItem = activeItemIndex !== null ? filteredItems[activeItemIndex] : null;

  // Keyboard navigation (ESC, ArrowLeft, ArrowRight)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activeItemIndex === null) return;
      if (e.key === 'Escape') {
        setActiveItemIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveItemIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
      } else if (e.key === 'ArrowLeft') {
        setActiveItemIndex((prev) =>
          prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null
        );
      }
    },
    [activeItemIndex, filteredItems.length]
  );

  // Body scroll lock during lightbox
  useEffect(() => {
    if (activeItemIndex !== null) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [activeItemIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch swipe support for mobile lightbox navigation
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diffX) > 45) {
      if (diffX < 0) {
        // Swipe left -> Next
        setActiveItemIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : 0));
      } else {
        // Swipe right -> Prev
        setActiveItemIndex((prev) =>
          prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
        );
      }
    }
    touchStartXRef.current = null;
  };

  const handleShareArtwork = async () => {
    if (!activeItem) return;
    const shareUrl = `${window.location.origin}/#gallery`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `HAIKAI Key Art: ${activeItem.title}`,
          text: `${activeItem.title} (${activeItem.japanese}) — ${activeItem.description}`,
          url: shareUrl,
        });
        return;
      } catch {
        // ignore
      }
    }

    try {
      await navigator.clipboard.writeText(
        `HAIKAI Key Art: ${activeItem.title} — ${activeItem.description}\n${shareUrl}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      openMenu(window.innerWidth / 2, window.innerHeight / 2, activeItem.description, activeItem.title);
    }
  };

  return (
    <section
      id="gallery"
      className="relative w-full bg-[#050608] py-24 sm:py-32 md:py-36 px-4 sm:px-6 md:px-12 border-t border-[#141b24] overflow-hidden"
    >
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-3 text-[11px] sm:text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>VISUAL CHRONICLE</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">KEY ART ARCHIVE</span>
          </div>

          <h2
            style={{ fontSize: 'clamp(2rem, 6vw, 3.75rem)' }}
            className="font-cinzel tracking-[0.25em] text-[#e4e8ec] uppercase font-light mb-2 leading-tight"
          >
            GALLERY
          </h2>
          <p className="font-jp text-sm sm:text-base tracking-[0.4em] text-[#717b88]">
            美術画廊
          </p>
          <div className="w-16 h-[1px] bg-[#9e2a2b] mt-5" />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto gap-2 pb-4 mb-10 sm:mb-12 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveItemIndex(null);
              }}
              type="button"
              className={`px-3.5 sm:px-4 py-2 min-h-[44px] text-xs font-cinzel tracking-[0.18em] uppercase border transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'border-[#9e2a2b] bg-[#121824] text-white shadow-md'
                  : 'border-[#1b232e] bg-[#07090d] text-[#6c7786] hover:text-[#b8c2ce] hover:border-[#2b3648]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item: GalleryItem, idx: number) => (
            <div
              key={item.id}
              onClick={() => setActiveItemIndex(idx)}
              className="group border border-[#1e2735] bg-[#080b10] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#3b4b63] hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Cinematic Art Container */}
              <div className="relative aspect-video w-full bg-[#0d121a] flex items-center justify-center overflow-hidden border-b border-[#18212e]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent z-10" />

                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                    style={
                      item.focalPoint
                        ? { objectPosition: `${item.focalPoint.x}% ${item.focalPoint.y}%` }
                        : undefined
                    }
                  />
                ) : (
                  <div className="text-center p-6 transition-transform duration-500 group-hover:scale-105 select-none">
                    <span className="font-jp text-3xl sm:text-4xl text-[#3b4759] tracking-widest block mb-2">
                      {item.japanese}
                    </span>
                    <span className="text-[10px] font-editorial-mono text-[#58677c] uppercase tracking-widest">
                      {item.category} // CINEMATIC FRAME
                    </span>
                  </div>
                )}

                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-[#05070a]/80 border border-[#2b384c] rounded">
                  <Maximize2 className="w-3.5 h-3.5 text-[#e0e5eb]" />
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-editorial-mono text-[#9e2a2b] tracking-wider uppercase">
                    {item.category}
                  </span>
                  <span className="font-jp text-xs text-[#5f6a78]">
                    {item.japanese}
                  </span>
                </div>

                <h3 className="font-cinzel text-sm sm:text-base text-[#edf1f4] uppercase tracking-wider mb-2 group-hover:text-white transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-[#8793a2] leading-relaxed line-clamp-2 font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal with Backdrop Tap to Close */}
        {activeItem !== null && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setActiveItemIndex(null);
              }
            }}
            className="fixed inset-0 z-50 bg-[#050608]/96 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative max-w-4xl w-full border border-[#273243] bg-[#070a0f] p-4 sm:p-8 md:p-10 shadow-2xl max-h-[95dvh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveItemIndex(null)}
                className="absolute top-4 right-4 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#7f8b9b] hover:text-white border border-[#252f3f] bg-[#0c1017] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9e2a2b]"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next Controls */}
              <div className="absolute top-1/2 left-3 sm:left-4 -translate-y-1/2 z-20">
                <button
                  onClick={() =>
                    setActiveItemIndex((prev) =>
                      prev !== null
                        ? (prev - 1 + filteredItems.length) % filteredItems.length
                        : 0
                    )
                  }
                  className="p-2 sm:p-3 min-h-[44px] min-w-[44px] flex items-center justify-center bg-black/80 border border-[#232f3f] text-[#8ea0b4] hover:text-white transition-colors"
                  aria-label="Previous artwork"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 z-20">
                <button
                  onClick={() =>
                    setActiveItemIndex((prev) =>
                      prev !== null ? (prev + 1) % filteredItems.length : 0
                    )
                  }
                  className="p-2 sm:p-3 min-h-[44px] min-w-[44px] flex items-center justify-center bg-black/80 border border-[#232f3f] text-[#8ea0b4] hover:text-white transition-colors"
                  aria-label="Next artwork"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Lightbox Visual Area */}
              <div className="aspect-video w-full bg-[#0c1119] border border-[#1f2836] flex flex-col items-center justify-center p-4 sm:p-8 mb-6 relative overflow-hidden select-none">
                <div className="absolute inset-0 bg-radial-gradient(circle_at_center,_rgba(25,36,54,0.4)_0%,_transparent_70%)" />

                {activeItem.imageUrl ? (
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    draggable={false}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <>
                    <span className="font-jp text-4xl sm:text-6xl text-[#4a586e] tracking-widest block mb-3">
                      {activeItem.japanese}
                    </span>
                    <span className="font-cinzel text-lg sm:text-2xl text-[#dce1e6] uppercase tracking-wider">
                      {activeItem.title}
                    </span>
                    <span className="text-[10px] font-editorial-mono text-[#9e2a2b] tracking-widest uppercase mt-3">
                      OFFICIAL KEY ART STILL
                    </span>
                  </>
                )}
              </div>

              {/* Metadata & Description */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-[#1a2330] pt-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#9e2a2b]" />
                    <span className="text-xs font-editorial-mono text-[#8c98a7] uppercase tracking-wider">
                      CATEGORY: {activeItem.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#b2bcc8] max-w-xl leading-relaxed">
                    {activeItem.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    onClick={handleShareArtwork}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-2 border border-[#252f3f] bg-[#0c1017] hover:border-[#9e2a2b] text-[#c0cad6] hover:text-white font-cinzel text-xs uppercase"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>SHARE ARTWORK</span>
                      </>
                    )}
                  </button>

                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-editorial-mono text-[#556272] uppercase block">
                      PLATE
                    </span>
                    <span className="text-xs font-editorial-mono text-[#9ea9b7]">
                      {activeItem.id.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
