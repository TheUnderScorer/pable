import React, { memo } from 'react';
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import { TranslationEntry } from '@skryba/domain-types';
import { useTranslateDocumentStore } from '../../../stores/useTranslateDocumentStore';

export interface TranslatedDocumentRestoredEntryProps {
  text: string;
  index: number;
  translationEntry: TranslationEntry;
}

const BaseTranslatedDocumentRestoredEntry = ({
  index,
  text,
  translationEntry,
}: TranslatedDocumentRestoredEntryProps) => {
  const restoreTranslation = useTranslateDocumentStore(
    (store) => store.restoreTranslation
  );

  return (
    <Popover>
      <PopoverTrigger>
        <Button color="inherit" variant="link" minWidth="0">
          {text}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Restored word</PopoverHeader>
        <PopoverBody>
          Restored word from translation:{' '}
          <strong>{translationEntry.targetWord}</strong>
        </PopoverBody>
        <PopoverFooter>
          <Button onClick={() => restoreTranslation(index)}>
            Restore translation
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export const TranslatedDocumentRestoredEntry = memo(
  BaseTranslatedDocumentRestoredEntry
);
