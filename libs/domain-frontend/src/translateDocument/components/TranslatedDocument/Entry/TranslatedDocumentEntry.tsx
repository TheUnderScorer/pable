import React, { memo, useEffect, useState } from 'react';
import {
  TranslatedDocumentEntry as TranslatedDocumentEntryType,
  TranslationEntry,
} from '@skryba/domain-types';
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
import { resolveDocumentWord } from '../../../resolveDocumentWord';
import { equals, omit } from 'remeda';

export interface TranslatedDocumentEntryProps
  extends Pick<
    TranslatedDocumentEntryType,
    'translation' | 'id' | 'word' | 'isRestored'
  > {
  highlight?: boolean;
}

const BaseTranslatedEntry = ({
  highlight,
  translation,
  id,
  word,
  isRestored,
}: TranslatedDocumentEntryProps) => {
  const restoreWord = useTranslateDocumentStore((store) => store.restoreWord);
  const restoreTranslation = useTranslateDocumentStore(
    (store) => store.restoreTranslation
  );
  const setHighlightInList = useTranslateDocumentStore(
    (store) => store.setHighlightedWordInList
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHighlightInList(open ? word : undefined);
  }, [word, open, setHighlightInList]);

  useUnmount(() => {
    if (open) {
      setHighlightInList(undefined);
    }
  });

  const wordToShow = resolveDocumentWord({
    word,
    translation,
    isRestored,
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
          className={
            isRestored
              ? 'translated-restored-entry-trigger'
              : 'translated-entry-trigger'
          }
          variant="link"
          bg={highlight && !isRestored ? 'primary' : undefined}
          color={highlight ? 'white' : isRestored ? 'inherit' : 'primary'}
          m={0}
          py={highlight ? 1 : 0}
          px={1}
          minWidth="0"
        >
          {wordToShow}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Manage translation</PopoverHeader>
        <PopoverBody>
          {isRestored ? (
            <>
              Restored word from translation:{' '}
              <strong>{translation.targetWord}</strong>
            </>
          ) : (
            <>
              Translated from: <strong>{word}</strong>
            </>
          )}
        </PopoverBody>
        <PopoverFooter>
          <Button
            onClick={() => {
              isRestored ? restoreTranslation(id) : restoreWord(id);

              setOpen(false);
            }}
          >
            {isRestored ? 'Restore translation' : 'Restore original word'}
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export const TranslatedDocumentEntry = memo(
  BaseTranslatedEntry,
  (prevProps, nextProps) => {
    const omitKeys = ['translation'] as Array<
      keyof TranslatedDocumentEntryProps
    >;

    const omitTranslationKeys = ['alternatives'] as Array<
      keyof TranslationEntry
    >;

    const prevPropsToCompare = omit(prevProps, omitKeys);
    const nextPropsToCompare = omit(nextProps, omitKeys);

    if (!equals(prevPropsToCompare, nextPropsToCompare)) {
      return false;
    }

    return equals(
      omit(prevProps.translation, omitTranslationKeys),
      omit(nextProps.translation, omitTranslationKeys)
    );
  }
);
