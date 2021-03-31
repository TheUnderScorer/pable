import React, { useCallback } from 'react';
import { TranslationEntry, TranslationsForm } from '@skryba/domain-types';
import { Button, useToast } from '@chakra-ui/react';
import { separator } from '../constants';
import { useFormContext } from 'react-hook-form';

const toastId = 'importResult';

export const useImport = () => {
  const { setValue, getValues } = useFormContext<TranslationsForm>();

  const toast = useToast();

  const fromRawText = useCallback(
    (textEntries: string[]) => {
      const oldTranslations = [...getValues().entries];

      const mappedTexts: TranslationEntry[] = textEntries.flatMap((entry) =>
        entry
          .split('\n')
          .map((entry) => entry.split(separator))
          .filter((entry) => entry[0])
          .map((entry) => ({
            sourceWord: entry[0],
            targetWord: entry[1] ?? '',
            alternatives: [],
          }))
      );

      setValue('entries', [...oldTranslations, ...mappedTexts]);

      toast({
        id: toastId,
        position: 'top',
        status: 'success',
        title: `Imported ${mappedTexts.length} entries.`,
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
    [getValues, setValue, toast]
  );

  return {
    fromRawText,
  };
};
