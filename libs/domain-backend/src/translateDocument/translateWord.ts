import { TranslationEntry } from '@skryba/domain-types';
import { replaceMatches } from './replaceMatches';

export const translateWord = (
  translation: TranslationEntry,
  document: string,
  allMatches: string[]
) => {
  const regex = new RegExp(`(?<!\\w)${translation.sourceWord}(?!\\w)`, 'gi');

  return document.replace(regex, replaceMatches(allMatches, document));
};
