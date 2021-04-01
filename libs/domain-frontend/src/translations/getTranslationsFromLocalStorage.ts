import { TranslationsForm } from '@skryba/domain-types';

export const getTranslationsFromLocalStorage = () => {
  try {
    const parsed = JSON.parse(
      localStorage.getItem('translationsForm')
    ) as TranslationsForm;

    return parsed?.entries ?? null;
  } catch {
    return null;
  }
};
