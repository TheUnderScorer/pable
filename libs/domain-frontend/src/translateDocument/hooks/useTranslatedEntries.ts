import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslateDocumentStore } from '../stores/useTranslateDocumentStore';
import { getTranslationsFromLocalStorage } from '../../translations/getTranslationsFromLocalStorage';
import { readFileAsText } from '@skryba/shared-frontend';
import { useTranslateDocument } from './useTranslateDocument';
import { TranslateDocumentResult } from '@skryba/domain-types';

export const useTranslatedEntries = (
  translateOnMount = true,
  onSuccess?: (data: TranslateDocumentResult) => void
) => {
  const translateDocumentMutation = useTranslateDocument({
    onSuccess: (data) => {
      if (data.document) {
        setTranslatedContent(data.document);

        onSuccess?.(data);
      }
    },
  });

  const [translatedOnMount, setTranslatedOnMount] = useState(!translateOnMount);

  const translationEntries = useMemo(
    () =>
      getTranslationsFromLocalStorage()?.filter(
        (translation) => translation.targetWord && translation.sourceWord
      ) ?? [],
    []
  );

  const fileContent = useTranslateDocumentStore((store) => store.fileContent);
  const translatedContent = useTranslateDocumentStore(
    (store) => store.translatedContent
  );

  const setTranslatedContent = useTranslateDocumentStore(
    (store) => store.setTranslatedContent
  );
  const setFile = useTranslateDocumentStore((store) => store.setFile);
  const setFileContent = useTranslateDocumentStore(
    (store) => store.setFileContent
  );

  const handleTranslate = useCallback(
    async (file: File) => {
      setTranslatedOnMount(true);

      const contentRaw = await readFileAsText(file);
      const content = contentRaw.toString();

      await translateDocumentMutation.mutateAsync({
        content,
        translations: translationEntries,
      });

      setFileContent(content);
      setFile({
        name: file.name,
        size: file.size,
      });
    },
    [setFile, setFileContent, translateDocumentMutation, translationEntries]
  );

  useEffect(() => {
    setTranslatedOnMount(!translateOnMount);
  }, [translateOnMount]);

  useEffect(() => {
    if (fileContent && !translatedOnMount) {
      translateDocumentMutation.mutate({
        content: fileContent,
        translations: translationEntries,
        previousTranslatedDocument: translatedContent,
      });

      setTranslatedOnMount(true);
    }
  }, [
    fileContent,
    setTranslatedContent,
    translateDocumentMutation,
    translatedContent,
    translatedOnMount,
    translationEntries,
  ]);

  useEffect(() => {
    if (translateDocumentMutation.error) {
      setFileContent(undefined);
      setFile(undefined);
    }
  }, [setFile, setFileContent, translateDocumentMutation.error]);

  return {
    loading: translateDocumentMutation.isLoading,
    translatedContent,
    handleTranslate,
    translatedOnMount,
    error: translateDocumentMutation.error,
  };
};
