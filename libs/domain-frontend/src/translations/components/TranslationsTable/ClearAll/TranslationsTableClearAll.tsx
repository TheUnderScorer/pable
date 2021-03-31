import React, { MutableRefObject, useCallback, useRef, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Button, ButtonGroup, Text } from '@chakra-ui/react';
import { Dialog } from '@skryba/shared-frontend';
import { useToggle } from 'react-use';
import { UseFormMethods } from 'react-hook-form';
import {
  initialTranslationEntry,
  TranslationEntry,
} from '@skryba/domain-types';

export interface TranslationsTableClearAllProps
  extends Pick<UseFormMethods, 'setValue'> {
  entries: TranslationEntry[];
}

export const TranslationsTableClearAll = ({
  entries,
  setValue,
}: TranslationsTableClearAllProps) => {
  const [open, toggleOpen] = useToggle(false);
  const [loading, setLoading] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>();

  const handleClear = useCallback(async () => {
    setLoading(true);

    setValue('entries', [
      {
        ...initialTranslationEntry,
      },
    ]);

    setLoading(false);

    toggleOpen(false);
  }, [setValue, toggleOpen]);

  return (
    <>
      <Button
        id="clear_all"
        isLoading={loading}
        onClick={() => toggleOpen()}
        colorScheme="dangerScheme"
        disabled={!entries?.length}
        leftIcon={<DeleteIcon />}
      >
        Clear entries
      </Button>
      <Dialog
        title="Clear all entries"
        footer={
          <ButtonGroup>
            <Button
              isDisabled={loading}
              onClick={() => toggleOpen()}
              ref={cancelRef as MutableRefObject<HTMLButtonElement>}
            >
              Cancel
            </Button>
            <Button
              isLoading={loading}
              colorScheme="dangerScheme"
              onClick={handleClear}
            >
              Delete all entries
            </Button>
          </ButtonGroup>
        }
        leastDestructiveRef={cancelRef}
        isOpen={open}
        onClose={toggleOpen}
      >
        <Text>
          Are you sure you want to remove all {entries?.length} entries?
        </Text>
        <Text>It cannot be undone!</Text>
      </Dialog>
    </>
  );
};
