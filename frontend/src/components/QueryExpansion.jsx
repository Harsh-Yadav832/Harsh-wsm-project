import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Search, HelpCircle } from 'lucide-react';
import api from '../services/api';

export default function QueryExpansion({ onSelectTerm }) {
  const [inputQuery, setInputQuery] = useState('');
  const [expansionData, setExpansionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExpand = async (e) => {
    e?.preventDefault();
    if (!inputQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.expandQuery(inputQuery.trim());
      setExpansionData(data);
    } catch (err) {
      setError('Failed to fetch query expansions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (term) => {
    if (onSelectTerm) {
      onSelectTerm(term);
    }
  };

  return (
    <div id="expansion" className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-[#3559D8] dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Query Expansion
            </h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Discover related terms, synonyms, and morphological variants using WordNet and semantic lexicons to boost search recall.
          </p>
        </div>

        {/* Input form */}
        <form onSubmit={handleExpand} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Enter a keyword to expand (e.g. lincoln, sanders, napoleon, aryabhata)..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3559D8]/30 focus:border-[#3559D8] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3559D8] hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Expanding...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Expand Query</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 mb-4">{error}</p>
        )}

        {/* Expansion Chips Result */}
        {expansionData && (
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Original query: <span className="text-[#3559D8] font-bold">"{expansionData.original_query}"</span>
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                Engine: {expansionData.engine || 'WordNet / IR Lexicon'}
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5 font-medium">
                Click any related term to search it immediately:
              </p>

              {expansionData.expanded_terms && expansionData.expanded_terms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {expansionData.expanded_terms.map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChipClick(term)}
                      className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#3559D8] dark:hover:border-indigo-500 text-slate-800 dark:text-slate-200 hover:text-[#3559D8] dark:hover:text-indigo-400 font-medium text-xs shadow-sm transition-all"
                    >
                      <Search className="w-3 h-3 text-slate-400 group-hover:text-[#3559D8]" />
                      <span>{term}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#3559D8]" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No direct synonyms found for this term.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
