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

  const countryOptions = useMemo(() => countriesData.map(c => ({ value: c.id.toString(), label: c.name })), [countriesData]);
  const stateOptions = useMemo(() => {
    const country = countriesData.find(c => c.id.toString() === watchCountry);
    return country ? country.states.map(s => ({ value: s.id.toString(), label: s.name })) : [];
  }, [countriesData, watchCountry]);
  const cityOptions = useMemo(() => {
    const country = countriesData.find(c => c.id.toString() === watchCountry);
    const st = country?.states.find(s => s.id.toString() === watchState);
    return st ? st.cities.map(ci => ({ value: ci.id.toString(), label: ci.name })) : [];
  }, [countriesData, watchCountry, watchState]);

  const onSubmit = (values: Partial<Step1Data>) => {
    setData({ ...data, step1: values });
    onNext();
  };

  const Field = ({ name, label, type = 'text', required }: { name: keyof Step1Data; label: string; type?: string; required?: boolean }) => (
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

  const genderOptions = [
    { value: 'male', label: t('genderMale') },
    { value: 'female', label: t('genderFemale') },
    { value: 'other', label: t('genderOther') },
  ];

  const countryReg = register('country', { required: true });
  const stateReg = register('state', { required: true });
  const cityReg = register('city', { required: true });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label={t('personalInfo')}>
      <h2 className="text-xl font-semibold">{t('personalInfo')}</h2>
      {locError && <div className="text-red-700 bg-red-50 p-2 rounded" role="alert">{locError}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field name="name" label={t('name')} required />
        <Field name="nationalId" label={t('nationalId')} required />
        <Field name="dob" label={t('dob')} type="date" required />

        <Select
          label={t('gender')}
          // name="gender"
          options={genderOptions}
          required
          {...register('gender', { required: true })}
          error={errors.gender ? t('required') : ''}
        />

        <Field name="address" label={t('address')} required />

        <Select
          label={t('country')}
          name="country"
          options={countryOptions}
          required
          onChange={(e) => { countryReg.onChange(e); setValue('state', ''); setValue('city', ''); }}
          ref={countryReg.ref}
          error={errors.country ? t('required') : ''}
        />

        <Select
          label={t('state')}
          name="state"
          options={stateOptions}
          required
          onChange={(e) => { stateReg.onChange(e); setValue('city', ''); }}
          ref={stateReg.ref}
          error={errors.state ? t('required') : ''}
        />

        <Select
          label={t('city')}
          name="city"
          options={cityOptions}
          required
          onChange={cityReg.onChange}
          ref={cityReg.ref}
          error={errors.city ? t('required') : ''}
        />

        <Field name="phone" label={t('phone')} required />
        <label className="block">
          <span className="block mb-1 text-sm font-medium text-gray-700">{t('email')}</span>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" disabled={loadingLocations}>{t('next')}</button>
      </div>
    </form>
  );
}
