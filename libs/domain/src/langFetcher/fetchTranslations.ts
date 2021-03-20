import { Browser } from 'puppeteer';
import {
  FetchTranslationsDto,
  FetchTranslationsResult,
} from '@pable/domain-types';
import { URL } from 'url';
import { selectLanguage } from './selectLanguage';

interface FetchTranslationsDependencies {
  browser: Browser;
  deeplUrl: URL;
}

const selectors = {
  targetTextArea: '.lmt__target_textarea',
  sourceTextArea: '.lmt__source_textarea',
};

export const makeFetchTranslations = ({
  browser,
  deeplUrl,
}: FetchTranslationsDependencies) => async ({
  word,
  targetLanguage,
}: FetchTranslationsDto): Promise<FetchTranslationsResult> => {
  const context = await browser.createIncognitoBrowserContext();

  try {
    const url = new URL(deeplUrl.toString());
    url.pathname = '/translator';

    const page = await context.newPage();

    await page.goto(url.toString());

    // Select target language
    await selectLanguage(
      '[dl-test="translator-target-lang-btn"]',
      page,
      targetLanguage
    );

    // Type word into source textarea
    await page.type(selectors.sourceTextArea, word, {
      delay: 250,
    });

    // Wait until translation appears in result textarea
    await page.waitForFunction(
      (deeplSelectors: typeof selectors) => {
        const textArea = document.querySelector<HTMLTextAreaElement>(
          deeplSelectors.targetTextArea
        );

        return Boolean(textArea.value);
      },
      {
        timeout: 60_000,
        polling: 500,
      },
      selectors
    );

    await page.waitForTimeout(2500);

    const targetTextArea = await page.$(selectors.targetTextArea);

    const translation = await targetTextArea
      .getProperty('value')
      .then((prop) => prop.jsonValue<string>());

    if (!translation) {
      throw new Error(`No translation found for word ${word}`);
    }

    return {
      translation,
    };
  } finally {
    await context.close();
  }
};

export type FetchTranslations = ReturnType<typeof makeFetchTranslations>;
