import { Box, Stack } from '@chakra-ui/react';
import React from 'react';
import { TranslationsConfiguration } from '../components/TranslationsConfiguration/TranslationsConfiguration';
import { TranslationsTable } from '../components/TranslationsTable/TranslationsTable';
import { FormProvider } from 'react-hook-form';
import { initialTranslationEntry, TranslationsForm } from '@pable/domain-types';
import { useLocalStorageForm } from '@pable/shared-frontend';

export const TranslationsTableView = () => {
  const form = useLocalStorageForm<TranslationsForm>({
    defaultValues: {
      entries: [
        {
          ...initialTranslationEntry,
        },
      ],
      newEntry: {},
    },
    localStorageKey: 'translationsForm',
    shouldUnregister: false,
  });

  return (
    <FormProvider {...form}>
      <Box as="form" onSubmit={form.handleSubmit(console.log)}>
        <Stack>
          <TranslationsConfiguration />
          <TranslationsTable />
        </Stack>
      </Box>
    </FormProvider>
  );
};
