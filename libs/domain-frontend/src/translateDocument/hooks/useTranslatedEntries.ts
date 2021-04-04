import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslateDocumentStore } from '../stores/useTranslateDocumentStore';
import { getTranslationsFromLocalStorage } from '../../translations/getTranslationsFromLocalStorage';
import { readFileAsText } from '@skryba/shared-frontend';
import { translateDocument } from '../translateDocument';

export const useTranslatedEntries = (translateOnMount = true) => {
  const [translatedOnMount, setTranslatedOnMount] = useState(!translateOnMount);

  const translationEntries = useMemo(
    () => getTranslationsFromLocalStorage(),
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

  const [loading, setLoading] = useState(false);

  const handleTranslate = useCallback(
    async (file: File) => {
      setTranslatedOnMount(true);

      setLoading(true);

      const contentRaw = await readFileAsText(file);
      const content = contentRaw.toString();

      setFileContent(content);
      setFile({
        name: file.name,
        size: file.size,
      });

      setTranslatedContent(
        translateDocument({
          content,
          translations: translationEntries,
        })
      );

      setLoading(false);
    },
    [setFile, setFileContent, setTranslatedContent, translationEntries]
  );

  useEffect(() => {
    setTranslatedOnMount(!translateOnMount);
  }, [translateOnMount]);

  useEffect(() => {
    if (fileContent && !translatedOnMount) {
      setLoading(true);

      setTranslatedContent(
        translateDocument({
          content: fileContent,
          translations: translationEntries,
          previousTranslatedDocument: translatedContent,
        })
      );

      setLoading(false);
      setTranslatedOnMount(true);
    }
  }, [
    fileContent,
    setTranslatedContent,
    translatedContent,
    translatedOnMount,
    translationEntries,
  ]);

  return {
    loading,
    translatedContent,
    handleTranslate,
    translatedOnMount,
  };
};
