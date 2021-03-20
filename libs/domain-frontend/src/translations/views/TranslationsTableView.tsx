import { Stack } from '@chakra-ui/react';
import React from 'react';
import { TranslationsConfiguration } from '../components/TranslationsConfiguration/TranslationsConfiguration';
import { TranslationsTable } from '../components/TranslationsTable/TranslationsTable';

export const TranslationsTableView = () => {
  return (
    <Stack>
      <TranslationsConfiguration />
      <TranslationsTable />
    </Stack>
  );
};
