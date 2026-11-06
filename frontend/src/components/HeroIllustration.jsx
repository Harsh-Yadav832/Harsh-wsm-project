import React from 'react';

export default function HeroIllustration({ className = "w-32 h-32 sm:w-40 sm:h-40" }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Soft shadow under sheets */}
        <ellipse cx="78" cy="138" rx="55" ry="10" fill="#93C5FD" fillOpacity="0.25" />

        {/* Back sheet (tilted left, soft light blue) */}
        <g transform="rotate(-8 70 80)">
          <rect
            x="36"
            y="26"
            width="68"
            height="90"
            rx="8"
            fill="#93C5FD"
            fillOpacity="0.75"
          />
          {/* Subtle line sketches on back sheet */}
          <rect x="46" y="44" width="36" height="4" rx="2" fill="#60A5FA" fillOpacity="0.6" />
          <rect x="46" y="54" width="48" height="4" rx="2" fill="#60A5FA" fillOpacity="0.6" />
          <rect x="46" y="64" width="42" height="4" rx="2" fill="#60A5FA" fillOpacity="0.6" />
        </g>

        {/* Front sheet (pure white with subtle shadow and crisp blue lines) */}
        <g transform="rotate(2 78 80)">
          <rect
            x="48"
            y="28"
            width="70"
            height="94"
            rx="8"
            fill="#FFFFFF"
            stroke="#DBEAFE"
            strokeWidth="1.5"
          />
          {/* Document header line */}
          <rect x="58" y="42" width="32" height="5" rx="2.5" fill="#3B82F6" />
          {/* Document text lines */}
          <rect x="58" y="54" width="50" height="3" rx="1.5" fill="#94A3B8" />
          <rect x="58" y="62" width="45" height="3" rx="1.5" fill="#CBD5E1" />
          <rect x="58" y="70" width="50" height="3" rx="1.5" fill="#CBD5E1" />
          <rect x="58" y="78" width="38" height="3" rx="1.5" fill="#CBD5E1" />
          <rect x="58" y="86" width="46" height="3" rx="1.5" fill="#CBD5E1" />
          <rect x="58" y="94" width="28" height="3" rx="1.5" fill="#CBD5E1" />
        </g>

        {/* 3D Glass Magnifying Glass */}
        <g transform="translate(4, 2)">
          {/* Lens Glass Circle with cyan-blue gradient */}
          <defs>
            <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>

          {/* Lens Rim */}
          <circle
            cx="100"
            cy="76"
            r="23"
            fill="url(#lensGrad)"
            stroke="url(#rimGrad)"
            strokeWidth="5"
          />

          {/* Lens Glass Highlight reflection */}
          <path
            d="M 87 64 A 18 18 0 0 1 113 64"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Handle */}
          <path
            d="M 117 92 L 138 114"
            stroke="url(#handleGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
