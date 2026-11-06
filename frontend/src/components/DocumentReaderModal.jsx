import React, { useEffect, useState } from 'react';
import { X, FileText, Download, Calendar, Hash, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function DocumentReaderModal({ docId, onClose }) {
  const [docData, setDocData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchDoc = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getDocument(docId);
        if (active) setDocData(data);
      } catch (err) {
        if (active) setError('Failed to load document text.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    if (docId) {
      fetchDoc();
    }

    return () => {
      active = false;
    };
  }, [docId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!docId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-[#3559D8] dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {docData?.filename || docId}
                </h3>
                {docData?.file_type && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {docData.file_type}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ID: {docId} {docData?.word_count ? `• ${docData.word_count} words` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close document reader"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Extracted Text */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-normal">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#3559D8]" />
              <p className="text-xs">Loading document extracted content...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : (
            <div className="whitespace-pre-wrap font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/50">
              {docData?.text || 'No text extracted.'}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>Normalized &amp; Positional Indexed</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
