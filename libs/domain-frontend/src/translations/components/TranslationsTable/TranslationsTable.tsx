import { Table, TableCaption, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { useTranslationsStore } from '../../stores/useTranslationsStore';
import { TranslationsTableAddRow } from './AddRow/TranslationsTableAddRow';
import { TranslationsTableEntryRow } from './EntryRow/TranslationsTableEntryRow';

export const TranslationsTable = () => {
  const entries = useTranslationsStore((store) => store.translations);

  return (
    <Table>
      <TableCaption>Enter your translations here.</TableCaption>
      <Thead>
        <Tr>
          <Th>Word</Th>
          <Th>Translation</Th>
        </Tr>
      </Thead>
      <Tbody>
        {entries.map((entry, index) => (
          <TranslationsTableEntryRow key={index} index={index} entry={entry} />
        ))}
        <TranslationsTableAddRow />
      </Tbody>
    </Table>
  );
};
