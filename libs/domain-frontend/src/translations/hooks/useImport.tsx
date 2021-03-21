import { useTranslationsStore } from '../stores/useTranslationsStore';
import React, { useCallback } from 'react';
import { TranslationEntry } from '@pable/domain-types';
import { Button, useToast } from '@chakra-ui/react';
import { separator } from '../constants';

const toastId = 'importResult';

export const useImport = () => {
  const toast = useToast();

  const addTranslation = useTranslationsStore((store) => store.addEntry);
  const setEntries = useTranslationsStore((store) => store.setEntries);
  const translations = useTranslationsStore((store) => store.translations);

  const fromRawText = useCallback(
    (textEntries: string[]) => {
      const oldTranslations = [...translations];

      const mappedTexts: TranslationEntry[] = textEntries.flatMap((entry) =>
        entry
          .split('\n')
          .map((entry) => entry.split(separator))
          .filter((entry) => entry[0])
          .map((entry) => ({
            sourceWord: entry[0],
            targetWord: entry[1],
            alternatives: [],
          }))
      );

      addTranslation(mappedTexts);

      toast({
        id: toastId,
        position: 'top',
        status: 'success',
        title: `Imported ${mappedTexts.length} entries.`,
        description: (
          <Button
            mt={3}
            color="white"
            variant="link"
            onClick={() => {
              setEntries(oldTranslations);
              toast.close(toastId);
            }}
          >
            Click here to undo
          </Button>
        ),
        variant: 'solid',
        isClosable: true,
        duration: 9999999999,
      });
    },
    [addTranslation, setEntries, toast, translations]
  );

  return {
    fromRawText,
  };
};
