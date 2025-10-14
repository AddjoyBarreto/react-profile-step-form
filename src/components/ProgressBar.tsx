import React from 'react';

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = Math.max(0, Math.min(100, Math.round((current / total) * 100)));
  return (
    <div aria-label="progress" className="w-full bg-gray-200 rounded h-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <div className="h-2 rounded bg-blue-600" style={{ width: `${percent}%` }} />
    </div>
  );
}
