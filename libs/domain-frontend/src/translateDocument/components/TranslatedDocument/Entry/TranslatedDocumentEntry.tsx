import React, { memo, useEffect, useState } from 'react';
import { TranslationEntry } from '@skryba/domain-types';
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
import { useTranslateDocumentStore } from '../../../stores/useTranslateDocumentStore';
import { useUnmount } from 'react-use';

export interface TranslatedDocumentEntryProps {
  text: string;
  translation: TranslationEntry;
  arrayIndex: number;
  highlight?: boolean;
}

const BaseTranslatedEntry = ({
  translation,
  text,
  arrayIndex,
  highlight,
}: TranslatedDocumentEntryProps) => {
  const restoreWord = useTranslateDocumentStore((store) => store.restoreWord);
  const setHighlightInList = useTranslateDocumentStore(
    (store) => store.setHighlightedWordInList
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHighlightInList(open ? text : undefined);
  }, [text, open, setHighlightInList]);

  useUnmount(() => {
    if (open) {
      setHighlightInList(undefined);
    }
  });

  return (
    <Popover
      isLazy
      isOpen={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <PopoverTrigger>
        <Button
          className="translated-entry-trigger"
          variant="link"
          bg={highlight ? 'primary' : undefined}
          color={highlight ? 'white' : 'primary'}
          m={0}
          py={highlight ? 1 : 0}
          px={1}
          minWidth="0"
        >
          {translation.targetWord}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Translation</PopoverHeader>
        <PopoverBody>
          Translated from: <strong>{text}</strong>
        </PopoverBody>
        <PopoverFooter>
          <Button onClick={() => restoreWord(arrayIndex)}>
            Restore original word
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export const TranslatedDocumentEntry = memo(BaseTranslatedEntry);
