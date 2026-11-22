import React from 'react';

// Custom Stylized Kidney Anatomical SVG Icon
export const KidneyIcon = ({ className = "w-6 h-6", filled = false }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Stylized Kidney Outline */}
    <path
      d="M16.5 3.5C13.5 3 10.5 4.5 9 7.5C7.5 10.5 8 13.5 7.5 15.5C7 17.5 5 18 5 19.5C5 21 6.5 22 9 22C13 22 19 19.5 19.5 13.5C20 7.5 19.5 4 16.5 3.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? "currentColor" : "none"}
      fillOpacity={filled ? "0.15" : "0"}
    />
    {/* Renal Hilum & Vessels (Glomerulus / Blood flow) */}
    <path
      d="M10 11.5C11 12 12.5 12 13 11"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M9.5 14C11 14.5 12.5 14 13.5 13"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="15" cy="8.5" r="1.2" fill="currentColor" />
  </svg>
);

// Rural Village Healthcare Emblem SVG
export const RuralVillageEmblem = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Rural Hut / Community Health Centre */}
    <path
      d="M3 11L12 4L21 11V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V11Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Red Cross / Health Emblem */}
    <path
      d="M12 10V16M9 13H15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Rural Ground Wave */}
    <path
      d="M1 21C5 20 7 22 12 21C17 20 19 22 23 21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Rural Hydration & Water Purity Drop
export const HydrationDrop = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2.5C12 2.5 5 11 5 16C5 19.866 8.13401 23 12 23C15.866 23 19 19.866 19 16C19 11 12 2.5 12 2.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 15C9 17 10.5 18.5 12.5 18.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Rural Kidney Health Banner Graphic
export const RuralKidneyBanner = ({ title, subtitle, badgeText = "Rural CKD Surveillance" }) => (
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-md border border-teal-700/50">
    {/* Background Decorative Rings & Renal Silhouettes */}
    <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
    <div className="absolute right-12 bottom-2 opacity-10 pointer-events-none text-emerald-200">
      <KidneyIcon className="w-48 h-48" filled />
    </div>

    <div className="relative z-10 max-w-2xl space-y-2">
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-700/60 border border-teal-500/40 text-teal-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
        <KidneyIcon className="w-3.5 h-3.5 text-emerald-300" />
        <span>{badgeText}</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
        {title}
      </h1>

      <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed max-w-xl">
        {subtitle}
      </p>

      {/* Primary Project Subtitle Badge */}
      <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-teal-200/80">
        <span className="flex items-center space-x-1 bg-black/20 px-2.5 py-1 rounded-lg">
          <RuralVillageEmblem className="w-3 h-3 text-emerald-300" />
          <span>Big Data–Driven Rural Health Risk Monitoring System</span>
        </span>
        <span className="hidden sm:inline">•</span>
        <span>24 Kaggle Renal Biomarkers</span>
      </div>
    </div>
  </div>
);
