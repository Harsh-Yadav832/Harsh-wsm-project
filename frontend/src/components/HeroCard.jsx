import React, { useState } from 'react';
import { Search } from 'lucide-react';
import HeroIllustration from './HeroIllustration';

export default function HeroCard({ onSearch, isLoading, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);

  const sampleChips = [
    'lincoln',
    '"fried chicken"',
    'napoleon*',
    'aryabhata',
    'odyssey NOT war',
    '"art of war"',
    'information retrieval',
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  const handleChipClick = (term) => {
    setQuery(term);
    onSearch(term);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-[#F4F8FE] to-[#E9F2FE] dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/90 border border-blue-100/80 dark:border-slate-800 p-6 sm:p-10 shadow-xs">
      
      {/* Decorative subtle wavy background shapes */}
      <div className="absolute right-0 bottom-0 pointer-events-none translate-x-12 translate-y-12 opacity-40 dark:opacity-10">
        <svg width="350" height="250" viewBox="0 0 350 250" fill="none">
          <path
            d="M0 120C80 80 180 200 350 140V250H0V120Z"
            fill="url(#waveGrad)"
          />
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="350" y2="250" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93C5FD" />
              <stop offset="1" stopColor="#3B82F6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
        
        {/* Left: 3D Illustration matching reference */}
        <div className="shrink-0 flex items-center justify-center">
          <HeroIllustration className="w-36 h-36 sm:w-44 sm:h-44" />
        </div>

        {/* Right: Content & Search Form */}
        <div className="flex-1 w-full text-center md:text-left space-y-3.5">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Search Documents{' '}
            <span className="text-[#2563EB] dark:text-blue-400">Intelligently</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
            A Web Search and Mining project to retrieve relevant information from a collection of documents using Information Retrieval techniques.
          </p>

          {/* Search Input Bar (rounded-full white pill with embedded Search button) */}
          <form onSubmit={handleSubmit} className="pt-2">
            <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-full border border-slate-200/90 dark:border-slate-700/80 shadow-xs focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15 p-1 pl-4 transition-all">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your documents... (e.g. lincoln, &quot;fried chicken&quot;, napoleon*, aryabhata)"
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none pr-3"
              />

              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm px-6 sm:px-8 py-2.5 rounded-full shadow-xs transition-colors"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Try searching: chips */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-1 text-[11px]">
              Try searching:
            </span>
            {sampleChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700 text-[#2563EB] dark:text-blue-300 border border-blue-100/90 dark:border-slate-700 font-medium text-[11px] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
