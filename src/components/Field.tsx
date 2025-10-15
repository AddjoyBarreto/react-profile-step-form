import React from 'react';
import { UseFormRegister, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface FieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validate?: (value: unknown) => string | true;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function Field<T extends FieldValues>({
  name,
  label,
  type = 'text',
  required = false,
  register,
  errors,
  validate,
  className = '',
  disabled = false,
  placeholder
}: FieldProps<T>) {
  const { t } = useTranslation();
  
  const validationRules = {
    required: required ? t('required') : false,
    ...(validate && { validate })
  };

  const fieldRegister = register(name, validationRules);
  const error = errors[name];

  return (
    <label className="block">
      <span className="block mb-1 text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...fieldRegister}
        onChange={fieldRegister.onChange}
        onBlur={fieldRegister.onBlur}
      />
      {error && (
        <span className="text-red-600 text-sm">
          {typeof error?.message === 'string' ? error.message : t('required')}
        </span>
      )}
    </label>
  );
}
