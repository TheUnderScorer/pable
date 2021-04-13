import { useTranslationsConfiguration } from '../stores/useTranslationsConfiguration';
import { useMutation } from 'react-query';
import { useApiClient } from '@skryba/shared-frontend';
import { TranslationsResult } from '@skryba/domain-types';
import { FetchTranslationsDto } from '@skryba/shared';
import { useCallback } from 'react';

export const fetchTranslationsKey = 'fetchTranslations';

export const useFetchTranslation = (
  word: string,
  onSuccess?: (data: TranslationsResult | undefined) => void
) => {
  const sourceLang = useTranslationsConfiguration(
    useCallback((store) => store.sourceLang, [])
  );
  const targetLang = useTranslationsConfiguration(
    useCallback((store) => store.targetLang, [])
  );

  const { apiClient } = useApiClient();

  return useMutation<
    TranslationsResult | undefined,
    Error,
    Pick<FetchTranslationsDto, 'word'>
  >(
    fetchTranslationsKey,
    async (data) => {
      if (!data.word) {
        return null;
      }

      return apiClient.fetchTranslations({
        ...data,
        targetLanguage: targetLang,
        sourceLanguage: sourceLang,
      });
    },
    {
      onSuccess,
    }
  );
};
