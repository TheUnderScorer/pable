import {
  isTranslatedDocumentEntry,
  TranslatedDocumentEntry,
  TranslateDocumentResult,
  TranslationEntry,
} from '@skryba/domain-types';
import { map, pipe, reduce, sortBy } from 'remeda';
import escapeStringRegexp from 'escape-string-regexp';
import { TranslateDocumentDto } from '@skryba/shared';
import { getTranslatedEntryById } from '@skryba/domain-shared';
import { separator } from './constants';
import { translateWord } from './translateWord';

const buildId = (
  translation: Pick<TranslationEntry, 'targetWord'>,
  index: number
) => `${translation.targetWord}-${index}`.replace(/\s/g, '');

export const translateDocument = ({
  content,
  translations,
  previousTranslatedDocument,
}: TranslateDocumentDto): TranslateDocumentResult => {
  let translatedEntries = 0;

  const nbspRegex = new RegExp(String.fromCharCode(160), 'g');
  const formattedContent = content.replace(nbspRegex, ' ');

  const formattedTranslations = pipe(
    translations,
    map((translation) => ({
      ...translation,
      sourceWord: escapeStringRegexp(
        translation.sourceWord?.replace(nbspRegex, ' ').trim() ?? ''
      ),
    })),
    sortBy((a) => a.sourceWord.length),
    (arr) => arr.reverse()
  );

  const allMatches: string[] = [];

  const translatedWordsWithSeparators = formattedTranslations.reduce(
    (currentResult, translation) => {
      if (!translation.sourceWord || !translation.targetWord) {
        return currentResult;
      }

      return translateWord(translation, currentResult, allMatches);
    },
    formattedContent
  );

  return pipe(
    formattedTranslations,
    reduce((currentResult, translation) => {
      if (!translation.sourceWord || !translation.targetWord) {
        return currentResult;
      }

      const regex = new RegExp(
        `${separator}${translation.sourceWord}${separator}`,
        'gi'
      );

      return currentResult.replace(regex, (match, index) => {
        const formattedMatch = match
          .replace(/\n/g, '')
          .replace(new RegExp(separator, 'g'), '');

        const id = buildId(translation, index);

        const prevEntry = getTranslatedEntryById(
          previousTranslatedDocument ?? [],
          id
        );

        const json = {
          translation,
          word: formattedMatch,
          id,
          isRestored: Boolean(prevEntry?.isRestored),
        } as TranslatedDocumentEntry;

        return `${separator}${JSON.stringify(json)}${separator}`;
      });
    }, translatedWordsWithSeparators),
    (val) => val.split(separator),
    map.indexed<string, TranslatedDocumentEntry | string>((item) => {
      try {
        const parsed = JSON.parse(item);

        if (isTranslatedDocumentEntry(parsed)) {
          translatedEntries++;
          return parsed;
        }

        return item;
      } catch {
        return item;
      }
    }),
    (result) => ({
      document: result,
      translatedEntries,
    })
  );
};
