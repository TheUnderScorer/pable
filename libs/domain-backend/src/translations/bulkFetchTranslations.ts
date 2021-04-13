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
  const limit = pLimit(10);

  const translations = await Promise.all(
    dto.entries.map((entry) => limit(() => fetchTranslations(entry)))
  );

  return {
    translations,
  };
};

export type BulkFetchTranslations = ReturnType<
  typeof makeBulkFetchTranslations
>;
