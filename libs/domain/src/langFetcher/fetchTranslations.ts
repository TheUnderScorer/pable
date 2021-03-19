import { Browser } from 'puppeteer';
import { FetchTranslationsDto } from '@pable/domain-types';

interface FetchTranslationsDependencies {
  browser: Browser;
}

export const makeFetchTranslations = ({
  browser,
}: FetchTranslationsDependencies) => async ({
  word,
  language,
}: FetchTranslationsDto) => {
  console.log(`Fetching languages for ${word} lang ${language}`);

  return [];
};

export type FetchTranslations = ReturnType<typeof makeFetchTranslations>;
