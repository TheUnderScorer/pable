import { Browser } from 'puppeteer';
import { Language } from '@pable/domain-types';

interface FetchTranslationsDependencies {
  browser: Browser;
}

export const makeFetchTranslations = ({
  browser,
}: FetchTranslationsDependencies) => async (lang: Language) => {
  console.log(`Fetching languages for ${lang}`);

  return [];
};

export type FetchTranslations = ReturnType<typeof makeFetchTranslations>;
