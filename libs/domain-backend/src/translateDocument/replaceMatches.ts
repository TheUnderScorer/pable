import { forbiddenChars, separator } from '@skryba/domain-backend';

export const replaceMatches = (allMatches: string[], document: string) => (
  match: string,
  index: number
) => {
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
    const diffWord = document.slice(index - offset, index);
    const wholeWord = `${diffWord.trim()} ${match.trim()}`;

    if (prevMatch === wholeWord) {
      return match;
    }
  }

  const prevChar = document[index - 1];
  const nextChar = document[index + 1];

  if (forbiddenChars.includes(prevChar) || forbiddenChars.includes(nextChar)) {
    return match;
  }

  allMatches.push(match);

  return `${separator}${match.trim()}${separator}`;
};
