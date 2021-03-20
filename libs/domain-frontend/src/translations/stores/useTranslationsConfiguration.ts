import create from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, TranslationConfiguration } from '@pable/domain-types';

export interface TranslationConfigurationStore
  extends TranslationConfiguration {
  setSourceLang: (lang: Language) => void;
  setTargetLang: (lang: Language) => void;

  [key: string]: unknown;
}

export const useTranslationsConfiguration = create<TranslationConfigurationStore>(
  persist(
    (set) => ({
      sourceLang: Language.Polish,
      targetLang: Language.English,
      setSourceLang: (lang) => {
        set({
          sourceLang: lang,
        });
      },
      setTargetLang: (lang) => {
        set({
          targetLang: lang,
        });
      },
    }),
    {
      name: 'translationsConfiguration',
    }
  )
);
