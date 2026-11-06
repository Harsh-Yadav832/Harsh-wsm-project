import React from 'react';
import { BarChart2, FileText, Layers, Database, Search, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function StatisticsView({ stats, documents = [], isLoading }) {
  const totalDocs = stats?.total_documents || 0;
  const totalVocab = stats?.total_vocabulary || 0;
  const totalTokens = stats?.total_tokens || 0;
  const totalSearches = stats?.total_searches || 0;

  const avgTokens = totalDocs > 0 ? Math.round(totalTokens / totalDocs) : 0;
  const vocabDensity = totalTokens > 0 ? ((totalVocab / totalTokens) * 100).toFixed(1) : 0;

  // File type distribution
  const typeCounts = documents.reduce((acc, doc) => {
    const t = doc.file_type || 'TXT';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Documents</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {isLoading ? '...' : totalDocs.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">In active inverted index</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Vocabulary Size</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {isLoading ? '...' : totalVocab.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Unique normalized terms</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Indexed Tokens</span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {isLoading ? '...' : totalTokens.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Positional tokens recorded</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Queries Served</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {isLoading ? '...' : totalSearches.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Real-time searches processed</p>
        </div>
      </div>

      {/* Analytical Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Corpus Breakdown */}
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center space-x-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Corpus Lexical Metrics
            </h3>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Avg Tokens Per Document</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                {avgTokens.toLocaleString()} tokens
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Lexical Diversity Ratio</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                {vocabDensity}%
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Indexing Pipeline Model</span>
              <span className="font-semibold text-[#2563EB] dark:text-blue-400">
                Positional Inverted Index
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Relevance Scoring Algorithm</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Logarithmic TF-IDF + Length Norm
              </span>
            </div>
          </div>
        </div>

        {/* File Format Distribution */}
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center space-x-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Document Format Distribution
            </h3>
          </div>

          <div className="space-y-4">
            {['TXT', 'PDF', 'DOCX'].map((type) => {
              const count = typeCounts[type] || 0;
              const percent = totalDocs > 0 ? Math.round((count / totalDocs) * 100) : 0;
              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          type === 'PDF'
                            ? 'bg-red-500'
                            : type === 'DOCX'
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      {type} Documents
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        type === 'PDF'
                          ? 'bg-red-500'
                          : type === 'DOCX'
                          ? 'bg-blue-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
