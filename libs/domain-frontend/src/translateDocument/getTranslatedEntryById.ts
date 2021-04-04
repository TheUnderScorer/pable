import {
  isTranslatedDocumentEntry,
  TranslatedDocumentEntries,
  TranslatedDocumentEntry,
} from '@skryba/domain-types';

export const getTranslatedEntryById = (
  entries: TranslatedDocumentEntries,
  id: string
) => {
  return entries.find(
    (entry) => isTranslatedDocumentEntry(entry) && entry.id === id
  ) as TranslatedDocumentEntry | undefined;
};
