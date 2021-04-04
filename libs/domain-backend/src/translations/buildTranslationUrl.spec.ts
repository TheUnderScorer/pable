import { URL } from 'url';
import { buildTranslationUrl } from './buildTranslationUrl';
import { Language } from '@skryba/domain-types';

const baseUrl = new URL('http://example.org');

describe('Build translation url', () => {
  it('should return correct ur;', () => {
    const result = buildTranslationUrl(baseUrl, {
      sourceLanguage: Language.Polish,
      targetLanguage: Language.English,
      word: 'Jakieś słowo',
    });

    expect(result).toMatchInlineSnapshot(
      `"http://example.org/translator#pl/en/Jakie%C5%9B%20s%C5%82owo"`
    );
  });
});
