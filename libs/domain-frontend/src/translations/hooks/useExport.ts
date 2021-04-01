import { useCallback } from 'react';
import { separator } from '../constants';
import { useFormContext } from 'react-hook-form';
import { TranslationsForm } from '@skryba/domain-types';
import { downloadAsText } from '@skryba/shared-frontend';

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

    downloadAsText(entriesForExport, 'words.txt');
  }, [getValues]);
};
