import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/haikaiData';
import { GalleryItem } from '../types/haikai';
import { X, Maximize2, Tag } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['ALL', 'CHARACTERS', 'LANDSCAPES', 'THE SEA', 'RUINS', 'WAR', 'CONCEPT ART'];

  const filteredItems =
    activeCategory === 'ALL'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="relative w-full bg-[#050608] py-28 md:py-36 px-6 md:px-12 border-t border-[#141b24] overflow-hidden">
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>VISUAL CHRONICLE</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">KEY ART ARCHIVE</span>
          </div>

          <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl tracking-[0.35em] text-[#e4e8ec] uppercase font-light mb-3">
            GALLERY
          </h2>
          <p className="font-jp text-base tracking-[0.4em] text-[#717b88]">
            美術画廊
          </p>
          <div className="w-16 h-[1px] bg-[#9e2a2b] mt-6" />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto gap-2 pb-4 mb-12 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              type="button"
              className={`px-4 py-2 text-xs font-cinzel tracking-[0.2em] uppercase border transition-all whitespace-nowrap ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item: GalleryItem) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group border border-[#1e2735] bg-[#080b10] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#3b4b63] hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Cinematic Art Container */}
              <div className="relative aspect-video w-full bg-[#0d121a] flex items-center justify-center overflow-hidden border-b border-[#18212e]">
                {/* Background artistic texture */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent z-10" />

                {/* Styled fallback art illustration based on category */}
                <div className="text-center p-6 transition-transform duration-500 group-hover:scale-105">
                  <span className="font-jp text-3xl sm:text-4xl text-[#3b4759] tracking-widest block mb-2">
                    {item.japanese}
                  </span>
                  <span className="text-[10px] font-editorial-mono text-[#58677c] uppercase tracking-widest">
                    {item.category} // CINEMATIC FRAME
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-[#05070a]/80 border border-[#2b384c] rounded">
                  <Maximize2 className="w-3.5 h-3.5 text-[#e0e5eb]" />
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-editorial-mono text-[#9e2a2b] tracking-wider uppercase">
                    {item.category}
                  </span>
                  <span className="font-jp text-xs text-[#5f6a78]">
                    {item.japanese}
                  </span>
                </div>

                <h3 className="font-cinzel text-base text-[#edf1f4] uppercase tracking-wider mb-2 group-hover:text-white transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-[#8793a2] leading-relaxed line-clamp-2 font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 bg-[#050608]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
            <div className="relative max-w-4xl w-full border border-[#273243] bg-[#070a0f] p-6 sm:p-10 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 p-2 text-[#7f8b9b] hover:text-white border border-[#252f3f] bg-[#0c1017] transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Lightbox Visual Area */}
              <div className="aspect-video w-full bg-[#0c1119] border border-[#1f2836] flex flex-col items-center justify-center p-8 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient(circle_at_center,_rgba(25,36,54,0.4)_0%,_transparent_70%)" />
                <span className="font-jp text-5xl sm:text-6xl text-[#4a586e] tracking-widest block mb-4">
                  {activeItem.japanese}
                </span>
                <span className="font-cinzel text-xl sm:text-2xl text-[#dce1e6] uppercase tracking-wider">
                  {activeItem.title}
                </span>
                <span className="text-xs font-editorial-mono text-[#9e2a2b] tracking-widest uppercase mt-3">
                  OFFICIAL KEY ART STILL
                </span>
              </div>

              {/* Metadata & Description */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-[#1a2330] pt-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-3.5 h-3.5 text-[#9e2a2b]" />
                    <span className="text-xs font-editorial-mono text-[#8c98a7] uppercase tracking-wider">
                      CATEGORY: {activeItem.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#b2bcc8] max-w-xl leading-relaxed">
                    {activeItem.description}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-editorial-mono text-[#556272] uppercase block">
                    PRODUCTION ARCHIVE
                  </span>
                  <span className="text-xs font-editorial-mono text-[#9ea9b7]">
                    PLATE // {activeItem.id.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
