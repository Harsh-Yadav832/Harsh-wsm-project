import React from 'react';
import { Menu, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function TopNavbar({
  pageTitle = 'Home',
  onOpenSidebar,
}) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Current page title */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {pageTitle}
        </h2>
      </div>

      {/* Right: Dark mode toggle & User Profile */}
      <div className="flex items-center space-x-3">
        {/* Dark Mode Toggle Pill matching reference image */}
        <button
          onClick={toggleTheme}
          type="button"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* User profile avatar circle */}
        <div
          className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs"
          title="Harsh (Student / Author)"
        >
          <User className="w-4.5 h-4.5" />
        </div>
      </div>
    </header>
  );
}
