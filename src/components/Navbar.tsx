import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 
          className="text-lg font-semibold tracking-tight cursor-pointer hover:text-blue-600 transition-colors duration-200"
          onClick={handleTitleClick}
        >
          {t('appTitle')}
        </h1>
        <LanguageSwitcher />
      </div>
    </header>
  );
}


