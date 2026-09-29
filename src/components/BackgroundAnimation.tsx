'use client';

import React from 'react';

export const BackgroundAnimation: React.FC = () => {
  return (
    <div className="ambient-bg-wrapper" aria-hidden="true">
      <div className="ambient-blob-1" />
      <div className="ambient-blob-2" />
      <div className="ambient-blob-3" />
      <div className="ambient-grid-overlay" />
    </div>
  );
};
