import React, { useState } from 'react';
import { TrailerItem } from '../types/haikai';
import { TRAILERS } from '../data/haikaiData';
import { Play, Film, X, Calendar, Clock, ExternalLink, Sparkles } from 'lucide-react';

interface TrailersSectionProps {
  trailers?: TrailerItem[];
}

export function parseVideoEmbed(url: string): { type: 'youtube' | 'vimeo' | 'direct' | 'unsupported'; embedUrl: string; thumbnail?: string } {
  if (!url) return { type: 'unsupported', embedUrl: '' };

  // 1. YouTube matches: watch?v=ID, youtu.be/ID, embed/ID
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    };
  }

  // 2. Vimeo matches
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const id = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
    };
  }

  // 3. Direct HTML5 video file (.mp4, .webm)
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
    return {
      type: 'direct',
      embedUrl: url,
    };
  }

  return {
    type: 'direct',
    embedUrl: url,
  };
}

export const TrailersSection: React.FC<TrailersSectionProps> = ({ trailers: propTrailers }) => {
  const trailersList = (propTrailers && propTrailers.length > 0) ? propTrailers : TRAILERS;
  const [activeTrailer, setActiveTrailer] = useState<TrailerItem | null>(null);

  if (!trailersList || trailersList.length === 0) return null;

  return (
    <section id="trailers" className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-[#121822] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#9e2a2b]/8 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative z-10">
        <div className="flex items-center justify-center gap-2 text-xs font-editorial-mono text-[#9e2a2b] tracking-[0.3em] uppercase font-semibold">
          <Film className="w-4 h-4" />
          <span>OFFICIAL BROADCAST // CINEMATICS</span>
        </div>

        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#edf1f5] uppercase tracking-wider">
          TRAILERS & ARCHIVE PV
        </h2>

        <p className="font-jp text-sm tracking-[0.3em] text-[#6d798a]">
          公式映像アーカイブ
        </p>

        <p className="font-serif-cinematic italic text-base text-[#8c97a5] max-w-xl mx-auto pt-2">
          «“Watch the cold water move. Listen to what the seabed left behind.”»
        </p>
      </div>

      {/* Trailers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {trailersList.map((item) => {
          const videoInfo = parseVideoEmbed(item.videoUrl);
          const thumb = item.thumbnailUrl || videoInfo.thumbnail || '/assets/manga_vol_01_cover.webp';

          return (
            <div
              key={item.id}
              onClick={() => setActiveTrailer(item)}
              className="group border border-[#1b2533] hover:border-[#9e2a2b]/80 bg-[#070b10] flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(158,42,43,0.25)] overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-[#05070a] overflow-hidden">
                <img
                  src={thumb}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if thumbnail fails
                    (e.currentTarget as HTMLImageElement).src = '/assets/manga_vol_01_cover.webp';
                  }}
                />

                {/* Dark gradient wash */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b10] via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Big Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#9e2a2b]/90 group-hover:bg-[#b53235] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border border-white/20">
                    <Play className="w-6 h-6 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Badges on Thumbnail */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-[#2e3e52] text-[10px] font-editorial-mono text-[#f2afb2] uppercase tracking-wider font-semibold">
                    {item.category || 'TRAILER'}
                  </span>
                </div>

                {item.duration && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-[11px] font-editorial-mono text-[#c4ccd6] tabular-nums">
                    <Clock className="w-3 h-3 text-[#9e2a2b]" />
                    <span>{item.duration}</span>
                  </div>
                )}
              </div>

              {/* Meta & Synopsis */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  {item.japanese && (
                    <span className="font-jp text-xs text-[#6e7d90] tracking-wider block">
                      {item.japanese}
                    </span>
                  )}
                  <h3 className="font-cinzel text-base text-[#edf1f5] group-hover:text-white uppercase tracking-wide leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                {item.description && (
                  <p className="text-xs text-[#828f9f] leading-relaxed line-clamp-2 font-light">
                    {item.description}
                  </p>
                )}

                <div className="pt-3 border-t border-[#16202c] flex items-center justify-between text-[11px] font-editorial-mono text-[#667586]">
                  <span>{item.releaseDate ? `RELEASE: ${item.releaseDate}` : 'CANON ARCHIVE'}</span>
                  <span className="text-[#9e2a2b] font-semibold flex items-center gap-1 group-hover:underline">
                    WATCH NOW →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Theater Mode Video Modal */}
      {activeTrailer && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveTrailer(null);
          }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-5xl w-full border border-[#2b394d] bg-[#070a0f] p-4 sm:p-6 shadow-2xl flex flex-col space-y-4 max-h-[96vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2533]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9e2a2b] animate-pulse" />
                <span className="text-xs font-editorial-mono text-[#9e2a2b] uppercase tracking-widest font-bold">
                  {activeTrailer.category || 'OFFICIAL BROADCAST'}
                </span>
                {activeTrailer.japanese && (
                  <span className="text-xs font-jp text-[#6c7b8d] hidden sm:inline">
                    · {activeTrailer.japanese}
                  </span>
                )}
              </div>

              <button
                onClick={() => setActiveTrailer(null)}
                className="p-2 text-[#7f8b9b] hover:text-white border border-[#252f3f] bg-[#0c1017] transition-colors"
                aria-label="Close Theater Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Container */}
            <div className="w-full aspect-video bg-black border border-[#1b2533] overflow-hidden relative shadow-2xl">
              {(() => {
                const info = parseVideoEmbed(activeTrailer.videoUrl);
                if (info.type === 'youtube' || info.type === 'vimeo') {
                  return (
                    <iframe
                      src={info.embedUrl}
                      title={activeTrailer.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  );
                }

                if (info.type === 'direct') {
                  return (
                    <video
                      src={info.embedUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  );
                }

                return (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <Film className="w-10 h-10 text-[#9e2a2b]" />
                    <p className="text-sm font-editorial-mono text-[#c4ccd6]">
                      Opening external stream:
                    </p>
                    <a
                      href={activeTrailer.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-[#9e2a2b] text-white text-xs font-cinzel tracking-wider uppercase flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>OPEN VIDEO LINK</span>
                    </a>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer Description */}
            <div className="space-y-1 pt-1">
              <h3 className="font-cinzel text-lg sm:text-xl text-[#edf1f5] uppercase tracking-wide">
                {activeTrailer.title}
              </h3>
              {activeTrailer.description && (
                <p className="text-xs sm:text-sm text-[#94a1b0] leading-relaxed font-light">
                  {activeTrailer.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
