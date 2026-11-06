import React from 'react';
import HeroCard from './HeroCard';
import StatisticsCards from './StatisticsCards';
import RecentDocumentsTable from './RecentDocumentsTable';
import QuickActionsPanel from './QuickActionsPanel';
import SearchResults from './SearchResults';

export default function DashboardHome({
  stats,
  isStatsLoading,
  documents,
  isDocsLoading,
  searchData,
  isSearching,
  searchError,
  onSearch,
  onNavigate,
  onOpenDocument,
}) {
  return (
    <div className="space-y-6 sm:space-y-7 pb-10">
      {/* 1. Hero Card matching screenshot */}
      <HeroCard onSearch={onSearch} isLoading={isSearching} />

      {/* 1.5 If a search was performed from the Hero, show the Search Results right below the Hero! */}
      {(searchData || isSearching || searchError) && (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs animate-fadeIn">
          <SearchResults
            searchData={searchData}
            isLoading={isSearching}
            error={searchError}
            onViewDocument={onOpenDocument}
            onSuggestionClick={(term) => onSearch(term)}
          />
        </div>
      )}

      {/* 2. 4 Statistics Cards in a row */}
      <StatisticsCards stats={stats} isLoading={isStatsLoading} />

      {/* 3. Lower Section: 2 Columns (Recent Documents & Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Recent Documents (~65% = 8 cols) */}
        <div className="lg:col-span-8">
          <RecentDocumentsTable
            documents={documents}
            isLoading={isDocsLoading}
            onViewAll={() => onNavigate('documents')}
            onOpenDocument={onOpenDocument}
          />
        </div>

        {/* Right Column: Quick Actions (~35% = 4 cols) */}
        <div className="lg:col-span-4">
          <QuickActionsPanel onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
