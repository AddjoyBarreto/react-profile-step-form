import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormData, Step3Data } from '../context/FormContext';
import { useTranslation } from 'react-i18next';
import AISuggestionModal from '../components/AISuggestionModal';
import TextArea from '../components/TextArea';
import { generateAssistance } from '../services/openai';
import { submitApplication } from '../services/mockApi';

export default function Step3({ onBack, onSubmitFinal }: { onBack: () => void; onSubmitFinal: (data: unknown) => void }) {
  const { data, setData, clearData } = useFormData();
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
      setError(e?.message || t('failedToGetSuggestion'));
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
    clearData(); // Clear localStorage after successful submission
    onSubmitFinal(merged);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label={t('situations')}>
      <h2 className="text-xl font-semibold">{t('situations')}</h2>
      {error && <div className="text-red-700 bg-red-50 p-2 rounded" role="alert">{error}</div>}
      {fieldError && <div className="text-red-700 bg-red-50 p-2 rounded" role="alert">{fieldError}</div>}
      <TextArea 
        name="currentFinancialSituation" 
        label={t('currentFinancialSituation')} 
        required 
        register={register} 
        errors={errors}
        onHelpClick={() => handleHelp('currentFinancialSituation')}
        disabled={loading || isSubmitting}
      />
      <TextArea 
        name="employmentCircumstances" 
        label={t('employmentCircumstances')} 
        required 
        register={register} 
        errors={errors}
        onHelpClick={() => handleHelp('employmentCircumstances')}
        disabled={loading || isSubmitting}
      />
      <TextArea 
        name="reasonForApplying" 
        label={t('reasonForApplying')} 
        required 
        register={register} 
        errors={errors}
        onHelpClick={() => handleHelp('reasonForApplying')}
        disabled={loading || isSubmitting}
      />

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
