import React, { useState } from 'react';
import { Copy, Share2, Check, ExternalLink } from 'lucide-react';
import { Modal } from './Modal';

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
  url?: string;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({
  isOpen,
  onClose,
  title,
  text,
  url = typeof window !== 'undefined' ? window.location.href : 'https://haikai.anime',
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n"${text}"\n\n${url}`);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // Fallback
    }
  };

  const shareServices = [
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`«${text.slice(0, 180)}...»`)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title} — ${text.slice(0, 120)}`)}`,
    },
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}: «${text}» ${url}`)}`,
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Excerpt from HAIKAI — THE SEA OF ASH:\n\n"${text}"\n\n${url}`)}`,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SHARE RECORD" subtitle="ARCHIVAL TRANSMISSION" maxWidth="md">
      <div className="space-y-6">
        {/* Text Preview */}
        <div className="p-4 border border-[#1e2735] bg-[#0c1017] text-xs font-serif-cinematic italic text-[#cbd5e1] leading-relaxed max-h-32 overflow-y-auto">
          «{text}»
        </div>

        {/* Quick Copy Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyLink}
            type="button"
            className="flex items-center justify-center gap-2 p-3 text-xs font-cinzel tracking-wider uppercase border border-[#232e3d] bg-[#090d14] hover:bg-[#121924] hover:border-[#9e2a2b] transition-all text-[#d8e0e8]"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#9e2a2b]" />}
            <span>{copiedLink ? 'LINK COPIED' : 'COPY LINK'}</span>
          </button>

          <button
            onClick={handleCopyText}
            type="button"
            className="flex items-center justify-center gap-2 p-3 text-xs font-cinzel tracking-wider uppercase border border-[#232e3d] bg-[#090d14] hover:bg-[#121924] hover:border-[#9e2a2b] transition-all text-[#d8e0e8]"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#9e2a2b]" />}
            <span>{copiedText ? 'TEXT COPIED' : 'COPY TEXT'}</span>
          </button>
        </div>

        {/* Third-Party Service Links */}
        <div>
          <span className="text-[10px] font-editorial-mono tracking-widest uppercase text-[#5f6c7c] block mb-2">
            DIRECT TRANSMISSION
          </span>
          <div className="grid grid-cols-2 gap-2">
            {shareServices.map((service) => (
              <a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 text-xs text-[#95a1b0] hover:text-white border border-[#1b232e] bg-[#070a0f] hover:border-[#334155] transition-colors"
              >
                <span>{service.name}</span>
                <ExternalLink className="w-3 h-3 text-[#5f6c7c]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface ProtectedTextProps {
  children: React.ReactNode;
  title?: string;
  excerpt?: string;
  className?: string;
}

export const ProtectedText: React.FC<ProtectedTextProps> = ({
  children,
  title = 'HAIKAI — The Sea of Ash',
  excerpt,
  className = '',
}) => {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const timerRef = React.useRef<number | null>(null);

  const rawText = excerpt || (typeof children === 'string' ? children : '');

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    timerRef.current = window.setTimeout(() => {
      setMenuPos({ x: Math.min(x, window.innerWidth - 180), y: Math.max(y - 60, 20) });
    }, 450); // 450ms long-press threshold
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // Only intercept on devices where right-click occurs
    if (rawText) {
      e.preventDefault();
      setMenuPos({
        x: Math.min(e.clientX, window.innerWidth - 180),
        y: Math.max(e.clientY - 40, 20),
      });
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setMenuPos(null);
      }, 1200);
    } catch {
      setMenuPos(null);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuPos(null);

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: rawText,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback
      }
    }

    setIsShareSheetOpen(true);
  };

  // Close context menu on outside click
  React.useEffect(() => {
    if (!menuPos) return;
    const closeMenu = () => setMenuPos(null);
    window.addEventListener('click', closeMenu);
    window.addEventListener('touchstart', closeMenu);
    return () => {
      window.removeEventListener('click', closeMenu);
      window.removeEventListener('touchstart', closeMenu);
    };
  }, [menuPos]);

  return (
    <>
      <span
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
        onContextMenu={handleContextMenu}
        className={`select-none cursor-default ${className}`}
      >
        {children}
      </span>

      {/* Sleek HAIKAI Contextual Menu */}
      {menuPos && (
        <div
          style={{ top: `${menuPos.y}px`, left: `${menuPos.x}px` }}
          className="fixed z-50 flex items-center bg-[#070b10] border border-[#2b384c] shadow-[0_10px_25px_rgba(0,0,0,0.9)] rounded px-1 py-1 text-xs animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-cinzel tracking-wider text-[#d4dde7] hover:text-white hover:bg-[#141b24] transition-colors rounded-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#9e2a2b]" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>

          <span className="w-[1px] h-3 bg-[#1e2735] mx-0.5" />

          <button
            onClick={handleShare}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-cinzel tracking-wider text-[#d4dde7] hover:text-white hover:bg-[#141b24] transition-colors rounded-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[#9e2a2b]" />
            <span>SHARE</span>
          </button>
        </div>
      )}

      {/* Fallback Share Sheet */}
      <ShareSheet
        isOpen={isShareSheetOpen}
        onClose={() => setIsShareSheetOpen(false)}
        title={title}
        text={rawText}
      />
    </>
  );
};
