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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-2xl rounded shadow p-4" tabIndex={-1} ref={dialogRef}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">AI Suggestion</h3>
          <button aria-label="Close" onClick={onClose} className="p-1 rounded hover:bg-gray-100">✕</button>
        </div>
        <textarea className="w-full border rounded p-2 min-h-[200px]" value={text} onChange={(e) => onChange(e.target.value)} />
        <div className="mt-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">Discard</button>
          <button onClick={() => onAccept(text)} className="px-3 py-1 rounded bg-blue-600 text-white">Accept</button>
        </div>
      </div>
    </div>
  );
}
