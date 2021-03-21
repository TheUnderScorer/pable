import { useTranslationsStore } from '../stores/useTranslationsStore';
import { useCallback } from 'react';
import { separator } from '../constants';
import download from 'downloadjs';

const formatWord = (word: string) => word.replace(/\n/g, ' ');

export const useExport = () => {
  const entries = useTranslationsStore((store) => store.translations);

  return useCallback(() => {
    const entriesForExport = entries
      .map(
        (entry) =>
          `${formatWord(entry.sourceWord)}${separator}${formatWord(
            entry.targetWord
          )}`
      )
      .join('\n');

    download(entriesForExport, 'words.txt', 'text/plain');
  }, [entries]);
};
