import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { ShareModal, ShareDataPayload } from '../components/ShareModal';
import { Copy, Share2, Check } from 'lucide-react';

interface TextProtectionContextType {
  openMenu: (x: number, y: number, text: string, title?: string) => void;
}

const TextProtectionContext = createContext<TextProtectionContextType | null>(null);

export const useTextProtection = () => {
  const ctx = useContext(TextProtectionContext);
  if (!ctx) {
    return {
      openMenu: () => {},
    };
  }
  return ctx;
};

export const TextProtectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [activeText, setActiveText] = useState<string>('');
  const [activeTitle, setActiveTitle] = useState<string>('HAIKAI — THE SEA OF ASH');
  const [copied, setCopied] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu on outside click or scroll or escape
  useEffect(() => {
    const handleDismiss = (e: MouseEvent | TouchEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key === 'Escape') {
        setMenuPos(null);
        return;
      }
      if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setMenuPos(null);
      }
    };

    window.addEventListener('mousedown', handleDismiss);
    window.addEventListener('touchstart', handleDismiss);
    window.addEventListener('scroll', () => setMenuPos(null), { passive: true });
    window.addEventListener('keydown', handleDismiss);

    return () => {
      window.removeEventListener('mousedown', handleDismiss);
      window.removeEventListener('touchstart', handleDismiss);
      window.removeEventListener('scroll', () => setMenuPos(null));
      window.removeEventListener('keydown', handleDismiss);
    };
  }, []);

  const openMenu = (x: number, y: number, text: string, title?: string) => {
    // Keep within viewport boundaries
    const safeX = Math.min(Math.max(x, 100), window.innerWidth - 110);
    const safeY = Math.min(Math.max(y, 60), window.innerHeight - 60);

    setMenuPos({ x: safeX, y: safeY });
    setActiveText(text);
    setActiveTitle(title || 'HAIKAI — THE SEA OF ASH');
    setCopied(false);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(activeText);
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

    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: activeTitle,
          text: activeText,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to modal if canceled or unsupported
      }
    }

    setShareModalOpen(true);
  };

  return (
    <TextProtectionContext.Provider value={{ openMenu }}>
      {children}

      {/* Sleek HAIKAI Long-Press Contextual Menu */}
      {menuPos && (
        <div
          ref={menuRef}
          style={{ top: `${menuPos.y}px`, left: `${menuPos.x}px` }}
          className="fixed z-50 -translate-x-1/2 -translate-y-1/2 border border-[#9e2a2b]/70 bg-[#090d14]/95 backdrop-blur-md px-2 py-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.85)] flex items-center gap-3 animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel tracking-wider uppercase text-[#e0e6ed] hover:text-[#9e2a2b] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY</span>
              </>
            )}
          </button>

          <span className="h-3 w-[1px] bg-[#273241]" />

          <button
            onClick={handleShare}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel tracking-wider uppercase text-[#e0e6ed] hover:text-[#9e2a2b] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>SHARE</span>
          </button>
        </div>
      )}

      {/* Universal Share Modal Fallback */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        data={{
          title: activeTitle,
          text: activeText,
          url: window.location.href,
        }}
      />
    </TextProtectionContext.Provider>
  );
};

// Reusable wrapper for protected lore/quotes
interface ProtectedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const ProtectedText: React.FC<ProtectedTextProps> = ({
  children,
  title,
  className = '',
  ...props
}) => {
  const { openMenu } = useTextProtection();
  const touchTimerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getCleanText = (): string => {
    return containerRef.current?.innerText || '';
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    touchTimerRef.current = window.setTimeout(() => {
      openMenu(x, y, getCleanText(), title);
    }, 450);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openMenu(e.clientX, e.clientY, getCleanText(), title);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
      onContextMenu={handleContextMenu}
      className={`select-none cursor-default ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
