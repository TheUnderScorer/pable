import { Page } from 'puppeteer';
import { Language } from '@pable/domain-types';

const langCodesMap = {
  [Language.English]: ['en-GB', 'en'],
  [Language.German]: ['de-DE', 'de'],
  [Language.Polish]: ['pl-PL', 'pl'],
};

export const selectLanguage = async (
  activatorSelector: string,
  page: Page,
  lang: Language
) => {
  const activator = await page.$(activatorSelector);

  await activator.click();

  const id = await page.$eval(activatorSelector, (btn) =>
    btn.getAttribute('dl-test')
  );

  const listId = id.replace('btn', 'list');
  const listSelector = `[dl-test=${listId}]`;

  await page.evaluate(
    (selector: string, languages: string[]) => {
      const list = document.querySelector(selector);

      const btnSelector = languages
        .map(
          (lang) =>
            `.translator-lang-option-${lang},[dl-test="translator-lang-option-${lang}"]`
        )
        .join(', ');
      const btn = list.querySelector<HTMLButtonElement>(btnSelector);

      btn.click();
    },
    listSelector,
    langCodesMap[lang]
  );
};
