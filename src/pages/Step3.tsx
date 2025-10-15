import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormData, Step3Data } from '../context/FormContext';
import { useTranslation } from 'react-i18next';
import AISuggestionModal from '../components/AISuggestionModal';
import { generateAssistance } from '../services/openai';
import { submitApplication } from '../services/mockApi';

export default function Step3({ onBack, onSubmitFinal }: { onBack: () => void; onSubmitFinal: (data: unknown) => void }) {
  const { data, setData } = useFormData();
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<Partial<Step3Data>>({ 
    defaultValues: data.step3 || {},
    mode: 'onChange'
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [targetField, setTargetField] = useState<keyof Step3Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const promptMap: Record<keyof Step3Data, string> = {
    currentFinancialSituation: 'Describe current financial situation to support assistance request.',
    employmentCircumstances: 'Describe current employment circumstances, including unemployment or reduced hours.',
    reasonForApplying: 'Explain reasons for applying for financial assistance and hardship context.',
  };

  const handleHelp = async (fieldName: keyof Step3Data) => {
    const currentText = (watch(fieldName) as string) || '';
    if (!currentText.trim()) {
      const fieldLabels = {
        currentFinancialSituation: 'Current Financial Situation',
        employmentCircumstances: 'Employment Circumstances', 
        reasonForApplying: 'Reason for Applying'
      };
      setFieldError(`Please write something in "${fieldLabels[fieldName]}" field first before using AI assistance`);
      return;
    }
    
    setTargetField(fieldName);
    setModalText(currentText);
    setModalOpen(true);
    setLoading(true);
    setError('');
    setFieldError('');
    try {
      const key = process.env.REACT_APP_OPENAI_API_KEY as string | undefined;
      const suggestion = await generateAssistance({
        prompt: `${promptMap[fieldName]} Here's what the user wrote: "${currentText}"`,
        apiKey: key || '',
      });
      setModalText(suggestion);
    } catch (e: any) {
      setError(e?.message || 'Failed to get suggestion');
    } finally {
      setLoading(false);
    }
  };

  const onAccept = (text: string) => {
    if (targetField) setValue(targetField, text, { shouldValidate: true });
    setModalOpen(false);
  };

  const onSubmit = async (values: Partial<Step3Data>) => {
    const merged = { ...data, step3: values };
    setData(merged);
    await submitApplication(merged);
    onSubmitFinal(merged);
  };

  const TextArea = ({ name, label, required }: { name: keyof Step3Data; label: string; required?: boolean }) => {
    const fieldRegister = register(name, { required });
    return (
      <label className="block">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-gray-700">{label}</span>
          <button 
            type="button" 
            onClick={() => handleHelp(name)} 
            className="px-2 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || isSubmitting}
          >
            {t('helpMeWrite')}
          </button>
        </div>
        <textarea 
          className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" 
          name={fieldRegister.name}
          ref={fieldRegister.ref}
          onChange={fieldRegister.onChange}
          onBlur={fieldRegister.onBlur}
          disabled={loading || isSubmitting}
        />
        {errors[name] && <span className="text-red-600 text-sm">{t('required')}</span>}
      </label>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label={t('situations')}>
      <h2 className="text-xl font-semibold">{t('situations')}</h2>
      {error && <div className="text-red-700 bg-red-50 p-2 rounded" role="alert">{error}</div>}
      {fieldError && <div className="text-red-700 bg-red-50 p-2 rounded" role="alert">{fieldError}</div>}
      <TextArea name="currentFinancialSituation" label={t('currentFinancialSituation')} required />
      <TextArea name="employmentCircumstances" label={t('employmentCircumstances')} required />
      <TextArea name="reasonForApplying" label={t('reasonForApplying')} required />

      <div className="flex justify-between">
        <button 
          type="button" 
          onClick={onBack} 
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || isSubmitting}
        >
          {t('back')}
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={loading || isSubmitting}
        >
          {t('submit')}
        </button>
      </div>

      <AISuggestionModal
        open={modalOpen}
        text={modalText}
        onChange={setModalText}
        onAccept={onAccept}
        onClose={() => setModalOpen(false)}
      />
    </form>
  );
}
