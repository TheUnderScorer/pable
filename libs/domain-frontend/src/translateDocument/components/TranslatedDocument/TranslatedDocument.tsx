import React, { memo } from 'react';
import { TranslatedDocumentRestoredEntry } from './RestoredEntry/TranslatedDocumentRestoredEntry';
import { TranslatedDocumentEntries } from '@skryba/domain-types';
import { TranslatedDocumentEntry } from './Entry/TranslatedDocumentEntry';
import { Box } from '@chakra-ui/react';

export interface TranslatedDocumentProps {
  translatedDocument: TranslatedDocumentEntries;
  highlightedWord?: string;
}

const BaseTranslatedDocument = ({
  translatedDocument,
  highlightedWord,
}: TranslatedDocumentProps) => {
  return (
    <Box className="translated-document">
      {translatedDocument.map((entry, index) => {
        if (typeof entry === 'string') {
          return entry;
        }

        const highlight = highlightedWord === entry.word;

        return entry.isRestored ? (
          <TranslatedDocumentRestoredEntry
            key={`${entry.word}-${entry.arrayIndex}`}
            text={entry.word}
            index={index}
            translationEntry={entry.translation}
          />
        ) : (
          <TranslatedDocumentEntry
            key={`${entry.word}-${entry.arrayIndex}`}
            text={entry.word}
            translation={entry.translation}
            arrayIndex={entry.arrayIndex}
            highlight={highlight}
          />
        );
      })}
    </Box>
  );
};

export const TranslatedDocument = memo(BaseTranslatedDocument);
