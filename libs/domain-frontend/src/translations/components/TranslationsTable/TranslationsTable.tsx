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
import React, { useCallback } from 'react';
import { TranslationsTableEntryRow } from './EntryRow/TranslationsTableEntryRow';
import { TranslationsTableUpload } from './Upload/TranslationsTableUpload';
import { DownloadIcon } from '@chakra-ui/icons';
import { useExport } from '../../hooks/useExport';
import { TranslationsTableClearAll } from './ClearAll/TranslationsTableClearAll';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  initialTranslationEntry,
  TranslationEntry,
  TranslationsForm,
} from '@skryba/domain-types';
import { isLast } from '@skryba/shared';

export const TranslationsTable = () => {
  const form = useFormContext<TranslationsForm>();
  const { append, fields, remove } = useFieldArray<TranslationEntry>({
    name: 'entries',
    control: form.control,
    keyName: 'id',
  });

  const handleExport = useExport();

  const handleAdd = useCallback(
    () =>
      append(
        {
          ...initialTranslationEntry,
        },
        false
      ),
    [append]
  );

  return (
    <Table>
      <TableCaption placement="top">
        <ButtonGroup>
          <TranslationsTableUpload />
          <Button
            colorScheme="primaryScheme"
            disabled={!fields.length}
            onClick={handleExport}
            leftIcon={<DownloadIcon />}
          >
            Export
          </Button>
          <TranslationsTableClearAll
            entries={fields}
            setValue={form.setValue}
          />
        </ButtonGroup>
      </TableCaption>
      <Thead>
        <Tr>
          <Th>Word</Th>
          <Th>Translation</Th>
        </Tr>
      </Thead>
      <Tbody>
        {fields.map((entry, index) => (
          <TranslationsTableEntryRow
            entry={entry}
            onRemove={remove}
            key={entry.id}
            index={index}
            onAdd={handleAdd}
            isLast={isLast(index, fields)}
            register={form.register}
            setValue={form.setValue}
          />
        ))}
      </Tbody>
    </Table>
  );
};
