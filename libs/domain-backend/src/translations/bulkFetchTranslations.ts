import { BulkFetchTranslationsDto } from '@skryba/shared';
import { BulkFetchTranslationsResult } from '@skryba/domain-types';
import pLimit from 'p-limit';
import { FetchTranslations } from './fetchTranslations';

interface BulkFetchTranslationsDependencies {
  fetchTranslations: FetchTranslations;
}

export const makeBulkFetchTranslations = ({
  fetchTranslations,
}: BulkFetchTranslationsDependencies) => async (
  dto: BulkFetchTranslationsDto
): Promise<BulkFetchTranslationsResult> => {
  const limit = pLimit(5);

  const translations = await Promise.all(
    dto.entries.map((entry) => limit(() => fetchTranslations(entry)))
  );

  const entriesWithTranslations = translations.filter(
    ({ translation }) => translation
  );

  return {
    translations,
    translatedEntries: entriesWithTranslations.length,
    entriesWithoutTranslations:
      translations.length - entriesWithTranslations.length,
  };
};

export type BulkFetchTranslations = ReturnType<
  typeof makeBulkFetchTranslations
>;
