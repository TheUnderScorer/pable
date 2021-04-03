import {
  isTranslatedDocumentEntry,
  TranslatedDocumentEntries,
  TranslatedDocumentEntry,
  TranslationEntry,
} from '@skryba/domain-types';
import { map, pipe, reduce, sortBy } from 'remeda';
import escapeStringRegexp from 'escape-string-regexp';

interface TranslateDocumentParams {
  content: string;
  translations: TranslationEntry[];
}

const forbiddenChars = ['"', '[', ']', '{', '}', ':', '<', '>'];

const separator = '<sep>';

export const translateDocument = ({
  content,
  translations,
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

      if (translation.sourceWord.includes('uprzedzenie')) {
        console.log(regex);
      }

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

  console.log(withSeparators);

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

        const json = {
          translation,
          arrayIndex: 0,
          word: formattedMatch,
          key: `${formattedMatch}-${index}`,
        } as TranslatedDocumentEntry;

        return `${separator}${JSON.stringify(json)}${separator}`;
      });
    }, withSeparators),
    (val) => val.split(separator),
    map.indexed<string, TranslatedDocumentEntry | string>((item, index) => {
      try {
        const parsed = JSON.parse(item);

        if (isTranslatedDocumentEntry(parsed)) {
          return {
            ...parsed,
            translation: parsed.translation,
            arrayIndex: index,
          };
        }

        return item;
      } catch {
        return item;
      }
    })
  );
};
