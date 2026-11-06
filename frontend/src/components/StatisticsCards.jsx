import React from 'react';
import { FileText, Layers, Database, Search } from 'lucide-react';

export default function StatisticsCards({ stats, isLoading }) {
  const cards = [
    {
      title: 'Indexed Documents',
      value: stats?.total_documents ?? 0,
      icon: FileText,
    },
    {
      title: 'Unique Terms',
      value: stats?.total_vocabulary ?? 0,
      icon: Layers,
    },
    {
      title: 'Total Tokens',
      value: stats?.total_tokens ?? 0,
      icon: Database,
    },
    {
      title: 'Searches Performed',
      value: stats?.total_searches ?? 0,
      icon: Search,
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-blue-200 dark:hover:border-slate-700 transition-all flex items-center space-x-4"
            >
              {/* Icon in soft blue container */}
              <div className="w-12 h-12 rounded-xl bg-[#EEF4FF] dark:bg-blue-950/60 flex items-center justify-center text-[#2563EB] dark:text-blue-400 border border-blue-100/80 dark:border-blue-900/40 shrink-0">
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>

              {/* Number and Label */}
              <div className="min-w-0">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {isLoading ? '...' : card.value.toLocaleString()}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {card.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
