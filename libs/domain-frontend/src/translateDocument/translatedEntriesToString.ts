import {
  isTranslatedDocumentEntry,
  TranslatedDocumentEntries,
} from '@skryba/domain-types';

export const translatedEntriesToString = (
  entries: TranslatedDocumentEntries
) => {
  return entries
    .map((entry) => {
      if (!isTranslatedDocumentEntry(entry)) {
        return entry;
      }

      return entry.isRestored
        ? entry.word.trim()
        : entry.translation.targetWord.trim();
    })
    .join('');
};
