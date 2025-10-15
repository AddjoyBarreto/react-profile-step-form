import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormData, Step1Data } from '../context/FormContext';
import { useTranslation } from 'react-i18next';
import Select from '../components/Select';
import Field from '../components/Field';
import type { Country } from '../data/loadLocations';
import { loadLocations } from '../data/loadLocations';
import { sortedCountryCodes } from '../data/countryCodes';
import { phone } from 'phone';

export default function Step1({ onNext }: { onNext: () => void }) {
  const { data, setData } = useFormData();
  const { t } = useTranslation();
  
  // Split existing phone number into country code and phone number for display
  const getInitialValues = () => {
    const step1Data = data.step1 || {};
    
    // If we have both phone and countryCode, check if phone includes the country code
    if (step1Data.phone && step1Data.countryCode) {
      const countryData = sortedCountryCodes.find(cc => cc.code === step1Data.countryCode);
      
      if (countryData && step1Data.phone.startsWith(countryData.dialCode)) {
        // Phone includes country code, split it for display
        const phoneWithoutCode = step1Data.phone.replace(countryData.dialCode, '');
        return {
          ...step1Data,
          phone: phoneWithoutCode
        };
      }
      
      // Phone doesn't include country code, use as is
      return step1Data;
    }
    
    // If we have a combined phone number without countryCode, try to split it
    if (step1Data.phone && !step1Data.countryCode) {
      const phoneNumber = step1Data.phone;
      
      // Find matching country code by checking if phone starts with any dial code
      const matchingCountry = sortedCountryCodes.find(country => 
        phoneNumber.startsWith(country.dialCode)
      );
      
      if (matchingCountry) {
        const phoneWithoutCode = phoneNumber.replace(matchingCountry.dialCode, '');
        return {
          ...step1Data,
          countryCode: matchingCountry.code,
          phone: phoneWithoutCode
        };
      }
    }
    
    return step1Data;
  };
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<Partial<Step1Data>>({ 
    defaultValues: getInitialValues()
  });

  const [countriesData, setCountriesData] = useState<Country[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [locError, setLocError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoadingLocations(true);
    loadLocations()
      .then((res) => { if (mounted) setCountriesData(res); })
      .catch((e) => { if (mounted) setLocError(e?.message || t('failedToLoadLocations')); })
      .finally(() => { if (mounted) setLoadingLocations(false); });
    return () => { mounted = false; };
  }, [t]);

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
    if (!st || st.cities.length === 0) {
      return [{ value: 'null', label: t('noCitiesAvailable') }];
    }
    return st.cities.map(ci => ({ value: ci.id.toString(), label: ci.name }));
  }, [countriesData, watchCountry, watchState, t]);

  const onSubmit = (values: Partial<Step1Data>) => {
    // Validate that country code is selected
    if (!values.countryCode) {
      return; // Form will show validation error
    }
    
    // Find the country code data
    const countryData = sortedCountryCodes.find(cc => cc.code === values.countryCode);
    
    // Combine country code and phone number for storage
    const fullPhoneNumber = countryData ? `${countryData.dialCode}${values.phone}` : values.phone;
    
    // Convert 'null' string to actual null for city field
    const processedValues = {
      ...values,
      city: values.city === 'null' ? null : values.city,
      phone: fullPhoneNumber // Store the combined phone number
    };
    setData({ ...data, step1: processedValues });
    onNext();
  };

  const dobValidation = (value: unknown) => {
    const v = typeof value === 'string' ? value : '';
    if (!v) return true;
    const today = new Date();
    const dobDate = new Date(v);
    if (isNaN(dobDate.getTime())) return t('required');
    const age = today.getFullYear() - dobDate.getFullYear() - ((today.getMonth() < dobDate.getMonth() || (today.getMonth() === dobDate.getMonth() && today.getDate() < dobDate.getDate())) ? 1 : 0);
    return age >= 18 || t('mustBe18');
  };

  const phoneValidation = (value: unknown) => {
    const v = typeof value === 'string' ? value : '';
    if (!v) return true;
    
    // Get selected country code to validate against
    const selectedCountryCode = watch('countryCode') as string;
    if (!selectedCountryCode) {
      return t('required'); // Country code is mandatory
    }
    
    // Find the country code data
    const countryData = sortedCountryCodes.find(cc => cc.code === selectedCountryCode);
    if (!countryData) {
      return t('invalidPhone');
    }
    
    // Use the phone package for validation
    // Combine country dial code with phone number
    const fullPhoneNumber = `${countryData.dialCode}${v}`;
    const phoneValidation = phone(fullPhoneNumber, { country: selectedCountryCode });
    
    // Check if phone is valid
    if (!phoneValidation.isValid) {
      return t('invalidPhone');
    }
    
    // Additional check: ensure the phone number doesn't already include the country code
    if (v.startsWith('+') || v.startsWith(countryData.dialCode)) {
      return t('invalidPhone');
    }
    
    return true;
  };

  const genderOptions = [
    { value: 'male', label: t('genderMale') },
    { value: 'female', label: t('genderFemale') },
    { value: 'other', label: t('genderOther') },
  ];

  const countryCodeOptions = useMemo(() => 
    sortedCountryCodes.map(cc => ({ 
      value: cc.code, 
      label: `${cc.flag} ${cc.dialCode} ${cc.name}` 
    })), 
    []
  );

  const countryReg = register('country', { required: true });
  const stateReg = register('state', { required: true });
  const cityReg = register('city', { required: cityOptions.length && cityOptions[0].value === 'null' ? false : true });
  const countryCodeReg = register('countryCode', { required: true });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label={t('personalInfo')}>
      <h2 className="text-xl font-semibold">{t('personalInfo')}</h2>
      {locError && <div className="text-red-700 bg-red-50 p-2 rounded" role="alert">{locError}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field name="name" label={t('name')} required register={register} errors={errors} />
        <Field name="nationalId" label={t('nationalId')} required register={register} errors={errors} />
        <Field name="dob" label={t('dob')} type="date" required validate={dobValidation} register={register} errors={errors} />

        <Select
          label={t('gender')}
          // name="gender"
          options={genderOptions}
          required
          {...register('gender', { required: true })}
          error={errors.gender ? t('required') : ''}
        />

        <Field name="address" label={t('address')} required register={register} errors={errors} />

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
          required={cityOptions.length > 1}
          onChange={cityReg.onChange}
          ref={cityReg.ref}
          error={errors.city ? t('required') : ''}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Select
            label={t('countryCode')}
            name="countryCode"
            options={countryCodeOptions}
            required
            onChange={countryCodeReg.onChange}
            ref={countryCodeReg.ref}
            error={errors.countryCode ? t('required') : ''}
          />
          <div className="md:col-span-2">
            <Field 
              name="phone" 
              label={t('phone')} 
              type="tel"
              required 
              validate={phoneValidation}
              register={register} 
              errors={errors} 
            />
          </div>
        </div>
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
