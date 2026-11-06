import React from 'react';
import { FileText, Eye, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function ResultCard({ result, onViewDocument }) {
  const getBadgeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-900/40';
      case 'DOCX':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900/40';
      case 'TXT':
      default:
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40';
    }
  };

  const scorePercentage = Math.round((result.score || 0) * 100);

  return (
    <div className="group bg-white dark:bg-[#1E293B] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[#3559D8]/40 dark:hover:border-indigo-500/40 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        {/* Title and ID */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getBadgeColor(
                result.file_type
              )}`}
            >
              {result.file_type || 'TXT'}
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              ID: {result.document_id}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#3559D8] dark:group-hover:text-indigo-400 transition-colors">
            {result.filename}
          </h3>
        </div>

        {/* Relevance Score Pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Relevance Score</span>
            </div>
            <div className="text-sm font-extrabold text-[#3559D8] dark:text-indigo-400 font-mono">
              {result.score ? result.score.toFixed(4) : '0.0000'}
            </div>
          </div>
        </div>
      </div>

      {/* Snippet with highlighted keywords */}
      <div className="my-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal bg-slate-50/60 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
        <div
          dangerouslySetInnerHTML={{ __html: result.snippet || 'No text snippet available.' }}
          className="prose-sm dark:prose-invert"
        />
      </div>

      {/* Footer controls & Matched terms */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-slate-500 dark:text-slate-400">
          {result.matched_terms && result.matched_terms.length > 0 && (
            <>
              <span className="font-medium text-slate-600 dark:text-slate-300">Matched terms:</span>
              {result.matched_terms.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-[#3559D8] dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40 font-mono text-[11px]"
                >
                  {t}
                </span>
              ))}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onViewDocument(result.document_id)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#3559D8] text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-[#3559D8] dark:hover:text-white font-medium transition-all shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Document</span>
        </button>
      </div>
    </div>
  );
}
