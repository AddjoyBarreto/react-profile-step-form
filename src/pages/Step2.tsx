import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormData, Step2Data } from '../context/FormContext';
import { useTranslation } from 'react-i18next';
import Select, { Option } from '../components/Select';

export default function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, setData } = useFormData();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Step2Data>>({ defaultValues: data.step2 || {} });

  const onSubmit = (values: Partial<Step2Data>) => {
    setData({ ...data, step2: values });
    onNext();
  };

  const Field = ({ name, label, type = 'text', required }: { name: keyof Step2Data; label: string; type?: string; required?: boolean }) => (
    <label className="block">
      <span className="block mb-1 text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        aria-invalid={errors[name] ? 'true' : 'false'}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        {...register(name, { required })}
      />
      {errors[name] && <span className="text-red-600 text-sm">{t('required')}</span>}
    </label>
  );

  const marital: Option[] = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
  ];
  const employment: Option[] = [
    { value: 'employed', label: 'Employed' },
    { value: 'unemployed', label: 'Unemployed' },
    { value: 'self-employed', label: 'Self-employed' },
    { value: 'student', label: 'Student' },
    { value: 'retired', label: 'Retired' },
  ];
  const housing: Option[] = [
    { value: 'rent', label: 'Rent' },
    { value: 'own', label: 'Own' },
    { value: 'family', label: 'Family' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label={t('familyFinancial')}>
      <h2 className="text-xl font-semibold">{t('familyFinancial')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={t('maritalStatus')}
         // name="maritalStatus"
          options={marital}
          required
          {...register('maritalStatus', { required: true })}
          error={errors.maritalStatus ? t('required') : ''}
        />

        <Field name="dependents" label={t('dependents')} type="number" required />

        <Select
          label={t('employmentStatus')}
          options={employment}
          required
          {...register('employmentStatus', { required: true })}
          error={errors.employmentStatus ? t('required') : ''}
        />

        <Field name="monthlyIncome" label={t('monthlyIncome')} type="number" required />

        <Select
          label={t('housingStatus')}
          options={housing}
          required
          {...register('housingStatus', { required: true })}
          error={errors.housingStatus ? t('required') : ''}
        />
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200">{t('back')}</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{t('next')}</button>
      </div>
    </form>
  );
}
