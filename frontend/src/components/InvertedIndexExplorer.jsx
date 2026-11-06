import React, { useState, useEffect } from 'react';
import { Database, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Hash, Layers, FileCode } from 'lucide-react';
import api from '../services/api';

export default function InvertedIndexExplorer({ onTermClick }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [indexData, setIndexData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIndexData = async (query = filterQuery, currentPage = page) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getInvertedIndex({
        query,
        page: currentPage,
        pageSize,
      });
      setIndexData(data);
    } catch (err) {
      setError('Failed to fetch inverted index data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIndexData(filterQuery, page);
  }, [page, pageSize]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setPage(1);
    fetchIndexData(filterQuery, 1);
  };

  return (
    <div id="index-explorer" className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all">
        
        {/* Header with Expand / Collapse Toggle */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-6 sm:p-7 flex items-center justify-between cursor-pointer select-none border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-[#3559D8] dark:text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Explore Inverted Index
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-50 dark:bg-indigo-950/80 text-[#3559D8] dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                  WSM Core Feature
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect how terms map to documents and their token positions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-500 dark:text-slate-400">
              {indexData?.vocabulary_size ? `${indexData.vocabulary_size} Unique Terms` : 'Positional Index'}
            </span>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="p-6">
            
            {/* Filter and Metadata Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-5">
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter terms in index..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3559D8]/30 focus:border-[#3559D8]"
                />
              </form>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 self-end sm:self-auto font-medium">
                <span>
                  Showing <strong className="text-slate-800 dark:text-slate-200">{indexData?.total_terms || 0}</strong> matching terms
                </span>
              </div>
            </div>

            {/* Inverted Index Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Term</th>
                    <th className="py-3 px-4 font-bold">Document ID</th>
                    <th className="py-3 px-4 font-bold">Document Frequency</th>
                    <th className="py-3 px-4 font-bold">Positions [ pos1, pos2, ... ]</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-xs">
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-slate-400 font-sans">
                        Loading inverted index mappings...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-red-500 font-sans">
                        {error}
                      </td>
                    </tr>
                  ) : !indexData?.terms || indexData.terms.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-400 font-sans">
                        No index postings match the filter.
                      </td>
                    </tr>
                  ) : (
                    indexData.terms.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors group"
                      >
                        {/* Term */}
                        <td className="py-3 px-4 font-bold text-[#3559D8] dark:text-indigo-400">
                          <button
                            type="button"
                            onClick={() => onTermClick && onTermClick(row.term)}
                            className="hover:underline text-left"
                            title="Click to search this term"
                          >
                            {row.term}
                          </button>
                        </td>

                        {/* Doc ID */}
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                            {row.doc_id}
                          </span>
                        </td>

                        {/* Doc Frequency */}
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {row.doc_freq}
                          </span>{' '}
                          doc(s)
                        </td>

                        {/* Positions */}
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-md truncate">
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                            [
                            {row.positions.slice(0, 10).join(', ')}
                            {row.positions.length > 10 ? `, +${row.positions.length - 10} more` : ''}
                            ]
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {indexData && indexData.total_pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <span>
                  Page <strong className="text-slate-800 dark:text-slate-200">{page}</strong> of{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{indexData.total_pages}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    disabled={page <= 1 || isLoading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    disabled={page >= indexData.total_pages || isLoading}
                    onClick={() => setPage((p) => Math.min(indexData.total_pages, p + 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
