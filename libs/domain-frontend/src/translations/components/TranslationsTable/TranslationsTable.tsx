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
import { useExport } from '../../hooks/useExport';
import { TranslationsTableClearAll } from './ClearAll/TranslationsTableClearAll';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  initialTranslationEntry,
  TranslationsForm,
} from '@skryba/domain-types';
import { isLast } from '@skryba/shared';
import { FaIcon } from '@skryba/shared-frontend';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export const TranslationsTable = () => {
  const form = useFormContext<TranslationsForm>();
  const { append, fields, remove } = useFieldArray({
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
        {
          shouldFocus: false,
        }
      ),
    [append]
  );

  return (
    <Table>
      <TableCaption className="caption" placement="top">
        <ButtonGroup>
          <TranslationsTableUpload />
          <Button
            id="export_entries"
            colorScheme="primaryScheme"
            disabled={!fields.length}
            onClick={handleExport}
            leftIcon={<FaIcon icon={faDownload} />}
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
            itemsCount={fields.length}
            onRemove={remove}
            key={entry.id}
            index={index}
            onAdd={handleAdd}
            isLast={isLast(index, fields)}
            setValue={form.setValue}
          />
        ))}
      </Tbody>
    </Table>
  );
};
