'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
    info: 'border-indigo-200 bg-indigo-50 text-indigo-900',
  };

  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    error: <AlertCircle className="h-4 w-4 text-rose-600" />,
    info: <Info className="h-4 w-4 text-indigo-600" />,
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md animate-fade-in ${styles[type]}`}>
      {icons[type]}
      <span className="text-xs font-bold">{message}</span>
      <button onClick={onClose} className="rounded-lg p-1 hover:bg-black/5">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
