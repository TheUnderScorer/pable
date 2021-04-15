import { useApiClient, useToastOnError } from '@skryba/shared-frontend';
import { useMutation, UseMutationOptions } from 'react-query';
import { TranslateDocumentResult } from '@skryba/domain-types';
import { TranslateDocumentDto } from '@skryba/shared';

export const translateDocumentKey = 'translateDocument';

export const useTranslateDocument = (
  options?: UseMutationOptions<
    TranslateDocumentResult,
    Error,
    TranslateDocumentDto
  >
) => {
  const toastOnError = useToastOnError();
  const { apiClient } = useApiClient();

  return useMutation<TranslateDocumentResult, Error, TranslateDocumentDto>(
    translateDocumentKey,
    (data) => {
      return apiClient.translateDocument(data);
    },
    {
      ...options,
      onError: (error, variables, context) => {
        toastOnError(error);

        options?.onError?.(error, variables, context);
      },
    }
  );
};
