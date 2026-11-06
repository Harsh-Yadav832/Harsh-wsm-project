import React, { useState } from 'react';
import { BookOpen, FileText, Calendar, Eye, HardDrive, RefreshCw } from 'lucide-react';
import DocumentReaderModal from './DocumentReaderModal';

export default function DocumentCollection({ documents, isLoading, onRefresh, onViewDocument }) {
  const [internalDocId, setInternalDocId] = useState(null);

  const handleRead = (docId) => {
    if (onViewDocument) {
      onViewDocument(docId);
    } else {
      setInternalDocId(docId);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getBadgeStyle = (type) => {
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

  return (
    <div id="documents" className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-[#3559D8] dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Indexed Document Collection
            </h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Browse currently indexed public domain literature and technical notes ({documents?.length || 0} documents).
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Grid of Documents */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 h-44 animate-pulse"
            />
          ))}
        </div>
      ) : documents?.length === 0 ? (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500">
          No documents found in the collection. Upload some documents to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {documents.map((doc) => (
            <div
              key={doc.doc_id}
              className="group bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#3559D8]/30 dark:hover:border-indigo-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyle(
                      doc.file_type
                    )}`}
                  >
                    {doc.file_type || 'TXT'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {doc.doc_id}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#3559D8] dark:group-hover:text-indigo-400 transition-colors">
                  {doc.filename}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                  {doc.preview || 'No preview available.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatBytes(doc.file_size)} • {doc.word_count || 0} tokens
                </span>

                <button
                  type="button"
                  onClick={() => handleRead(doc.doc_id)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-[#3559D8] dark:text-indigo-400 hover:bg-[#3559D8] hover:text-white font-semibold transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reader Modal (if not handled externally) */}
      {!onViewDocument && internalDocId && (
        <DocumentReaderModal
          docId={internalDocId}
          onClose={() => setInternalDocId(null)}
        />
      )}
    </div>
  );
}
