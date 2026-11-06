import React from 'react';
import { FileText, ChevronRight, File } from 'lucide-react';

export default function RecentDocumentsTable({
  documents = [],
  isLoading = false,
  onViewAll,
  onOpenDocument,
}) {
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '1.2 KB';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getBadgeStyle = (type) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return 'bg-red-50 text-red-500 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900/40';
      case 'DOCX':
        return 'bg-blue-50 text-blue-500 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/40';
      case 'TXT':
      default:
        return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/40';
    }
  };

  // Limit to top 5 recent documents for the table
  const recentDocs = documents.slice(0, 5);

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Recent Documents
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center space-x-1 text-xs sm:text-sm font-semibold text-[#2563EB] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
              <th className="py-2.5 px-3 w-10 text-center font-bold">#</th>
              <th className="py-2.5 px-3 font-bold">Document Name</th>
              <th className="py-2.5 px-3 font-bold text-center">Type</th>
              <th className="py-2.5 px-3 font-bold">Size</th>
              <th className="py-2.5 px-3 font-bold">Indexed On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400">
                  Loading recent documents...
                </td>
              </tr>
            ) : recentDocs.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400">
                  No documents found. Upload documents to get started.
                </td>
              </tr>
            ) : (
              recentDocs.map((doc, idx) => (
                <tr
                  key={doc.doc_id || idx}
                  onClick={() => onOpenDocument && onOpenDocument(doc.doc_id)}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  {/* # */}
                  <td className="py-3 px-3 text-center text-slate-400 font-semibold">
                    {idx + 1}
                  </td>

                  {/* Document Name */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2.5">
                      {/* Document icon */}
                      <span className="p-1 rounded bg-red-50 text-red-500 shrink-0">
                        <File className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {doc.filename}
                      </span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyle(
                        doc.file_type
                      )}`}
                    >
                      {doc.file_type || 'TXT'}
                    </span>
                  </td>

                  {/* Size */}
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-medium">
                    {formatBytes(doc.file_size)}
                  </td>

                  {/* Indexed On */}
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-medium text-xs">
                    {doc.indexed_at ? doc.indexed_at.split(' ')[0] : '06 Nov 2026'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
