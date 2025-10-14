import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormData, Step2Data } from '../context/FormContext';
import { useTranslation } from 'react-i18next';
import Select, { Option } from '../components/Select';

export default function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, setData } = useFormData();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<Partial<Step2Data>>({ defaultValues: data.step2 || {} });

  const onSubmit = (values: Partial<Step2Data>) => {
    setData({ ...data, step2: values });
    onNext();
  };

  const Field = ({ name, label, type = 'text', required }: { name: keyof Step2Data; label: string; type?: string; required?: boolean }) => (
    <label className="block">
      <span className="block mb-1 font-medium">{label}</span>
      <input
        type={type}
        aria-invalid={errors[name] ? 'true' : 'false'}
        className="w-full border rounded p-2"
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label={t('familyFinancial')}>
      <h2 className="text-xl font-semibold">{t('familyFinancial')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={t('maritalStatus')}
          name="maritalStatus"
          options={marital}
          required
          value={(watch('maritalStatus') as string) || ''}
          onChange={(e) => setValue('maritalStatus', e.target.value, { shouldValidate: true })}
          error={errors.maritalStatus ? t('required') : ''}
        />

        <label className="block">
          <span className="block mb-1 font-medium">{t('dependents')}</span>
          <input type="number" className="w-full border rounded p-2" {...register('dependents', { required: true })} />
          {errors.dependents && <span className="text-red-600 text-sm">{t('required')}</span>}
        </label>

        <Select
          label={t('employmentStatus')}
          name="employmentStatus"
          options={employment}
          required
          value={(watch('employmentStatus') as string) || ''}
          onChange={(e) => setValue('employmentStatus', e.target.value, { shouldValidate: true })}
          error={errors.employmentStatus ? t('required') : ''}
        />

        <label className="block">
          <span className="block mb-1 font-medium">{t('monthlyIncome')}</span>
          <input type="number" className="w-full border rounded p-2" {...register('monthlyIncome', { required: true })} />
          {errors.monthlyIncome && <span className="text-red-600 text-sm">{t('required')}</span>}
        </label>

        <Select
          label={t('housingStatus')}
          name="housingStatus"
          options={housing}
          required
          value={(watch('housingStatus') as string) || ''}
          onChange={(e) => setValue('housingStatus', e.target.value, { shouldValidate: true })}
          error={errors.housingStatus ? t('required') : ''}
        />
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">{t('back')}</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{t('next')}</button>
      </div>
    </form>
  );
}
