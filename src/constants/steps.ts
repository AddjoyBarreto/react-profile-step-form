export type StepItem = { id: number; label: string };

export function buildSteps(t: (key: string) => string): StepItem[] {
  return [
    { id: 1, label: t('personalInfo') },
    { id: 2, label: t('familyFinancial') },
    { id: 3, label: t('situations') },
  ];
}
