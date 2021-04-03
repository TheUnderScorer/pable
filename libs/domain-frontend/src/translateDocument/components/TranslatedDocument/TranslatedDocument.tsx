import React, { memo } from 'react';
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
      {translatedDocument.map((entry) => {
        if (typeof entry === 'string') {
          return entry;
        }

        const highlight = highlightedWord === entry.word;

        return (
          <TranslatedDocumentEntry
            isRestored={entry.isRestored}
            key={entry.id}
            id={entry.id}
            word={entry.word}
            translation={entry.translation}
            highlight={highlight}
          />
        );
      })}
    </Box>
  );
};

export const TranslatedDocument = memo(BaseTranslatedDocument);
