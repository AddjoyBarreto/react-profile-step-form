import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormData, Step1Data } from '../context/FormContext';
import { useTranslation } from 'react-i18next';
import Select from '../components/Select';
import type { Country } from '../data/loadLocations';
import { loadLocations } from '../data/loadLocations';

export default function Step1({ onNext }: { onNext: () => void }) {
  const { data, setData } = useFormData();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<Partial<Step1Data>>({ defaultValues: data.step1 || {} });

  const [countriesData, setCountriesData] = useState<Country[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [locError, setLocError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoadingLocations(true);
    loadLocations()
      .then((res) => { if (mounted) setCountriesData(res); })
      .catch((e) => { if (mounted) setLocError(e?.message || 'Failed to load locations'); })
      .finally(() => { if (mounted) setLoadingLocations(false); });
    return () => { mounted = false; };
  }, []);

  const watchCountry = watch('country') as string | undefined;
  const watchState = watch('state') as string | undefined;

  const countryOptions = useMemo(() => countriesData.map(c => ({ value: c.code, label: c.name })), [countriesData]);
  const stateOptions = useMemo(() => {
    const country = countriesData.find(c => c.code === watchCountry);
    return country ? country.states.map(s => ({ value: s.code, label: s.name })) : [];
  }, [countriesData, watchCountry]);
  const cityOptions = useMemo(() => {
    const country = countriesData.find(c => c.code === watchCountry);
    const st = country?.states.find(s => s.code === watchState);
    return st ? st.cities.map(ci => ({ value: ci.code, label: ci.name })) : [];
  }, [countriesData, watchCountry, watchState]);

  const onSubmit = (values: Partial<Step1Data>) => {
    setData({ ...data, step1: values });
    onNext();
  };

  const Field = ({ name, label, type = 'text', required }: { name: keyof Step1Data; label: string; type?: string; required?: boolean }) => (
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

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label={t('personalInfo')}>
      <h2 className="text-xl font-semibold">{t('personalInfo')}</h2>
      {locError && <div className="text-red-700 bg-red-50 p-2 rounded" role="alert">{locError}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field name="name" label={t('name')} required />
        <Field name="nationalId" label={t('nationalId')} required />
        <Field name="dob" label={t('dob')} type="date" required />

        <Select
          label={t('gender')}
          name="gender"
          options={genderOptions}
          required
          value={watch('gender') as string | undefined}
          onChange={(e) => setValue('gender', e.target.value, { shouldValidate: true })}
          error={errors.gender ? t('required') : ''}
        />

        <Field name="address" label={t('address')} required />

        {/* Hidden inputs register values for validation */}
        <input type="hidden" value={watchCountry || ''} {...register('country', { required: true })} />
        <input type="hidden" value={watchState || ''} {...register('state', { required: true })} />
        <input type="hidden" value={(watch('city') as string) || ''} {...register('city', { required: true })} />

        <Select
          label={t('country')}
          name="country"
          options={countryOptions}
          required
          value={watchCountry || ''}
          onChange={(e) => { setValue('country', e.target.value, { shouldValidate: true }); setValue('state', ''); setValue('city', ''); }}
          error={errors.country ? t('required') : ''}
        />

        <Select
          label={t('state')}
          name="state"
          options={stateOptions}
          required
          value={watchState || ''}
          onChange={(e) => { setValue('state', e.target.value, { shouldValidate: true }); setValue('city', ''); }}
          error={errors.state ? t('required') : ''}
        />

        <Select
          label={t('city')}
          name="city"
          options={cityOptions}
          required
          value={(watch('city') as string) || ''}
          onChange={(e) => setValue('city', e.target.value, { shouldValidate: true })}
          error={errors.city ? t('required') : ''}
        />

        <Field name="phone" label={t('phone')} required />
        <label className="block">
          <span className="block mb-1 font-medium">{t('email')}</span>
          <input
            type="email"
            className="w-full border rounded p-2"
            {...register('email', {
              required: true,
              pattern: /[^@\s]+@[^@\s]+\.[^@\s]+/,
            })}
          />
          {errors.email?.type === 'required' && <span className="text-red-600 text-sm">{t('required')}</span>}
          {errors.email?.type === 'pattern' && <span className="text-red-600 text-sm">{t('invalidEmail')}</span>}
        </label>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loadingLocations}>{t('next')}</button>
      </div>
    </form>
  );
}
