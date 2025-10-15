import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Step1Data = {
  name: string;
  nationalId: string;
  dob: string;
  gender: string;
  address: string;
  city: string | null;
  state: string;
  country: string;
  phone: string;
  email: string;
};

export type Step2Data = {
  maritalStatus: string;
  dependents: number | string;
  employmentStatus: string;
  monthlyIncome: number | string;
  housingStatus: string;
};

export type Step3Data = {
  currentFinancialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
};

export type FormData = {
  step1?: Partial<Step1Data>;
  step2?: Partial<Step2Data>;
  step3?: Partial<Step3Data>;
};

const STORAGE_KEY = 'app.form.data.v1';

type FormContextValue = {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  clearData: () => void;
};

const FormContext = createContext<FormContextValue | null>(null);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FormData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as FormData) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const clearData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setData({});
    } catch {}
  };

  const value = useMemo(() => ({ data, setData, clearData }), [data]);
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormData(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormData must be used within FormProvider');
  return ctx;
}
