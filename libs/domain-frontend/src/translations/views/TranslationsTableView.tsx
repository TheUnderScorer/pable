import { Box, Stack } from '@chakra-ui/react';
import React from 'react';
import { TranslationsConfiguration } from '../components/TranslationsConfiguration/TranslationsConfiguration';
import { TranslationsTable } from '../components/TranslationsTable/TranslationsTable';
import { FormProvider } from 'react-hook-form';
import {
  initialTranslationEntry,
  TranslationsForm,
} from '@skryba/domain-types';
import { useLocalStorageForm } from '@skryba/shared-frontend';
import { TranslationsErrorBoundary } from '../components/TranslationsErrorBoundary/TranslationsErrorBoundary';

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
  });

  return (
    <FormProvider {...form}>
      <TranslationsErrorBoundary
        clearEntries={() => {
          form.setValue('entries', [
            {
              ...initialTranslationEntry,
            },
          ]);

          setTimeout(() => {
            window.location.reload();
          }, 500);
        }}
      >
        <Box as="form">
          <Stack>
            <TranslationsConfiguration />
            <TranslationsTable />
          </Stack>
        </Box>
      </TranslationsErrorBoundary>
    </FormProvider>
  );
};
