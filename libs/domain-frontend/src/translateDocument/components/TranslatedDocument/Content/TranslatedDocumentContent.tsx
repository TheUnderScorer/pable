import React from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';
import {
  DocumentToDisplay,
  useTranslateDocumentStore,
} from '../../../stores/useTranslateDocumentStore';
import { TranslatedDocumentMenu } from '../Menu/TranslatedDocumentMenu';
import { TranslatedDocument } from '../TranslatedDocument';
import { TranslatedDocumentSidebar } from '../Sidebar/TranslatedDocumentSidebar';
import { useTranslatedEntries } from '../../../hooks/useTranslatedEntries';

export const TranslatedDocumentContent = () => {
  const display = useTranslateDocumentStore((store) => store.display);
  const content = useTranslateDocumentStore((store) => store.fileContent);
  const file = useTranslateDocumentStore((store) => store.file);
  const highlightInDocument = useTranslateDocumentStore(
    (store) => store.highlightedWordInDocument
  );
  const highlightInList = useTranslateDocumentStore(
    (store) => store.highlightedWordInList
  );

  const { translatedContent } = useTranslatedEntries(false);

  return (
    <HStack
      width="100%"
      spacing={8}
      position="relative"
      alignItems="flex-start"
    >
      <Box flex={1} bg="paper" p={6} rounded="md" boxShadow="lg">
        <HStack alignItems="center" mb={4}>
          <Text className="file-name" fontSize="2xl">
            {file?.name} {display === DocumentToDisplay.Source && '(original)'}
          </Text>
          <TranslatedDocumentMenu />
        </HStack>
        <Text
          display={display === DocumentToDisplay.Translated ? 'block' : 'none'}
          as="div"
          whiteSpace="pre-line"
        >
          <TranslatedDocument
            highlightedWord={highlightInDocument}
            translatedDocument={translatedContent}
          />
        </Text>
        <Text
          className="original-document"
          display={display === DocumentToDisplay.Source ? 'block' : 'none'}
          as="div"
          whiteSpace="pre-line"
        >
          {content}
        </Text>
      </Box>
      <TranslatedDocumentSidebar
        highlight={highlightInList}
        entries={translatedContent}
      />
    </HStack>
  );
};
