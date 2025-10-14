import React from 'react';

export type Option = { value: string; label: string };

export default function Select({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  required,
  error,
}: {
  label: string;
  name: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  options: Option[];
  required?: boolean;
  error?: string;
}) {
  const base = 'w-full border rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const withError = error ? ' border-red-500' : ' border-gray-300';
  return (
    <label className="block">
      <span className="block mb-1 text-sm font-medium text-gray-700">{label}</span>
      <select name={name} value={value as any} onChange={onChange} onBlur={onBlur} className={base + withError}>
        <option value="" disabled>{required ? 'Select…' : '—'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-red-600 text-sm mt-1 inline-block">{error}</span>}
    </label>
  );
}
