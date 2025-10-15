import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import './index.css';
import { FormProvider } from './context/FormContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import Stepper from './components/Stepper';
import { buildSteps } from './constants/steps';
import Step1 from './pages/Step1';
import Step2 from './pages/Step2';
import Step3 from './pages/Step3';
import Confirm from './pages/Confirm';

function WizardLayout({ children, step }: { children: React.ReactNode; step: number }) {
  const total = 3;
  const { t } = useTranslation();
  const steps = buildSteps(t);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">{t('appTitle')}</h1>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-5">
          <div className="text-sm text-gray-600 mb-3 text-center sm:text-left">{t('step')} {step} {t('of')} {total}</div>
          <Stepper steps={steps} current={step} />
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md ring-1 ring-black/5">
          {children}
        </div>
      </main>
    </div>
  );
}

function WizardRoutes() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <WizardLayout step={1}>
            <Step1 onNext={() => navigate('/step-2')} />
          </WizardLayout>
        }
      />
      <Route
        path="/step-2"
        element={
          <WizardLayout step={2}>
            <Step2 onBack={() => navigate('/')} onNext={() => navigate('/step-3')} />
          </WizardLayout>
        }
      />
      <Route
        path="/step-3"
        element={
          <WizardLayout step={3}>
            <Step3 onBack={() => navigate('/step-2')} onSubmitFinal={() => navigate('/confirm')} />
          </WizardLayout>
        }
      />
      <Route path="/confirm" element={<Confirm />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FormProvider>
        <WizardRoutes />
      </FormProvider>
    </BrowserRouter>
  );
}
