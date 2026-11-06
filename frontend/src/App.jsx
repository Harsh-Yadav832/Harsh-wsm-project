import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardHome from './components/DashboardHome';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import DocumentCollection from './components/DocumentCollection';
import UploadDocument from './components/UploadDocument';
import QueryExpansion from './components/QueryExpansion';
import InvertedIndexExplorer from './components/InvertedIndexExplorer';
import StatisticsView from './components/StatisticsView';
import DocumentReaderModal from './components/DocumentReaderModal';
import api from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global corpus and stats data
  const [stats, setStats] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isDocsLoading, setIsDocsLoading] = useState(true);

  // Search state
  const [searchData, setSearchData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');

  // Reader Modal state
  const [modalDocId, setModalDocId] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadStatsAndDocs = async () => {
    setIsStatsLoading(true);
    setIsDocsLoading(true);
    try {
      const [statsRes, docsRes] = await Promise.all([
        api.getStats(),
        api.getDocuments(),
      ]);
      setStats(statsRes);
      setDocuments(docsRes.documents || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsStatsLoading(false);
      setIsDocsLoading(false);
    }
  };

  useEffect(() => {
    loadStatsAndDocs();
  }, []);

  const handleSearch = async (queryStr) => {
    if (!queryStr || !queryStr.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setCurrentQuery(queryStr);

    try {
      const data = await api.search(queryStr.trim());
      setSearchData(data);
      // Update searches counter
      const updatedStats = await api.getStats();
      setStats(updatedStats);
    } catch (err) {
      setSearchError(
        err.response?.data?.error ||
          err.message ||
          'Failed to execute search. Please verify backend connection.'
      );
      showToast('Search query failed', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUploadSuccess = (response) => {
    loadStatsAndDocs();
    showToast(response?.message || 'Document indexed successfully!');
  };

  const tabTitles = {
    home: 'Home',
    search: 'Search Documents',
    documents: 'Document Library',
    upload: 'Upload Documents',
    expansion: 'Query Expansion',
    index: 'Inverted Index Explorer',
    statistics: 'Statistics',
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0F172A] text-[#172033] dark:text-slate-100 font-sans transition-colors">
      {/* 1. Left Vertical Sidebar (Fixed on desktop, drawer on mobile) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0 min-h-screen">
        {/* Top Navbar */}
        <TopNavbar
          pageTitle={tabTitles[activeTab] || 'Home'}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
          {/* TAB 1: HOME (Exact match to reference image!) */}
          {activeTab === 'home' && (
            <DashboardHome
              stats={stats}
              isStatsLoading={isStatsLoading}
              documents={documents}
              isDocsLoading={isDocsLoading}
              searchData={searchData}
              isSearching={isSearching}
              searchError={searchError}
              onSearch={handleSearch}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDocument={(docId) => setModalDocId(docId)}
            />
          )}

          {/* TAB 2: SEARCH */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <SearchBar
                onSearch={handleSearch}
                isLoading={isSearching}
                initialQuery={currentQuery}
              />
              <SearchResults
                searchData={searchData}
                isLoading={isSearching}
                error={searchError}
                onViewDocument={(docId) => setModalDocId(docId)}
                onSuggestionClick={handleSearch}
              />
            </div>
          )}

          {/* TAB 3: DOCUMENT LIBRARY */}
          {activeTab === 'documents' && (
            <DocumentCollection
              documents={documents}
              isLoading={isDocsLoading}
              onRefresh={loadStatsAndDocs}
              onViewDocument={(docId) => setModalDocId(docId)}
            />
          )}

          {/* TAB 4: UPLOAD DOCUMENTS */}
          {activeTab === 'upload' && (
            <UploadDocument onUploadSuccess={handleUploadSuccess} />
          )}

          {/* TAB 5: QUERY EXPANSION */}
          {activeTab === 'expansion' && (
            <QueryExpansion
              onSelectTerm={(term) => {
                handleSearch(term);
                setActiveTab('search');
              }}
            />
          )}

          {/* TAB 6: INVERTED INDEX EXPLORER */}
          {activeTab === 'index' && (
            <InvertedIndexExplorer
              onTermClick={(term) => {
                handleSearch(term);
                setActiveTab('search');
              }}
            />
          )}

          {/* TAB 7: STATISTICS */}
          {activeTab === 'statistics' && (
            <StatisticsView
              stats={stats}
              documents={documents}
              isLoading={isStatsLoading}
            />
          )}
        </main>
      </div>

      {/* Global Document Reader Modal */}
      {modalDocId && (
        <DocumentReaderModal
          docId={modalDocId}
          onClose={() => setModalDocId(null)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center space-x-2 animate-bounce ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
