import React, { useEffect, useRef } from 'react';

export default function AISuggestionModal({ open, text, onAccept, onClose, onChange }: {
  open: boolean;
  text: string;
  onAccept: (text: string) => void;
  onClose: () => void;
  onChange: (text: string) => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-5" tabIndex={-1} ref={dialogRef}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">AI Suggestion</h3>
          <button aria-label="Close" onClick={onClose} className="p-2 rounded hover:bg-gray-100">✕</button>
        </div>
        <textarea className="w-full border border-gray-300 rounded-lg p-3 min-h-[220px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={text} onChange={(e) => onChange(e.target.value)} />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200">Discard</button>
          <button onClick={() => onAccept(text)} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Accept</button>
        </div>
      </div>
    </div>
  );
}
