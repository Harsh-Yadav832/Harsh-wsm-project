import React, { useState, useEffect } from 'react';
import ProjectIntroCard from '../components/ProjectIntroCard';
import StatisticsCards from '../components/StatisticsCards';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import QueryExpansion from '../components/QueryExpansion';
import DocumentCollection from '../components/DocumentCollection';
import InvertedIndexExplorer from '../components/InvertedIndexExplorer';
import UploadDocument from '../components/UploadDocument';
import DocumentReaderModal from '../components/DocumentReaderModal';
import api from '../services/api';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isDocsLoading, setIsDocsLoading] = useState(true);

  // Search state
  const [searchData, setSearchData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');

  // Reader state
  const [modalDocId, setModalDocId] = useState(null);

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
      const data = await api.search(queryStr);
      setSearchData(data);
      // Refresh stats after search count increment
      const updatedStats = await api.getStats();
      setStats(updatedStats);

      // Smooth scroll to search results
      setTimeout(() => {
        const resultsEl = document.getElementById('search-results-anchor');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } catch (err) {
      setSearchError(
        err.response?.data?.error ||
          err.message ||
          'Failed to perform search. Ensure the Python backend is running.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleTermSelect = (term) => {
    setCurrentQuery(term);
    handleSearch(term);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleUploadSuccess = () => {
    loadStatsAndDocs();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Project Introduction Card */}
      <ProjectIntroCard />

      {/* 2. Statistics Dashboard */}
      <StatisticsCards stats={stats} isLoading={isStatsLoading} />

      {/* 3. Hero & Prominent Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        isLoading={isSearching}
        initialQuery={currentQuery}
      />

      {/* Anchor for results */}
      <div id="search-results-anchor" />

      {/* 4. Search Results */}
      {(searchData || isSearching || searchError) && (
        <SearchResults
          searchData={searchData}
          isLoading={isSearching}
          error={searchError}
          onViewDocument={(docId) => setModalDocId(docId)}
          onSuggestionClick={handleTermSelect}
        />
      )}

      {/* 5. Document Collection */}
      <DocumentCollection
        documents={documents}
        isLoading={isDocsLoading}
        onRefresh={loadStatsAndDocs}
        onViewDocument={(docId) => setModalDocId(docId)}
      />

      {/* 6. Query Expansion Tool */}
      <QueryExpansion onSelectTerm={handleTermSelect} />

      {/* 7. Inverted Index Explorer */}
      <InvertedIndexExplorer onTermClick={handleTermSelect} />

      {/* 8. Document Upload Section */}
      <UploadDocument onUploadSuccess={handleUploadSuccess} />

      {/* 9. Global Document Reader Modal */}
      {modalDocId && (
        <DocumentReaderModal
          docId={modalDocId}
          onClose={() => setModalDocId(null)}
        />
      )}
    </div>
  );
}
