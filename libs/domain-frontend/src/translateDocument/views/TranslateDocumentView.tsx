import React, { useCallback, useEffect } from 'react';
import { clientRoutes, FileDropzone } from '@skryba/shared-frontend';
import { Button, Center, Spinner, VStack } from '@chakra-ui/react';
import { useTranslateDocumentStore } from '../stores/useTranslateDocumentStore';
import { useTranslatedEntries } from '../hooks/useTranslatedEntries';
import { TranslateDocumentOnboard } from '../components/TranslateDocumentOnboard/TranslateDocumentOnboard';
import { TranslatedDocumentContent } from '../components/TranslatedDocument/Content/TranslatedDocumentContent';
import { useLocalStorage } from 'react-use';
import { Link, useHistory, useLocation } from 'react-router-dom';

export const TranslateDocumentView = () => {
  const location = useLocation();
  const tutorial = location.search?.includes('tutorial=1');
  const history = useHistory();

  const [onboardFinished, setOnboardFinished] = useLocalStorage(
    'didTranslateDocumentOnboard',
    false
  );
  const content = useTranslateDocumentStore((store) => store.fileContent);

  const {
    translatedContent,
    loading,
    handleTranslate,
    translatedOnMount,
  } = useTranslatedEntries(onboardFinished);

  const handleFile = useCallback(
    async (files: File[]) => {
      const [file] = files;
      await handleTranslate(file);
    },
    [handleTranslate]
  );

  useEffect(() => {
    if (tutorial) {
      setOnboardFinished(false);
    }
  }, [setOnboardFinished, tutorial]);

  return (
    <Center flex={1}>
      <TranslateDocumentOnboard
        finished={onboardFinished}
        onFinish={() => {
          setOnboardFinished(true);

          if (tutorial) {
            history.push(clientRoutes.translateDocument);
          }
        }}
      />
      {(!content || !onboardFinished) && (
        <VStack width="100%" spacing={6}>
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

          {onboardFinished && (
            <Link
              to={{
                search: 'tutorial=1',
              }}
            >
              <Button size="xs">Show tutorial again</Button>
            </Link>
          )}
        </VStack>
      )}
      {translatedContent && content && onboardFinished && (
        <>
          {!translatedOnMount && <Spinner />}
          {translatedOnMount && <TranslatedDocumentContent />}
        </>
      )}
    </Center>
  );
};
