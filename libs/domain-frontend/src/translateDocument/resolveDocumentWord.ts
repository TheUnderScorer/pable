import { TranslatedDocumentEntry } from '@skryba/domain-types';

export const resolveDocumentWord = ({
  word,
  translation,
  isRestored,
}: Pick<TranslatedDocumentEntry, 'word' | 'translation' | 'isRestored'>) =>
  isRestored ? word : translation.targetWord;
