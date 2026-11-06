import React, { useState } from 'react';
import { Search, X, Loader2, Sparkles, Filter } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);

  const suggestions = [
    { label: 'lincoln', type: 'Term' },
    { label: '"fried chicken"', type: 'Phrase' },
    { label: 'napoleon*', type: 'Wildcard' },
    { label: 'aryabhata AND astronomy', type: 'Boolean' },
    { label: 'odyssey NOT war', type: 'Boolean' },
    { label: '"art of war"', type: 'Phrase' },
    { label: 'information retrieval', type: 'Multi-term' },
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleSuggestionClick = (item) => {
    setQuery(item);
    onSearch(item);
  };

  return (
    <div id="search" className="w-full max-w-4xl mx-auto px-4 py-8 text-center">
      {/* Hero Headings */}
      <div className="mb-8 space-y-3">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Search your <span className="text-[#3559D8] dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-900 underline-offset-8">documents</span>.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
          Discover information across your document collection using intelligent Information Retrieval techniques.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-5">
        <div className="relative flex items-center shadow-lg shadow-indigo-500/5 rounded-2xl bg-white dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700/80 hover:border-[#3559D8]/50 focus-within:border-[#3559D8] focus-within:ring-4 focus-within:ring-[#3559D8]/10 transition-all overflow-hidden">
          
          <div className="pl-5 text-slate-400 dark:text-slate-500">
            <Search className="w-6 h-6 text-slate-400" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents... (e.g. lincoln, &quot;fried chicken&quot;, napoleon*, aryabhata AND astronomy)"
            className="w-full py-4 sm:py-4.5 px-4 text-base sm:text-lg bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            disabled={isLoading}
          />

          {/* Clear button */}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Action button */}
          <div className="pr-2 sm:pr-3">
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#3559D8] hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm sm:text-base shadow-md shadow-indigo-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Search suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-[#3559D8]" /> Try examples:
        </span>
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestionClick(item.label)}
            className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#3559D8] dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700 transition-all font-mono text-[11px]"
          >
            <span>{item.label}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white dark:bg-slate-900 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 border border-slate-200 dark:border-slate-700">
              {item.type}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
