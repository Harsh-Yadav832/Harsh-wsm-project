import React, { useState } from 'react';
import { Clock, Filter, AlertCircle, FileSearch, Sparkles, ArrowUpDown } from 'lucide-react';
import ResultCard from './ResultCard';

export default function SearchResults({
  searchData,
  isLoading,
  error,
  onViewDocument,
  onSuggestionClick,
}) {
  const [sortBy, setSortBy] = useState('relevance');

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h4 className="text-lg font-bold text-red-900 dark:text-red-200">
            Search Request Failed
          </h4>
          <p className="text-sm text-red-700 dark:text-red-300 max-w-md mx-auto">
            {error || 'Unable to communicate with the Information Retrieval backend.'}
          </p>
        </div>
      </div>
    );
  }

  if (!searchData) {
    return null; // Initial state before searching
  }

  const { query, total_results = 0, execution_time_ms = 0, results = [] } = searchData;

  // Empty state
  if (total_results === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-[#3559D8] dark:text-indigo-400 mx-auto">
            <FileSearch className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No documents found for "{query}"
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try checking for spelling errors, using wildcard searches (e.g. <code className="text-[#3559D8] font-bold">prem*</code>), or exploring the Query Expansion tool below.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => onSuggestionClick && onSuggestionClick('napoleon*')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-700 dark:text-slate-300 hover:text-[#3559D8]"
            >
              Try Wildcard: napoleon*
            </button>
            <button
              onClick={() => onSuggestionClick && onSuggestionClick('lincoln')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-700 dark:text-slate-300 hover:text-[#3559D8]"
            >
              Try: lincoln
            </button>
            <button
              onClick={() => onSuggestionClick && onSuggestionClick('aryabhata')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-700 dark:text-slate-300 hover:text-[#3559D8]"
            >
              Try: aryabhata
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sorted results
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'relevance') {
      return (b.score || 0) - (a.score || 0);
    }
    if (sortBy === 'name') {
      return (a.filename || '').localeCompare(b.filename || '');
    }
    return 0;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Search Header Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Search results for: <span className="text-[#3559D8] dark:text-indigo-400">"{query}"</span>
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            <span>
              {total_results} {total_results === 1 ? 'matching document' : 'matching documents'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {execution_time_ms} ms
            </span>
            {searchData.query_type && (
              <>
                <span>•</span>
                <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold uppercase">
                  {searchData.query_type} Query
                </span>
              </>
            )}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3559D8]/30 font-medium"
          >
            <option value="relevance">Relevance Score</option>
            <option value="name">Document Name</option>
          </select>
        </div>
      </div>

      {/* Result Cards Stack */}
      <div className="space-y-4">
        {sortedResults.map((result) => (
          <ResultCard
            key={result.document_id}
            result={result}
            onViewDocument={onViewDocument}
          />
        ))}
      </div>
    </div>
  );
}
