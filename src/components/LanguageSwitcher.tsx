import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  useEffect(() => {
    const dir = current === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = current;
  }, [current]);

  return (
    <div className="flex items-center gap-2" aria-label={t('language')}>
      <button
        className={`px-3 py-1 rounded ${current === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => i18n.changeLanguage('en')}
      >
        {t('english')}
      </button>
      <button
        className={`px-3 py-1 rounded ${current === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => i18n.changeLanguage('ar')}
      >
        {t('arabic')}
      </button>
    </div>
  );
}
