import React from 'react';
import { VStack } from '@chakra-ui/react';
import { TranslatedDocumentDisplaySwitch } from '../DisplaySwitch/TranslatedDocumentDisplaySwitch';
import {
  TranslatedDocumentEntriesList,
  TranslatedDocumentEntriesListProps,
} from '../EntriesList/TranslatedDocumentEntriesList';
import { TranslatedDocumentSidebarButtons } from './Buttons/TranslatedDocumentSidebarButtons';

export type TranslatedDocumentSidebarProps = Pick<
  TranslatedDocumentEntriesListProps,
  'entries' | 'highlight'
>;

export const TranslatedDocumentSidebar = ({
  entries,
  highlight,
}: TranslatedDocumentSidebarProps) => {
  return (
    <VStack
      className="translated-document-sidebar"
      minWidth={350}
      height="80vh"
      spacing={6}
      alignItems="flex-start"
      width="30%"
      top={0}
      position="sticky"
      bg="paper"
      p={6}
      rounded="md"
      boxShadow="base"
    >
      <TranslatedDocumentDisplaySwitch />
      <TranslatedDocumentEntriesList highlight={highlight} entries={entries} />
      <TranslatedDocumentSidebarButtons />
    </VStack>
  );
};
