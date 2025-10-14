import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import './index.css';
import { FormProvider } from './context/FormContext';
import ProgressBar from './components/ProgressBar';
import LanguageSwitcher from './components/LanguageSwitcher';
import Step1 from './pages/Step1';
import Step2 from './pages/Step2';
import Step3 from './pages/Step3';
import Confirm from './pages/Confirm';

function WizardLayout({ children, step }: { children: React.ReactNode; step: number }) {
  const total = 3;
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">{t('appTitle')}</h1>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">{t('step')} {step} {t('of')} {total}</div>
          <div className="w-48">
            <ProgressBar current={step} total={total} />
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
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
