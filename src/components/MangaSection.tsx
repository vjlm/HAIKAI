import React, { useState, useEffect, useRef } from 'react';
import { MangaRelease } from '../types/haikai';
import { DEFAULT_MANGA_RELEASE } from '../data/haikaiData';
import { Modal } from './Modal';
import { BookOpen, ExternalLink, Info, Clock, CheckCircle2, Share2, Check } from 'lucide-react';
import { FlipCard } from './FlipCard';

interface MangaSectionProps {
  release?: MangaRelease;
  onShareExcerpt?: (text: string, title: string) => void;
}

export const MangaSection: React.FC<MangaSectionProps> = ({ release: propRelease, onShareExcerpt }) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [currentRelease, setCurrentRelease] = useState<MangaRelease>(
    propRelease || DEFAULT_MANGA_RELEASE
  );

  useEffect(() => {
    if (propRelease) {
      setCurrentRelease(propRelease);
      setImageError(false);
    }
  }, [propRelease]);

  const release = currentRelease;

  // Time tracking with server clock-skew compensation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 1 });

  const [isLiveReleased, setIsLiveReleased] = useState<boolean>(
    Boolean(release.isReleased || release.status === 'Released')
  );

  // Calculate server time offset: serverTime - clientLocalTime
  const serverOffsetRef = useRef<number>(0);

  useEffect(() => {
    if (release.serverTime) {
      const serverMs = new Date(release.serverTime).getTime();
      const localMs = Date.now();
      serverOffsetRef.current = serverMs - localMs;
    }
  }, [release.serverTime]);

  // Periodic server state synchronization (every 20 seconds)
  useEffect(() => {
    const syncStatus = async () => {
      try {
        const res = await fetch('/api/manga/status');
        if (res.ok) {
          const data = await res.json();
          if (data.serverTime) {
            const serverMs = new Date(data.serverTime).getTime();
            serverOffsetRef.current = serverMs - Date.now();
          }
          if (data.isReleased !== isLiveReleased) {
            setIsLiveReleased(data.isReleased);
          }
          if (data.mangaUrl && !currentRelease.mangaUrl) {
            setCurrentRelease((prev) => ({
              ...prev,
              mangaUrl: data.mangaUrl,
              isReleased: data.isReleased,
            }));
          }
        }
      } catch {
        // Keep running client countdown smoothly during transient network drops
      }
    };

    const syncInterval = window.setInterval(syncStatus, 20000);
    return () => window.clearInterval(syncInterval);
  }, [isLiveReleased, currentRelease.mangaUrl]);

  // Second-by-second countdown loop
  useEffect(() => {
    const targetMs = new Date(release.releaseAt).getTime();

    const updateCountdown = () => {
      // Adjusted current time based on server clock synchronization
      const currentServerMs = Date.now() + serverOffsetRef.current;
      const diff = targetMs - currentServerMs;

      if (diff <= 0 || release.status === 'Released') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        if (!isLiveReleased) {
          setIsLiveReleased(true);
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, totalMs: diff });
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [release.releaseAt, release.status, isLiveReleased]);

  const padZero = (n: number) => String(Math.max(0, n)).padStart(2, '0');

  // Handle Read Action
  const handleReadClick = (e: React.MouseEvent) => {
    if (!isLiveReleased) {
      e.preventDefault();
      setDetailsModalOpen(true);
      return;
    }

    if (release.mangaUrl) {
      if (release.openInNewTab) {
        window.open(release.mangaUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = release.mangaUrl;
      }
    }
  };

  // Convert UTC release timestamp to user's local timezone representation
  const localReleaseDateString = new Date(release.releaseAt).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  if (release.status === 'Hidden') {
    return null;
  }

  const handleShare = async () => {
    const shareText = `${release.title} — ${release.volumeNumber} (${release.subtitle || 'Official Manga'})\n${release.description}\n${window.location.origin}/#manga`;
    if (onShareExcerpt) {
      onShareExcerpt(shareText, release.title);
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${release.title} ${release.volumeNumber}`,
          text: shareText,
          url: `${window.location.origin}/#manga`,
        });
        return;
      } catch {
        // ignore
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <section
      id="manga"
      className="relative w-full bg-[#050608] py-28 md:py-36 px-6 md:px-12 border-t border-[#141b24] overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(158,42,43,0.12)_0%,_rgba(5,6,8,1)_70%)] pointer-events-none" />
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4 text-xs font-editorial-mono tracking-[0.3em] text-[#6d7785] uppercase">
            <span>PRINT & DIGITAL SERIALIZATION</span>
            <span>·</span>
            <span className="text-[#9e2a2b]">MANGA RELEASE</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.3em] text-[#e4e8ec] uppercase font-light mb-3">
            {release.title}
          </h2>
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.5em] text-[#909dae] uppercase mb-4">
            {release.volumeNumber} — {release.subtitle || 'FIRST PUBLICATION'}
          </p>
          <p className="font-jp text-base tracking-[0.4em] text-[#717b88]">
            公式単行本刊行
          </p>
          <div className="w-16 h-[1px] bg-[#9e2a2b] mt-6" />
        </div>

        {/* Central Release Showcase Landmark */}
        <div className="border border-[#263140] bg-[#070a0f] p-8 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Manga Volume 01 Cover Artwork Frame */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-xs sm:max-w-sm aspect-[3/4] border border-[#2b3749] bg-[#0b0f16] shadow-2xl overflow-hidden p-6 flex flex-col justify-between group">
                {/* Artwork visual container with fallback */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040609] via-transparent to-transparent z-10" />

                {/* Stylized Cover Key Art */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none">
                  {release.coverImage && !imageError ? (
                    <img
                      src={release.coverImage}
                      alt={`${release.title} ${release.volumeNumber} Cover`}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                      draggable={false}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="relative z-0 w-full h-full flex flex-col justify-between py-6">
                      <div className="w-full flex justify-between items-center text-[10px] font-editorial-mono text-[#546274] tracking-widest uppercase">
                        <span>OFFICIAL IMPERIAL PRESS</span>
                        <span>VOL. 01</span>
                      </div>

                      <div className="my-auto">
                        <span className="font-jp text-5xl sm:text-6xl text-[#dbe1e8] tracking-[0.25em] block mb-2 font-light">
                          灰海
                        </span>
                        <span className="font-cinzel text-lg tracking-[0.3em] text-[#9e2a2b] block font-semibold">
                          HAIKAI
                        </span>
                        <span className="text-[10px] font-editorial-mono text-[#788596] tracking-[0.35em] block mt-1 uppercase">
                          THE SEA OF ASH
                        </span>
                      </div>

                      <div className="text-left border-l-2 border-[#9e2a2b] pl-3">
                        <span className="text-[10px] font-cinzel text-[#8c97a5] uppercase block">
                          ORIGINAL MANGA
                        </span>
                        <span className="text-xs font-serif-cinematic text-[#c1ccd8] italic">
                          By The Haikai Committee
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Badge overlay */}
                <div className="relative z-20 self-start">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-editorial-mono tracking-widest uppercase border ${
                      isLiveReleased
                        ? 'border-emerald-500/60 bg-emerald-950/80 text-emerald-300'
                        : 'border-[#9e2a2b]/60 bg-[#16080a]/90 text-[#f2afb2]'
                    }`}
                  >
                    {isLiveReleased ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        NOW AVAILABLE
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-[#9e2a2b]" />
                        RELEASE IMMINENT
                      </>
                    )}
                  </span>
                </div>

                <div className="relative z-20 self-end text-[10px] font-editorial-mono text-[#586475] tracking-widest">
                  ISBN 978-4-00-HAIKAI-1
                </div>
              </div>
            </div>

            {/* Right: Live Countdown or Release CTA */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1b232e] mb-4">
                  <span className="text-xs font-editorial-mono tracking-widest text-[#9e2a2b] uppercase font-bold">
                    {release.volumeNumber}
                  </span>
                  <span className="text-xs font-editorial-mono text-[#616e7e]">
                    {release.chapterRange}
                  </span>
                </div>

                <h3 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl text-[#edf0f3] uppercase tracking-wide mb-4">
                  {isLiveReleased ? 'VOLUME 01 IS NOW PUBLISHED' : 'OFFICIAL SERIALIZATION COUNTDOWN'}
                </h3>

                <p className="text-sm sm:text-base text-[#9ba6b5] leading-relaxed font-light mb-8">
                  {release.description}
                </p>

                {/* THE COUNTDOWN (Visible before release) */}
                {!isLiveReleased ? (
                  <div className="border border-[#222d3b] bg-[#090d14] p-6 sm:p-8 mb-8">
                    <div className="flex items-center justify-between text-xs font-editorial-mono text-[#788597] tracking-widest uppercase pb-4 mb-6 border-b border-[#19222e]">
                      <span>GLOBAL UNSEALING AT</span>
                      <span className="text-[#aeb9c7]">{localReleaseDateString}</span>
                    </div>

                    {/* Split-Flap Card Flip Timer: Digits fit boxes, no text labels */}
                    <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-xl mx-auto">
                      <div className="w-full flex justify-center">
                        <FlipCard value={padZero(timeLeft.days)} />
                      </div>

                      <div className="w-full flex justify-center">
                        <FlipCard value={padZero(timeLeft.hours)} />
                      </div>

                      <div className="w-full flex justify-center">
                        <FlipCard value={padZero(timeLeft.minutes)} />
                      </div>

                      <div className="w-full flex justify-center">
                        <FlipCard value={padZero(timeLeft.seconds)} isAccent={true} />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* RELEASED STATE BANNER */
                  <div className="p-6 border border-emerald-900/60 bg-[#07130f] mb-8 animate-in fade-in duration-500">
                    <div className="flex items-center gap-2 mb-2 text-xs font-editorial-mono tracking-widest text-emerald-400 uppercase font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      VOLUME 01 · UNSEALED ACROSS ALL NETWORKS
                    </div>
                    <p className="text-xs sm:text-sm text-[#a3c9bd] leading-relaxed">
                      The official digital and print edition is now open for reading. Access the verified reader through the authorized portal below.
                    </p>
                  </div>
                )}

                {/* Primary & Secondary Action Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {isLiveReleased ? (
                    <button
                      onClick={handleReadClick}
                      type="button"
                      className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 text-xs font-cinzel tracking-[0.25em] group-hover:tracking-[0.3em] text-white uppercase bg-[#9e2a2b] hover:bg-[#b83335] shadow-[0_0_25px_rgba(158,42,43,0.4)] hover:shadow-[0_0_35px_rgba(158,42,43,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e2a2b]"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                      <BookOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
                      <span className="relative z-10">READ VOLUME 01 →</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setDetailsModalOpen(true)}
                      type="button"
                      className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 text-xs font-cinzel tracking-[0.25em] text-[#d4d9df] hover:text-white uppercase border border-[#3b4759] hover:border-[#9e2a2b] bg-[#0d121a] hover:bg-[#141b26] hover:shadow-[0_0_20px_rgba(158,42,43,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-[#9e2a2b] animate-pulse" />
                      <span className="relative z-10">[ COUNTDOWN ACTIVE ]</span>
                    </button>
                  )}

                  <button
                    onClick={() => setDetailsModalOpen(true)}
                    type="button"
                    className="group w-full sm:w-auto px-6 py-4 text-xs font-cinzel tracking-[0.2em] text-[#8692a1] hover:text-white uppercase border border-[#1b232e] hover:border-[#38465d] bg-[#06090d] hover:bg-[#0c1219] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Info className="w-3.5 h-3.5 text-[#6c7d91] group-hover:text-[#9e2a2b] transition-colors" />
                    <span>VIEW DETAILS & CHAPTERS</span>
                  </button>
                </div>
              </div>

              {/* Footnote */}
              <div className="pt-4 border-t border-[#18212d] flex justify-between items-center text-[10px] font-editorial-mono text-[#546070] uppercase">
                <span>AUTHORITY: HIGH MARITIME PUBLICATION CORDON</span>
                <span>SERVER-AUTHENTICATED RELEASE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Volume Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="VOLUME 01 SPECIFICATIONS"
        subtitle="PUBLICATION ARCHIVE"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6 text-xs text-[#a2adbb]">
          <div>
            <h4 className="font-cinzel text-lg text-[#edf0f3] uppercase mb-1">
              {release.title} — {release.volumeNumber}
            </h4>
            <span className="font-editorial-mono text-xs text-[#9e2a2b] uppercase block mb-3">
              {release.subtitle}
            </span>
            <p className="text-sm text-[#b8c2cd] leading-relaxed font-light">
              {release.description}
            </p>
          </div>

          {/* Chapter Table */}
          <div className="border border-[#1e2735] bg-[#090d13] p-4">
            <span className="text-[10px] font-editorial-mono text-[#627082] uppercase tracking-widest block mb-3">
              INCLUDED CHRONICLE CHAPTERS
            </span>
            <ul className="space-y-2 font-editorial-mono text-xs text-[#c4ccd6]">
              <li className="flex justify-between border-b border-[#141b24] pb-1.5">
                <span>CHAPTER 01: The Salvage Boy</span>
                <span className="text-[#647182]">Pages 001–048</span>
              </li>
              <li className="flex justify-between border-b border-[#141b24] pb-1.5">
                <span>CHAPTER 02: The Crown Map</span>
                <span className="text-[#647182]">Pages 049–092</span>
              </li>
              <li className="flex justify-between border-b border-[#141b24] pb-1.5">
                <span>CHAPTER 03: The Forest</span>
                <span className="text-[#647182]">Pages 093–136</span>
              </li>
              <li className="flex justify-between border-b border-[#141b24] pb-1.5">
                <span>CHAPTER 04: The War Records</span>
                <span className="text-[#647182]">Pages 137–184</span>
              </li>
              <li className="flex justify-between">
                <span>CHAPTER 05: The Glass Desert</span>
                <span className="text-[#647182]">Pages 185–232</span>
              </li>
            </ul>
          </div>

          {/* Publication Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs font-editorial-mono">
            <div>
              <span className="text-[10px] text-[#556374] uppercase block">
                SCHEDULED RELEASE (LOCAL TIME)
              </span>
              <span className="text-[#d5dbe2]">{localReleaseDateString}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#556374] uppercase block">
                EXTERNAL ACCESS LINK
              </span>
              <span className="text-[#9e2a2b] truncate block">
                {release.mangaUrl}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#1a2330] flex flex-col sm:flex-row justify-between gap-3">
            {isLiveReleased ? (
              <button
                onClick={handleReadClick}
                type="button"
                className="px-6 py-2.5 text-xs font-cinzel tracking-wider uppercase text-white bg-[#9e2a2b] hover:bg-[#b83335] flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>OPEN READER NOW</span>
              </button>
            ) : (
              <span className="text-xs font-editorial-mono text-[#8c97a5] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#9e2a2b]" />
                Reading portal unlocks automatically at zero.
              </span>
            )}

            <button
              onClick={handleShare}
              type="button"
              className="px-4 py-2 text-xs font-cinzel tracking-wider uppercase text-[#9ea9b7] hover:text-white border border-[#232e3d] flex items-center justify-center gap-1.5 transition-colors"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">COPIED TO CLIPBOARD</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>SHARE RELEASE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};
