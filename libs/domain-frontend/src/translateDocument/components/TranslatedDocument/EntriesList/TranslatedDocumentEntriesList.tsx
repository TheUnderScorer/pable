import React, { useMemo } from 'react';
import { Box, List, Text } from '@chakra-ui/react';
import { TranslatedDocumentEntriesListItem } from './Item/TranslatedDocumentEntriesListItem';
import {
  isTranslatedDocumentEntry,
  TranslatedDocumentEntries,
} from '@skryba/domain-types';
import { countBy, groupBy } from 'remeda';

export interface TranslatedDocumentEntriesListProps {
  entries: TranslatedDocumentEntries;
  highlight?: string;
}

export const TranslatedDocumentEntriesList = ({
  entries,
  highlight,
}: TranslatedDocumentEntriesListProps) => {
  const translatedEntries = useMemo(
    () => entries.filter(isTranslatedDocumentEntry),
    [entries]
  );

  const groupedEntries = useMemo(
    () => groupBy(translatedEntries, (entry) => entry.word),
    [translatedEntries]
  );

  return (
    <Box overflowY="auto" overflowX="hidden" width="100%" flex={1}>
      <Text fontWeight="bold" fontSize="md" mb={2}>
        Translated entries({translatedEntries.length}):{' '}
      </Text>
      <List>
        {Object.values(groupedEntries).map((entries) => {
          let renderedRestored = false;
          let renderedTranslation = false;

          const restoredLength = countBy(entries, (entry) => entry.isRestored);
          const translationsLength = countBy(
            entries,
            (entry) => !entry.isRestored
          );

          return entries.map((entry) => {
            if (
              (entry.isRestored && !renderedRestored) ||
              (!entry.isRestored && !renderedTranslation)
            ) {
              if (entry.isRestored) {
                renderedRestored = true;
              } else {
                renderedTranslation = true;
              }

              return (
                <TranslatedDocumentEntriesListItem
                  highlight={entry.word === highlight}
                  count={entry.isRestored ? restoredLength : translationsLength}
                  isRestored={entry.isRestored}
                  key={entry.key}
                  entry={entry}
                />
              );
            }

            return null;
          });
        })}
      </List>
    </Box>
  );
};
