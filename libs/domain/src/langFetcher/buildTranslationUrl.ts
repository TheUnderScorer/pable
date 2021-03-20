import { URL } from 'url';
import { FetchTranslationsDto } from '@pable/shared';
import { Language } from '@pable/domain-types';

const langCodesMap = {
  [Language.English]: 'en',
  [Language.German]: 'de',
  [Language.Polish]: 'pl',
};

// Example url -> https://www.deepl.com/translator#pl/en/Woda%20mineralna
export const buildTranslationUrl = (
  baseUrl: URL,
  { sourceLanguage, targetLanguage, word }: FetchTranslationsDto
) => {
  const url = new URL(baseUrl.toString());

  url.pathname = '/translator';
  url.hash = `${langCodesMap[sourceLanguage]}/${
    langCodesMap[targetLanguage]
  }/${encodeURIComponent(word)}`;

  return url;
};
