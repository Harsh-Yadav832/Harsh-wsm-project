import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function UploadDocument({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fileInputRef = useRef(null);

  const allowedExtensions = ['.txt', '.pdf', '.docx'];

  const validateFile = (file) => {
    if (!file) return false;
    const name = file.name.toLowerCase();
    const isSupported = allowedExtensions.some((ext) => name.endsWith(ext));
    if (!isSupported) {
      setErrorMessage(`Unsupported format. Please upload PDF, DOCX, or TXT documents.`);
      return false;
    }
    if (file.size > 16 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 16MB limit.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setStatusMessage(null);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setStatusMessage(null);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await api.uploadDocument(selectedFile, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      setStatusMessage({
        text: response.message || `Indexed "${selectedFile.name}" successfully!`,
        tokens: response.total_tokens,
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (onUploadSuccess) {
        onUploadSuccess(response);
      }
    } catch (err) {
      const errDetail =
        err.response?.data?.error || err.message || 'Failed to process document.';
      setErrorMessage(errDetail);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div id="upload" className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-[#3559D8] dark:text-indigo-400">
              <UploadCloud className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Add New Document to Corpus
            </h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Upload text files, research papers, or literary texts in PDF, DOCX, or TXT format.
            The pipeline tokenizes, normalizes, and indexes your document in real-time.
          </p>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#3559D8] bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-[#3559D8]/50 bg-slate-50/50 dark:bg-slate-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#3559D8] dark:text-indigo-400">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                Drag &amp; drop your file here, or{' '}
                <span className="text-[#3559D8] dark:text-indigo-400 underline decoration-indigo-200 underline-offset-4">
                  browse files
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Supports PDF, DOCX, and TXT up to 16MB
              </p>
            </div>
          </div>
        </div>

        {/* Selected file summary */}
        {selectedFile && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-[#3559D8] dark:text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {formatFileSize(selectedFile.size)} • Ready to index
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => setSelectedFile(null)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUploading}
                onClick={handleUpload}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#3559D8] hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing &amp; Indexing...</span>
                  </>
                ) : (
                  <>
                    <span>Extract &amp; Index</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {isUploading && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Uploading &amp; Extracting Inverted Postings...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3559D8] rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Alert */}
        {statusMessage && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-emerald-900 dark:text-emerald-200">
                {statusMessage.text}
              </p>
              <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                The document has been parsed and integrated into the positional inverted index. You can search for terms immediately.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-red-900 dark:text-red-200">Upload Failed</p>
              <p className="text-red-700 dark:text-red-400 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
