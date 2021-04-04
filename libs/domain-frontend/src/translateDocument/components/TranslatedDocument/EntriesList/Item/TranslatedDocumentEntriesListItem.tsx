import React, { memo } from 'react';
import { HStack, ListItem, Text, Tooltip } from '@chakra-ui/react';
import { FaIcon } from '@skryba/shared-frontend';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { TranslatedDocumentEntry } from '@skryba/domain-types';
import { useTranslateDocumentStore } from '../../../../stores/useTranslateDocumentStore';
import classNames from 'classnames';

export interface TranslatedDocumentEntriesListItemProps {
  entry: TranslatedDocumentEntry;
  isRestored?: boolean;
  count: number;
  highlight?: boolean;
}

const BaseTranslatedDocumentEntriesListItem = ({
  entry,
  isRestored,
  count,
  highlight,
}: TranslatedDocumentEntriesListItemProps) => {
  const setHighlightedWord = useTranslateDocumentStore(
    (store) => store.setHighlightedWordInDocument
  );
  const { word, translation } = entry;

  return (
    <ListItem
      className={classNames('translation-list-item', { highlight })}
      bg={highlight ? 'primary' : undefined}
      color={highlight ? 'white' : undefined}
      onMouseEnter={() => {
        setHighlightedWord(word);
      }}
      onMouseLeave={() => setHighlightedWord(undefined)}
      mb={2}
    >
      <HStack>
        <Tooltip transition="none" label={word}>
          <Text as={isRestored ? 's' : undefined} isTruncated>
            {word}
          </Text>
        </Tooltip>
        <FaIcon icon={faArrowRight} />
        <Tooltip label={translation.targetWord}>
          <Text as={isRestored ? 's' : undefined} isTruncated>
            {translation.targetWord}
            {count > 1 && `(${count})`}
          </Text>
        </Tooltip>
      </HStack>
    </ListItem>
  );
};

export const TranslatedDocumentEntriesListItem = memo(
  BaseTranslatedDocumentEntriesListItem
);
