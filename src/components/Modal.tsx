import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-3xl',
  showCloseButton = true,
  className = '',
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const scrollPosRef = useRef<number>(0);

  // Close on ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll and record position
    scrollPosRef.current = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosRef.current}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    // Focus panel on open
    if (panelRef.current) {
      panelRef.current.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollPosRef.current);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Background overlay click closes, click inside panel stops propagation
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-[#040507]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto overscroll-none"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidth} border border-[#263140] bg-[#070a0f] text-[#c0c5cc] p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[90dvh] overflow-y-auto focus:outline-none ${className}`}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 p-2 text-[#7f8b9b] hover:text-white border border-[#252f3f] bg-[#0c1017] hover:border-[#9e2a2b] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9e2a2b]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Optional Header */}
        {(title || subtitle) && (
          <div className="mb-6 pb-4 border-b border-[#1b232e] pr-10">
            {subtitle && (
              <span className="text-[10px] font-editorial-mono tracking-[0.25em] text-[#9e2a2b] uppercase block mb-1">
                {subtitle}
              </span>
            )}
            {title && (
              <h3 className="font-cinzel text-xl sm:text-2xl text-[#edf0f3] uppercase tracking-wider">
                {title}
              </h3>
            )}
          </div>
        )}

        {/* Modal Body */}
        {children}
      </div>
    </div>
  );
};
