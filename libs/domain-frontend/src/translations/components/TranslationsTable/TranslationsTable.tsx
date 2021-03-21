import {
  Button,
  ButtonGroup,
  Table,
  TableCaption,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslationsStore } from '../../stores/useTranslationsStore';
import { TranslationsTableAddRow } from './AddRow/TranslationsTableAddRow';
import { TranslationsTableEntryRow } from './EntryRow/TranslationsTableEntryRow';
import { TranslationsTableUpload } from './Upload/TranslationsTableUpload';
import { DownloadIcon } from '@chakra-ui/icons';
import { useExport } from '../../hooks/useExport';
import { TranslationsTableClearAll } from './ClearAll/TranslationsTableClearAll';

export const TranslationsTable = () => {
  const entries = useTranslationsStore((store) => store.translations);
  const handleExport = useExport();

  return (
    <Table>
      <TableCaption placement="top">
        <ButtonGroup>
          <TranslationsTableUpload />
          <Button
            colorScheme="primaryScheme"
            disabled={!entries.length}
            onClick={handleExport}
            leftIcon={<DownloadIcon />}
          >
            Export
          </Button>
          <TranslationsTableClearAll />
        </ButtonGroup>
      </TableCaption>
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
        <TranslationsTableAddRow key={entries.length} />
      </Tbody>
    </Table>
  );
};
