import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Confirm() {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">{t('reviewTitle')}</h2>
      <p>{t('reviewBody')}</p>
    </div>
  );
}
