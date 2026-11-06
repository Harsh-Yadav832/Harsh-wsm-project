import React from 'react';
import { Search, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] py-10 transition-colors mt-12">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#3559D8] text-white flex items-center justify-center shadow-sm">
            <Search className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
              Harsh Search Engine
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Web Search and Mining (WSM) Assignment
            </p>
          </div>
        </div>

        {/* Academic Citation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <GraduationCap className="w-4 h-4 text-[#3559D8] shrink-0" />
          <span>
            Project Guide:{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">
              Prof. Rakesh Balbantaray
            </strong>
          </span>
        </div>

        {/* Minimal Copyright */}
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Built with React, Python Flask &amp; Information Retrieval
        </div>
      </div>
    </footer>
  );
}
