import React from 'react';
import { UseFormRegister, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface TextAreaProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  onHelpClick?: () => void;
  helpButtonText?: string;
  disabled?: boolean;
  minHeight?: string;
  className?: string;
}

export default function TextArea<T extends FieldValues>({
  name,
  label,
  required = false,
  register,
  errors,
  onHelpClick,
  helpButtonText,
  disabled = false,
  minHeight = '120px',
  className = ''
}: TextAreaProps<T>) {
  const { t } = useTranslation();
  
  const fieldRegister = register(name, { required: required ? t('required') : false });
  const error = errors[name];

  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        {onHelpClick && (
          <button 
            type="button" 
            onClick={onHelpClick} 
            className="px-2 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            {helpButtonText || t('helpMeWrite')}
          </button>
        )}
      </div>
      <textarea 
        className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        style={{ minHeight }}
        name={fieldRegister.name}
        ref={fieldRegister.ref}
        onChange={fieldRegister.onChange}
        onBlur={fieldRegister.onBlur}
        disabled={disabled}
      />
      {error && (
        <span className="text-red-600 text-sm">
          {typeof error?.message === 'string' ? error.message : t('required')}
        </span>
      )}
    </label>
  );
}
