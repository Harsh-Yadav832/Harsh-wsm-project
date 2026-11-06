import React from 'react';
import { Award, GraduationCap, Sparkles } from 'lucide-react';

export default function ProjectIntroCard() {
  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4">
      <div className="relative overflow-hidden bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-7 transition-all">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50/70 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-50/50 dark:bg-blue-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Project Branding */}
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-[#3559D8] dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Academic Capstone Assignment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              <span className="text-[#3559D8] dark:text-indigo-400">Harsh Search Engine</span>
            </h1>
            <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
              Web Search Mining Project
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              An end-to-end Information Retrieval system featuring positional inverted indexing, 
              phrase search, wildcard pattern matching, Boolean logic, and TF-IDF relevance scoring.
            </p>
          </div>

          {/* Right: Project Guide Box (NO Team section, individual project) */}
          <div className="w-full md:w-auto bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-4 sm:px-6 sm:py-4 flex items-center gap-4 shrink-0 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-[#3559D8] dark:text-indigo-400 shrink-0 border border-indigo-200 dark:border-indigo-800/60">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                PROJECT GUIDE
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Prof. Rakesh Balbantaray
              </span>
              <span className="block text-xs text-slate-600 dark:text-slate-300 font-medium">
                Information Retrieval &amp; Data Mining
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
