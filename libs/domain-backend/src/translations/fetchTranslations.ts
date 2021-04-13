import { Browser } from 'puppeteer';
import { TranslationsResult } from '@skryba/domain-types';
import { URL } from 'url';
import { FetchTranslationsDto } from '@skryba/shared';
import { buildTranslationUrl } from './buildTranslationUrl';
import { waitForTranslationResult } from './waitForTranslationResult';
import { selectors } from './selectors';
import { getElementPropertyAsText } from '@skryba/shared-server';

interface FetchTranslationsDependencies {
  browser: Browser;
  deeplUrl: URL;
}

export const makeFetchTranslations = ({
  browser,
  deeplUrl,
}: FetchTranslationsDependencies) => async (
  dto: FetchTranslationsDto
): Promise<TranslationsResult> => {
  const context = await browser.createIncognitoBrowserContext();

  try {
    const url = buildTranslationUrl(deeplUrl, dto);

    const page = await context.newPage();

    await page.goto(url.toString());

    await waitForTranslationResult(page);

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

    return {
      translation,
      alternatives: alternatives.filter(
        (value) => value && value !== translation
      ) as string[],
    };
  } finally {
    await context.close();
  }
};

export type FetchTranslations = ReturnType<typeof makeFetchTranslations>;
