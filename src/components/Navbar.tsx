import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">{t('appTitle')}</h1>
        <LanguageSwitcher />
      </div>
    </header>
  );
}


