import { Page } from 'puppeteer';
import { selectors } from './selectors';

export const waitForTranslationResult = async (page: Page) => {
  try {
    await page.waitForFunction(
      (deeplSelectors: typeof selectors) => {
        const textArea = document.querySelector<HTMLTextAreaElement>(
          deeplSelectors.targetTextArea
        );

        return Boolean(textArea.value);
      },
      {
        timeout: 90000,
        polling: 1000,
      },
      selectors
    );

    return true;
  } catch {
    return false;
  }
};
