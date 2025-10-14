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
  return (
    <label className="block">
      <span className="block mb-1 font-medium">{label}</span>
      <select name={name} value={value as any} onChange={onChange} onBlur={onBlur} className="w-full border rounded p-2 bg-white">
        <option value="" disabled>{required ? '—' : ''}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </label>
  );
}
