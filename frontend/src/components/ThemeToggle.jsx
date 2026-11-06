import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3559D8]/30"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle color theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
