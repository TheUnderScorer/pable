import { useCallback } from 'react';
import { separator } from '../constants';
import download from 'downloadjs';
import { useFormContext } from 'react-hook-form';
import { TranslationsForm } from '@pable/domain-types';

const formatWord = (word?: string) => word?.replace(/\n/g, ' ') ?? '';

export const useExport = () => {
  const { getValues } = useFormContext<TranslationsForm>();

  return useCallback(() => {
    const entriesForExport = getValues()
      .entries.map(
        (entry) =>
          `${formatWord(entry.sourceWord)}${separator}${formatWord(
            entry.targetWord
          )}`
      )
      .join('\n');

    const blob = new Blob([entriesForExport], {
      type: 'type: "text/plain;charset=utf-8"',
    });

    download(blob, 'words.txt');
  }, [getValues]);
};
