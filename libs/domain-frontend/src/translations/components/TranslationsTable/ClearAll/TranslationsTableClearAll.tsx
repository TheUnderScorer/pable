import React, { MutableRefObject, useRef } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Button, ButtonGroup, Text } from '@chakra-ui/react';
import { useTranslationsStore } from '../../../stores/useTranslationsStore';
import { Dialog } from '@pable/shared-frontend';
import { useToggle } from 'react-use';

export const TranslationsTableClearAll = () => {
  const [open, toggleOpen] = useToggle(false);
  const cancelRef = useRef<HTMLButtonElement>();

  const clear = useTranslationsStore((store) => store.clear);
  const entries = useTranslationsStore((store) => store.translations);

  return (
    <>
      <Button
        onClick={() => toggleOpen()}
        colorScheme="dangerScheme"
        disabled={!entries.length}
        leftIcon={<DeleteIcon />}
      >
        Clear entries
      </Button>
      <Dialog
        title="Clear all entries"
        footer={
          <ButtonGroup>
            <Button
              onClick={() => toggleOpen()}
              ref={cancelRef as MutableRefObject<HTMLButtonElement>}
            >
              Cancel
            </Button>
            <Button
              colorScheme="dangerScheme"
              onClick={() => {
                clear();

                toggleOpen();
              }}
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
          Are you sure you want to remove all {entries.length} entries?
        </Text>
        <Text>It cannot be undone!</Text>
      </Dialog>
    </>
  );
};
