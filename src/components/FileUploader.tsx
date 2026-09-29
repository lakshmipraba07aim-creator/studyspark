'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Check, AlertCircle, FileCheck2 } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File) => {
    setErrorMsg(null);

    // Max 10MB limit
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMsg('File size exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }

    const validExtensions = ['.pdf', '.txt', '.md'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!hasValidExt && file.type !== 'application/pdf' && !file.type.startsWith('text/')) {
      setErrorMsg('Invalid file format. Please upload a PDF or TXT file.');
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.md,application/pdf,text/plain"
        onChange={handleFileChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group cursor-pointer relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]'
              : 'border-slate-300 bg-slate-50/60 hover:border-indigo-400 hover:bg-indigo-50/30'
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md text-indigo-600 transition-transform group-hover:scale-110">
            <UploadCloud className="h-8 w-8" />
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-base font-bold text-slate-800">
              Drag & drop your file here
            </p>
            <p className="text-sm font-semibold text-indigo-600 group-hover:underline">
              or browse files from your device
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs font-medium text-slate-400">
            <span>Supported: PDF, TXT</span>
            <span>•</span>
            <span>Max file size: 10 MB</span>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="relative flex items-center justify-between rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 p-4 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 truncate max-w-[240px] sm:max-w-md">
                  {selectedFile.name}
                </h4>
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-indigo-700">
                  {selectedFile.name.endsWith('.pdf') ? 'PDF' : 'TXT'}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {formatFileSize(selectedFile.size)} • Ready for extraction
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 transition-colors hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600"
            title="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
