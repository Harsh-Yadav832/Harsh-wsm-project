import React, { useEffect, useState } from 'react';
import { Search, Database, UploadCloud, Compass, Sparkles, BookOpen } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';

export default function Navbar({ onNavigate }) {
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        await api.checkHealth();
        if (mounted) setIsBackendHealthy(true);
      } catch (e) {
        if (mounted) setIsBackendHealthy(false);
      }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3559D8] to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Harsh Search Engine
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                  isBackendHealthy
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                }`}
                title={isBackendHealthy ? 'Backend API connected' : 'Connecting to Backend...'}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isBackendHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {isBackendHealthy ? 'API Active' : 'Connecting'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Web Search &amp; Mining
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
          <a
            href="#search"
            className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#3559D8] dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </a>
          <a
            href="#documents"
            className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#3559D8] dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Documents</span>
          </a>
          <a
            href="#index-explorer"
            className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#3559D8] dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Database className="w-4 h-4" />
            <span>Inverted Index</span>
          </a>
          <a
            href="#expansion"
            className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#3559D8] dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Query Expansion</span>
          </a>
          <a
            href="#upload"
            className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#3559D8] dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload</span>
          </a>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
