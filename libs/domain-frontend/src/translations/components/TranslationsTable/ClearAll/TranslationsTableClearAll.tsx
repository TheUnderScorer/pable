import React, { useCallback } from 'react';
import { Button } from '@chakra-ui/react';
import { FaIcon, useConfirmationDialog } from '@skryba/shared-frontend';
import { UseFormReturn } from 'react-hook-form';
import {
  initialTranslationEntry,
  TranslationEntry,
  TranslationsForm,
} from '@skryba/domain-types';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export interface TranslationsTableClearAllProps
  extends Pick<UseFormReturn<TranslationsForm>, 'setValue'> {
  entries: TranslationEntry[];
}

export const TranslationsTableClearAll = ({
  entries,
  setValue,
}: TranslationsTableClearAllProps) => {
  const clear = useCallback(async () => {
    setValue('entries', [
      {
        ...initialTranslationEntry,
      },
    ]);
  }, [setValue]);

  const handleClear = useConfirmationDialog({
    onConfirm: clear,
    confirmText: 'Clear entries',
    title: 'Clear all entries',
    content: `Are you sure you want to remove all ${entries?.length} entries?`,
    confirmColorScheme: 'dangerScheme',
  });

  return (
    <Button
      id="clear_all"
      onClick={handleClear}
      colorScheme="dangerScheme"
      disabled={!entries?.length}
      leftIcon={<FaIcon icon={faTrash} />}
    >
      Clear entries
    </Button>
  );
};
