import React, { useCallback, useState } from 'react';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';
import { TranslationEntry, TranslationsForm } from '@skryba/domain-types';
import { TranslationsTable } from '../../../../translations/components/TranslationsTable/TranslationsTable';
import { Box } from '@chakra-ui/react';
import { useMount } from 'react-use';
import { simulateTyping } from '@skryba/shared-frontend';

const defaultValues: TranslationsForm = {
  entries: [
    {
      sourceWord: '',
      targetWord: '',
    },
    {
      sourceWord: '',
      targetWord: '',
    },
  ],
  newEntry: {},
};

export const TranslateDocumentOnboardTablePreview = () => {
  const [isFilled, setIsFilled] = useState(false);

  const form = useForm<TranslationsForm>({
    defaultValues,
  });

  const { setValue, reset } = form;

  const fillEntry = useCallback(
    async (
      word: string,
      index: number,
      type: keyof Pick<TranslationEntry, 'sourceWord' | 'targetWord'>
    ) => {
      await simulateTyping({
        word,
        delayMs: 100,
        onType: (word) => {
          setValue(
            `entries.${index}.${type}` as FieldPath<TranslationsForm>,
            word
          );
        },
      });
    },
    [setValue]
  );

  useMount(async () => {
    reset(defaultValues);

    await fillEntry('Super', 0, 'sourceWord');
    await fillEntry('Sjuper', 0, 'targetWord');

    await fillEntry('Pigeon', 1, 'sourceWord');
    await fillEntry('Szczypiorek', 1, 'targetWord');

    setIsFilled(true);
  });

  return (
    <FormProvider {...form}>
      <Box boxShadow="inner" width="100%" backgroundColor="paper">
        <Box
          maxHeight="230px"
          overflow="auto"
          pointerEvents={isFilled ? undefined : 'none'}
          sx={{
            textarea: {
              resize: 'none',
            },
            '.caption': {
              display: 'none',
            },
          }}
        >
          <TranslationsTable />
        </Box>
      </Box>
    </FormProvider>
  );
};
