import React from 'react';
import {
  Home,
  Search,
  Folder,
  UploadCloud,
  Network,
  Layers,
  BarChart2,
  Info,
  X,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen = false,
  onClose,
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'documents', label: 'Document Library', icon: Folder },
    { id: 'upload', label: 'Upload Documents', icon: UploadCloud },
    { id: 'expansion', label: 'Query Expansion', icon: Network },
    { id: 'index', label: 'Inverted Index Explorer', icon: Layers },
    { id: 'statistics', label: 'Statistics', icon: BarChart2 },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#1E293B] border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Branding */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => {
                setActiveTab('home');
                if (onClose) onClose();
              }}
            >
              {/* Brand Search Icon Circle */}
              <div className="w-10 h-10 rounded-full border-2 border-[#2563EB] flex items-center justify-center text-[#2563EB] bg-blue-50/50 dark:bg-blue-950/40 shrink-0">
                <Search className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-bold text-base text-slate-900 dark:text-white leading-tight tracking-tight">
                  Harsh
                  <span className="block text-slate-900 dark:text-white font-bold">Search Engine</span>
                </h1>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Web Search &amp; Mining
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center: Navigation List */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#EEF4FF] dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 shrink-0 ${
                    isActive ? 'text-[#2563EB] dark:text-blue-400 stroke-[2.5]' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom: Project Guide Info Box */}
        <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="bg-[#F8FAFC] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-200/70 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Project Guide
              </span>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                Prof. Rakesh Balbantaray
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
