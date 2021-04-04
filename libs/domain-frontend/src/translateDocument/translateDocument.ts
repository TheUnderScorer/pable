import {
  isTranslatedDocumentEntry,
  TranslatedDocumentEntries,
  TranslatedDocumentEntry,
  TranslationEntry,
} from '@skryba/domain-types';
import { map, pipe, reduce, sortBy } from 'remeda';
import escapeStringRegexp from 'escape-string-regexp';
import { getTranslatedEntryById } from './getTranslatedEntryById';

interface TranslateDocumentParams {
  content: string;
  translations: TranslationEntry[];
  previousTranslatedDocument?: TranslatedDocumentEntries;
}

const forbiddenChars = ['"', '[', ']', '{', '}', ':', '<', '>'];

const separator = '<sep>';

const buildId = (
  translation: Pick<TranslationEntry, 'targetWord'>,
  index: number
) => `${translation.targetWord}-${index}`.replace(/\s/g, '');

export const translateDocument = ({
  content,
  translations,
  previousTranslatedDocument,
}: TranslateDocumentParams): TranslatedDocumentEntries => {
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

  const withSeparators = formattedTranslations.reduce(
    (currentResult, translation) => {
      if (!translation.sourceWord || !translation.targetWord) {
        return currentResult;
      }

      const regex = new RegExp(
        `(?<!\\w)${translation.sourceWord}(?!\\w)`,
        'gi'
      );

      return currentResult.replace(regex, (match, index) => {
        if (
          allMatches.some(
            (prevMatch) => prevMatch.includes(match) && match !== prevMatch
          )
        ) {
          // This ensures that the word is not an part of translated word
          const prevMatch = allMatches.find(
            (prevMatch) => prevMatch.includes(match) && match !== prevMatch
          );

          const offset = prevMatch.length - match.length;
          const diffWord = currentResult.slice(index - offset, index);
          const wholeWord = `${diffWord.trim()} ${match.trim()}`;

          if (prevMatch === wholeWord) {
            return match;
          }
        }

        const prevChar = currentResult[index - 1];
        const nextChar = currentResult[index + 1];

        if (
          forbiddenChars.includes(prevChar) ||
          forbiddenChars.includes(nextChar)
        ) {
          return match;
        }

        allMatches.push(match);

        return `${separator}${match.trim()}${separator}`;
      });
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
    }, withSeparators),
    (val) => val.split(separator),
    map.indexed<string, TranslatedDocumentEntry | string>((item) => {
      try {
        const parsed = JSON.parse(item);

        if (isTranslatedDocumentEntry(parsed)) {
          return parsed;
        }

        return item;
      } catch {
        return item;
      }
    })
  );
};
