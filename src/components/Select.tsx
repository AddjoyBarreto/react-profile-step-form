import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

export type Option = { value: string; label: string };

type Props = {
  label: string;
  options: Option[];
  required?: boolean;
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, options, required, error, className, ...rest },
  ref
) {
  const { t } = useTranslation();
  const base = 'w-full border rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const withError = error ? ' border-red-500' : ' border-gray-300';
  return (
    <label className="block">
      <span className="block mb-1 text-sm font-medium text-gray-700">{label}</span>
      <select ref={ref} className={`${base}${withError} ${className || ''}`} {...rest}>
        <option value="" disabled>{required ? t('selectPlaceholder') : t('selectEmpty')}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-red-600 text-sm mt-1 inline-block">{error}</span>}
    </label>
  );
});

export default Select;
