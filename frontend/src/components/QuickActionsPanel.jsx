import React from 'react';
import { Zap, UploadCloud, Network, Layers, Folder, ChevronRight } from 'lucide-react';

export default function QuickActionsPanel({ onNavigate }) {
  const actions = [
    {
      id: 'upload',
      title: 'Upload Documents',
      subtitle: 'Add PDF, DOCX or TXT files',
      icon: UploadCloud,
    },
    {
      id: 'expansion',
      title: 'Query Expansion',
      subtitle: 'Find related terms and synonyms',
      icon: Network,
    },
    {
      id: 'index',
      title: 'Inverted Index Explorer',
      subtitle: 'Browse term-document mappings',
      icon: Layers,
    },
    {
      id: 'documents',
      title: 'Document Library',
      subtitle: 'View and read all indexed documents',
      icon: Folder,
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center space-x-2.5 pb-4 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Quick Actions
        </h3>
      </div>

      {/* Action Items List */}
      <div className="space-y-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => onNavigate && onNavigate(act.id)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700 bg-[#F9FBFE] dark:bg-slate-900/40 hover:bg-[#EEF4FF] dark:hover:bg-slate-800/80 transition-all text-left group"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100/70 dark:border-blue-900/40 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors truncate">
                    {act.title}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">
                    {act.subtitle}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
