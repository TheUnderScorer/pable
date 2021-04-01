import { useCallback, useEffect, useMemo, useState } from 'react';
import { translateDocument } from '../translateDocument';
import { useTranslateDocumentStore } from '../stores/useTranslateDocumentStore';
import { getTranslationsFromLocalStorage } from '../../translations/getTranslationsFromLocalStorage';
import { readFileAsText } from '@skryba/shared-frontend';

export const useTranslatedEntries = () => {
  const [translatedOnMount, setTranslatedOnMount] = useState(false);

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

      setFileContent(content.toString());
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
    if (fileContent && !translatedOnMount) {
      setTranslatedContent(
        translateDocument({
          content: fileContent,
          translations: translationEntries,
        })
      );

      setTranslatedOnMount(true);
    }
  }, [
    fileContent,
    setTranslatedContent,
    translatedOnMount,
    translationEntries,
  ]);

  return {
    loading,
    translatedContent,
    handleTranslate,
  };
};
