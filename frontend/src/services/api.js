import axios from 'axios';

// Vite proxy forwards /api to backend http://127.0.0.1:5000 in dev mode,
// or fallback directly to VITE_API_URL or http://localhost:5000/api
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const api = {
  // Health check
  checkHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Statistics
  getStats: async () => {
    const res = await apiClient.get('/stats');
    return res.data;
  },

  // Document collection
  getDocuments: async () => {
    const res = await apiClient.get('/documents');
    return res.data;
  },

  getDocument: async (docId) => {
    const res = await apiClient.get(`/documents/${encodeURIComponent(docId)}`);
    return res.data;
  },

  // Document upload (multipart/form-data)
  uploadDocument: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return res.data;
  },

  // Search
  search: async (query) => {
    const res = await apiClient.post('/search', { query });
    return res.data;
  },

  // Query expansion
  expandQuery: async (query) => {
    const res = await apiClient.post('/expand', { query });
    return res.data;
  },

  // Inverted index explorer
  getInvertedIndex: async ({ query = '', page = 1, pageSize = 25 } = {}) => {
    const res = await apiClient.get('/index', {
      params: { query, page, page_size: pageSize },
    });
    return res.data;
  },

  getTermPostings: async (term) => {
    const res = await apiClient.get(`/index/${encodeURIComponent(term)}`);
    return res.data;
  },
};

export default api;
