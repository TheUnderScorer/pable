import { Page } from 'puppeteer';
import { selectors } from './selectors';

export const waitForTranslationResult = async (page: Page) => {
  await page.waitForFunction(
    (deeplSelectors: typeof selectors) => {
      const textArea = document.querySelector<HTMLTextAreaElement>(
        deeplSelectors.targetTextArea
      );

      return Boolean(textArea.value);
    },
    {
      timeout: 60000,
      polling: 500,
    },
    selectors
  );
};
