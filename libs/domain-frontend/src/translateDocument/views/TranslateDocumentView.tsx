import React, { useCallback } from 'react';
import { FileDropzone } from '@skryba/shared-frontend';
import { Box, Center, HStack, Spinner, Text } from '@chakra-ui/react';
import {
  DocumentToDisplay,
  useTranslateDocumentStore,
} from '../stores/useTranslateDocumentStore';
import { useTranslatedEntries } from '../hooks/useTranslatedEntries';
import { TranslatedDocument } from '../components/TranslatedDocument/TranslatedDocument';
import { TranslatedDocumentSidebar } from '../components/TranslatedDocument/Sidebar/TranslatedDocumentSidebar';
import { TranslatedDocumentMenu } from '../components/TranslatedDocument/Menu/TranslatedDocumentMenu';

export const TranslateDocumentView = () => {
  const display = useTranslateDocumentStore((store) => store.display);
  const content = useTranslateDocumentStore((store) => store.fileContent);
  const file = useTranslateDocumentStore((store) => store.file);
  const highlightInDocument = useTranslateDocumentStore(
    (store) => store.highlightedWordInDocument
  );
  const highlightInList = useTranslateDocumentStore(
    (store) => store.highlightedWordInList
  );

  const {
    translatedContent,
    loading,
    handleTranslate,
    translatedOnMount,
  } = useTranslatedEntries();

  const handleFile = useCallback(
    async (files: File[]) => {
      const [file] = files;
      await handleTranslate(file);
    },
    [handleTranslate]
  );

  return (
    <Center flex={1}>
      {!content && (
        <FileDropzone
          buttonProps={{
            isLoading: loading,
            id: 'translate_document_file',
          }}
          onFile={handleFile}
          multiple={false}
          accept="text/plain"
        >
          Upload file
        </FileDropzone>
      )}
      {translatedContent && content && (
        <>
          {!translatedOnMount && <Spinner />}
          {translatedOnMount && (
            <HStack
              width="100%"
              spacing={8}
              position="relative"
              alignItems="flex-start"
            >
              <Box flex={1} bg="paper" p={6} rounded="md" boxShadow="lg">
                <HStack alignItems="center" mb={4}>
                  <Text className="file-name" fontSize="2xl">
                    {file?.name}{' '}
                    {display === DocumentToDisplay.Source && '(original)'}
                  </Text>
                  <TranslatedDocumentMenu />
                </HStack>
                <Text
                  display={
                    display === DocumentToDisplay.Translated ? 'block' : 'none'
                  }
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
                  display={
                    display === DocumentToDisplay.Source ? 'block' : 'none'
                  }
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
          )}
        </>
      )}
    </Center>
  );
};
