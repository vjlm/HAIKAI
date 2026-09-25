import React from 'react';

interface HaikaiLogoProps {
  className?: string;
  variant?: 'header' | 'footer' | 'hero';
}

export const HaikaiLogo: React.FC<HaikaiLogoProps> = ({
  className = 'h-6 sm:h-7 w-auto',
  variant = 'header',
}) => {
  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 1200 280"
        className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        aria-label="HAIKAI"
      >
        <defs>
          {/* Weathered Stone Ivory Gradient */}
          <linearGradient id="logoIvoryStone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f5f7fa" />
            <stop offset="35%" stopColor="#e2e7ec" />
            <stop offset="50%" stopColor="#b4becc" />
            <stop offset="55%" stopColor="#dde3ea" />
            <stop offset="100%" stopColor="#c5ced8" />
          </linearGradient>

          {/* Deep Crimson Blood Stained Gradient for the central I */}
          <linearGradient id="logoBloodCrimson" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cf2328" />
            <stop offset="30%" stopColor="#961519" />
            <stop offset="50%" stopColor="#5c0a0c" />
            <stop offset="70%" stopColor="#a3191d" />
            <stop offset="100%" stopColor="#7a1013" />
          </linearGradient>

          {/* Partial Crimson Splatter Gradient for right leg of second A */}
          <linearGradient id="logoBloodA" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e7ec" />
            <stop offset="52%" stopColor="#c5ced8" />
            <stop offset="62%" stopColor="#961519" />
            <stop offset="85%" stopColor="#cf2328" />
            <stop offset="100%" stopColor="#7a1013" />
          </linearGradient>

          {/* Razor Blade Horizon Gradient */}
          <linearGradient id="logoSteelBlade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a5568" stopOpacity="0" />
            <stop offset="6%" stopColor="#8a99ad" stopOpacity="0.5" />
            <stop offset="20%" stopColor="#d8e1ea" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="80%" stopColor="#d8e1ea" />
            <stop offset="94%" stopColor="#8a99ad" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4a5568" stopOpacity="0" />
          </linearGradient>
        </defs>

        <style>
          {`
            .haikai-glyph {
              font-family: 'Cinzel', 'Trajan Pro', Georgia, serif;
              font-weight: 700;
              font-size: 168px;
              letter-spacing: 0.10em;
              text-anchor: middle;
              dominant-baseline: central;
            }
          `}
        </style>

        {/* Drop Shadow for Chiseled Stone effect */}
        <g fill="#000000" opacity="0.6" transform="translate(3, 4)">
          <text x="175" y="140" className="haikai-glyph">H</text>
          <text x="350" y="140" className="haikai-glyph">A</text>
          <text x="490" y="140" className="haikai-glyph">I</text>
          <text x="635" y="140" className="haikai-glyph">K</text>
          <text x="815" y="140" className="haikai-glyph">A</text>
          <text x="965" y="140" className="haikai-glyph">I</text>
        </g>

        {/* The 6 Letters */}
        {/* H - Weathered Ivory */}
        <text x="175" y="140" className="haikai-glyph" fill="url(#logoIvoryStone)">
          H
        </text>

        {/* A - Weathered Ivory */}
        <text x="350" y="140" className="haikai-glyph" fill="url(#logoIvoryStone)">
          A
        </text>

        {/* I - Blood-soaked Crimson */}
        <text x="490" y="140" className="haikai-glyph" fill="url(#logoBloodCrimson)">
          I
        </text>

        {/* K - Weathered Ivory */}
        <text x="635" y="140" className="haikai-glyph" fill="url(#logoIvoryStone)">
          K
        </text>

        {/* A - Weathered Ivory with Crimson Splattered Right Flank */}
        <text x="815" y="140" className="haikai-glyph" fill="url(#logoBloodA)">
          A
        </text>

        {/* I - Weathered Ivory */}
        <text x="965" y="140" className="haikai-glyph" fill="url(#logoIvoryStone)">
          I
        </text>

        {/* The Continuous Horizon Katana Blade Piercing Horizontal Center */}
        {/* Dark slit cut through stone */}
        <line x1="25" y1="142" x2="1175" y2="142" stroke="#000000" strokeWidth="2.5" opacity="0.8" />

        {/* Razor-thin steel blade with specular reflection */}
        <path
          d="M 15 140 Q 600 137 1185 140 Q 600 143 15 140 Z"
          fill="url(#logoSteelBlade)"
        />

        {/* Extended needle-sharp tips */}
        <polygon points="5,140 55,138.5 55,141.5" fill="#d2dbe6" />
        <circle cx="5" cy="140" r="1.2" fill="#ffffff" />
        <polygon points="1195,140 1145,138.5 1145,141.5" fill="#d2dbe6" />
        <circle cx="1195" cy="140" r="1.2" fill="#ffffff" />

        {/* Pure white specular center highlight */}
        <line x1="60" y1="140" x2="1140" y2="140" stroke="#ffffff" strokeWidth="0.9" opacity="0.95" />

        {/* Subtle blood splatter accents near I and right A */}
        <g fill="#a3191d" opacity="0.9">
          <circle cx="492" cy="166" r="2.5" />
          <circle cx="482" cy="180" r="1.8" />
          <circle cx="504" cy="112" r="2" />
          <circle cx="836" cy="168" r="2.2" />
          <circle cx="850" cy="184" r="1.5" />
        </g>
      </svg>
    </div>
  );
};
