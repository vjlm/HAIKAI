import React, { useMemo } from 'react';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 28,
  color = '#9e2a2b',
}) => {
  // Deterministic particle generation so re-renders don't cause jitter
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = 1.5 + (i % 4) * 1.2;
      const left = ((i * 37) % 100);
      const duration = 12 + (i % 7) * 4;
      const delay = (i * 0.8) % 10;
      const isRed = i % 3 === 0;
      const bg = isRed ? color : '#718296';
      const opacity = 0.2 + (i % 5) * 0.12;

      return {
        id: i,
        size,
        left: `${left}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        background: bg,
        opacity,
      };
    });
  }, [count, color]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="ash-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            bottom: '-20px',
            backgroundColor: p.background,
            opacity: p.opacity,
            animationDuration: p.duration,
            animationDelay: p.delay,
            filter: `blur(${p.size > 3 ? 1 : 0.5}px)`,
            boxShadow: `0 0 ${p.size * 2}px ${p.background}`,
          }}
        />
      ))}
    </div>
  );
};
