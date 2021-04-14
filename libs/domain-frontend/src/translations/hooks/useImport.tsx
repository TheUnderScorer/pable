import React, { useCallback, useState } from 'react';
import { TranslationEntry, TranslationsForm } from '@skryba/domain-types';
import { Button, useToast } from '@chakra-ui/react';
import { separator } from '../constants';
import { useFormContext } from 'react-hook-form';
import { first } from 'remeda';
import { useApiClient } from '@skryba/shared-frontend';
import { FetchTranslationsDto } from '@skryba/shared';
import { useTranslationsConfiguration } from '../stores/useTranslationsConfiguration';
import { useDebounce } from 'react-use';

const toastId = 'importResult';
const loadingToastId = 'import-loading';

export enum ImportState {
  Idle,
  Importing,
  Translating,
  Done,
}

export const useImport = () => {
  const [state, setState] = useState<ImportState>(ImportState.Idle);
  const { setValue, getValues } = useFormContext<TranslationsForm>();

  const { apiClient } = useApiClient();

  const toast = useToast();

  const sourceLang = useTranslationsConfiguration((store) => store.sourceLang);
  const targetLang = useTranslationsConfiguration((store) => store.targetLang);

  const fromRawText = useCallback(
    async (textEntries: string[]) => {
      let translatedEntries = 0;

      setState(ImportState.Importing);

      const oldTranslations = [...getValues().entries];

      const mappedTexts: TranslationEntry[] = textEntries.flatMap((entry) =>
        entry
          .split('\n')
          .map((entry) => entry.split(separator).map((item) => item.trim()))
          .filter((entry) => first(entry))
          .map((entry) => ({
            sourceWord: first(entry),
            targetWord: entry[1] ?? '',
            alternatives: [],
          }))
      );

      const bulkTranslateRequest: FetchTranslationsDto[] = mappedTexts
        .filter((entry) => !entry.targetWord && entry.sourceWord)
        .map((entry) => ({
          word: entry.sourceWord,
          targetLanguage: targetLang,
          sourceLanguage: sourceLang,
        }));

      if (bulkTranslateRequest.length) {
        toast({
          id: loadingToastId,
          position: 'top',
          status: 'info',
          isClosable: false,
          duration: null,
          description: `Hold on, we are translating ${bulkTranslateRequest.length} of your entries...`,
        });

        setState(ImportState.Translating);

        try {
          const { translations, ...response } = await apiClient.bulkTranslate({
            entries: bulkTranslateRequest,
          });

          translatedEntries = response.translatedEntries;

          translations.forEach((entry) => {
            const itemsToReplace = mappedTexts.filter(
              (mappedText) => mappedText.sourceWord === entry.from
            );

            itemsToReplace.forEach((item) => {
              item.targetWord = entry.translation;
              item.alternatives = entry.alternatives;
            });
          });
        } catch (e) {
          toast.close(loadingToastId);

          setState(ImportState.Idle);

          throw e;
        }
      }

      setValue('entries', [...oldTranslations, ...mappedTexts]);

      setState(ImportState.Done);

      toast.close(loadingToastId);

      toast({
        id: toastId,
        position: 'top',
        status: 'success',
        title: `Imported ${mappedTexts.length} entries.`.concat(
          translatedEntries
            ? ` ${translatedEntries} entries has been translated`
            : ''
        ),
        description: (
          <Button
            id="undo_import"
            mt={3}
            color="white"
            variant="link"
            onClick={() => {
              setValue('entries', oldTranslations);
              toast.close(toastId);
            }}
          >
            Click here to undo
          </Button>
        ),
        variant: 'solid',
        isClosable: true,
      });
    },
    [apiClient, getValues, setValue, sourceLang, targetLang, toast]
  );

  useDebounce(
    () => {
      if (state === ImportState.Done) {
        setState(ImportState.Idle);
      }
    },
    4000,
    [state]
  );

  return {
    fromRawText,
    state,
  };
};
