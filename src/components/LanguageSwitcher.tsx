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

  const baseBtn = 'px-3 py-1.5 text-sm rounded-full transition-colors';
  const active = 'bg-blue-600 text-white shadow';
  const inactive = 'text-gray-700 hover:text-gray-900';

  return (
    <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full p-1" role="group" aria-label={t('language')}>
      <button
        className={`${baseBtn} ${current === 'en' ? active : inactive}`}
        aria-pressed={current === 'en'}
        onClick={() => i18n.changeLanguage('en')}
      >
        {t('english')}
      </button>
      <button
        className={`${baseBtn} ${current === 'ar' ? active : inactive}`}
        aria-pressed={current === 'ar'}
        onClick={() => i18n.changeLanguage('ar')}
      >
        {t('arabic')}
      </button>
    </div>
  );
}
