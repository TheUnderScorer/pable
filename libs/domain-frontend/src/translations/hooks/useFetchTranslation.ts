import { useTranslationsConfiguration } from '../stores/useTranslationsConfiguration';
import { useMutation } from 'react-query';
import { useApiClient } from '../../../../shared-frontend/src/providers/ApiClientProvider';
import { FetchTranslationsResult } from '@pable/domain-types';
import { FetchTranslationsDto } from '@pable/shared';

export const fetchTranslationsKey = 'fetchTranslations';

export const useFetchTranslation = (
  word: string,
  onSuccess: (data: FetchTranslationsResult | undefined) => void
) => {
  const sourceLang = useTranslationsConfiguration((store) => store.sourceLang);
  const targetLang = useTranslationsConfiguration((store) => store.targetLang);

  const { apiClient } = useApiClient();

  return useMutation<
    FetchTranslationsResult | undefined,
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
