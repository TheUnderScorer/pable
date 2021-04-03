import {
  isTranslatedDocumentEntry,
  TranslatedDocumentEntries,
} from '@skryba/domain-types';
import { resolveDocumentWord } from './resolveDocumentWord';

export const translatedEntriesToString = (
  entries: TranslatedDocumentEntries
) => {
  return entries
    .map((entry) => {
      if (!isTranslatedDocumentEntry(entry)) {
        return entry;
      }

      return resolveDocumentWord(entry);
    })
    .join('');
};
