import { useTranslateDocumentStore } from '../stores/useTranslateDocumentStore';
import { useCallback } from 'react';
import { translatedEntriesToString } from '../translatedEntriesToString';
import { downloadAsText } from '@skryba/shared-frontend';

export const useExportTranslatedDocument = () => {
  const translatedContent = useTranslateDocumentStore(
    (store) => store.translatedContent
  );
  const file = useTranslateDocumentStore((store) => store.file);

  return useCallback(() => {
    const newFileName = file?.name.replace('.txt', '') ?? 'translation.txt';
    const text = translatedEntriesToString(translatedContent);

    downloadAsText(text, `${newFileName}-translated.txt`);
  }, [file, translatedContent]);
};
