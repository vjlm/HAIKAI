import React, { useEffect, useRef } from 'react';

export const OceanCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    let t = 0;

    const draw = () => {
      if (!prefersReducedMotion) {
        t += 0.007;
      }

      ctx.clearRect(0, 0, width, height);

      // Deep sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.58);
      skyGrad.addColorStop(0, '#040507');
      skyGrad.addColorStop(0.65, '#070a10');
      skyGrad.addColorStop(1, '#0e1520');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.58);

      // Distant pale cold moon/haze glow at center-top
      const moonX = width * 0.52;
      const moonY = height * 0.28;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, width * 0.45);
      moonGlow.addColorStop(0, 'rgba(180, 195, 220, 0.12)');
      moonGlow.addColorStop(0.35, 'rgba(120, 140, 170, 0.05)');
      moonGlow.addColorStop(1, 'rgba(4, 5, 8, 0)');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(0, 0, width, height * 0.6);

      // Distant horizon line
      const horizonY = height * 0.56;

      // Dark pitch ocean gradient
      const oceanGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      oceanGrad.addColorStop(0, '#06090e');
      oceanGrad.addColorStop(0.3, '#040508');
      oceanGrad.addColorStop(1, '#020304');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Moonlight path on water
      const pathGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      pathGrad.addColorStop(0, 'rgba(180, 205, 235, 0.12)');
      pathGrad.addColorStop(0.5, 'rgba(140, 165, 195, 0.04)');
      pathGrad.addColorStop(1, 'rgba(4, 5, 8, 0)');
      ctx.fillStyle = pathGrad;
      ctx.beginPath();
      ctx.moveTo(moonX - 25, horizonY);
      ctx.lineTo(moonX + 25, horizonY);
      ctx.lineTo(moonX + width * 0.32, height);
      ctx.lineTo(moonX - width * 0.32, height);
      ctx.closePath();
      ctx.fill();

      // Atmospheric slow wave layers
      const waveLayers = [
        { yOffset: 0.57, amp: 2.5, freq: 0.012, speed: 0.8, color: 'rgba(140, 165, 195, 0.1)' },
        { yOffset: 0.62, amp: 4.0, freq: 0.009, speed: 1.1, color: 'rgba(90, 115, 145, 0.08)' },
        { yOffset: 0.68, amp: 6.5, freq: 0.006, speed: 0.7, color: 'rgba(60, 80, 105, 0.07)' },
        { yOffset: 0.76, amp: 9.0, freq: 0.0045, speed: 0.9, color: 'rgba(35, 50, 70, 0.09)' },
        { yOffset: 0.88, amp: 13.0, freq: 0.003, speed: 0.6, color: 'rgba(20, 30, 45, 0.12)' },
      ];

      for (const layer of waveLayers) {
        ctx.beginPath();
        const baseLine = height * layer.yOffset;
        ctx.moveTo(0, baseLine);

        for (let x = 0; x <= width; x += 12) {
          const y =
            baseLine +
            Math.sin(x * layer.freq + t * layer.speed) * layer.amp +
            Math.cos(x * layer.freq * 0.5 + t * 0.4) * (layer.amp * 0.4);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = layer.color;
        ctx.fill();
      }

      // Solitary tiny ship silhouette near the horizon
      const shipX = width * 0.48;
      const shipY = horizonY + 8;
      ctx.fillStyle = 'rgba(10, 14, 20, 0.92)';
      // Tiny hull
      ctx.beginPath();
      ctx.moveTo(shipX - 10, shipY + 3);
      ctx.lineTo(shipX + 10, shipY + 3);
      ctx.lineTo(shipX + 6, shipY + 7);
      ctx.lineTo(shipX - 6, shipY + 7);
      ctx.closePath();
      ctx.fill();

      // Tiny mast and rigging
      ctx.strokeStyle = 'rgba(10, 14, 20, 0.92)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(shipX, shipY + 3);
      ctx.lineTo(shipX, shipY - 14);
      ctx.stroke();

      // Faint lantern on mast
      ctx.fillStyle = 'rgba(235, 175, 95, 0.65)';
      ctx.beginPath();
      ctx.arc(shipX, shipY - 8, 1.2, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full ${className}`} />;
};
