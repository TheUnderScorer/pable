import { Browser } from 'puppeteer';
import { TranslationsResult } from '@skryba/domain-types';
import { URL } from 'url';
import { FetchTranslationsDto, Logger } from '@skryba/shared';
import { buildTranslationUrl } from './buildTranslationUrl';
import { waitForTranslationResult } from './waitForTranslationResult';
import { selectors } from './selectors';
import { getElementPropertyAsText } from '@skryba/shared-server';

interface FetchTranslationsDependencies {
  browser: Browser;
  deeplUrl: URL;
  logger: Logger;
}

export const makeFetchTranslations = ({
  browser,
  deeplUrl,
  logger,
}: FetchTranslationsDependencies) => async (
  dto: FetchTranslationsDto
): Promise<TranslationsResult> => {
  const context = await browser.createIncognitoBrowserContext();

  try {
    const url = buildTranslationUrl(deeplUrl, dto);

    const page = await context.newPage();

    await page.goto(url.toString());

    logger.info(`Waiting for translation on ${url}...`);

    const waitResult = await waitForTranslationResult(page);

    if (!waitResult) {
      logger.error(`No results found for ${url}`);

      return {
        translation: '',
        from: dto.word,
        alternatives: [],
      };
    }

    const targetTextArea = await page.$(selectors.targetTextArea);
    const alternativeElements = await page.$$(
      '[dl-test="translator-target-result-as-text-entry"]'
    );

    const alternatives = await Promise.all(
      alternativeElements.map((element) =>
        getElementPropertyAsText<string | null>(element, 'textContent')
      )
    );

    const translation = await getElementPropertyAsText<string | null>(
      targetTextArea,
      'value'
    );

    if (!translation) {
      throw new Error(`No translation found for word ${dto.word}`);
    }

    logger.info(`Got translation on ${url} for ${dto.word}`);

    return {
      translation: translation.trim(),
      alternatives: alternatives
        .filter((value) => value && value !== translation)
        .map((word) => word.trim()) as string[],
      from: dto.word,
    };
  } catch (e) {
    logger.error(`Failed to fetch translation for ${dto.word}:`, e);

    throw e;
  } finally {
    await context.close();
  }
};

export type FetchTranslations = ReturnType<typeof makeFetchTranslations>;
