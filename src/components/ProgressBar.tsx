import React from 'react';

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = Math.max(0, Math.min(100, Math.round((current / total) * 100)));
  return (
    <div aria-label="progress" className="w-full bg-gray-200 rounded-full h-2 shadow-inner" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <div className="h-2 rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${percent}%` }} />
    </div>
  );
}
