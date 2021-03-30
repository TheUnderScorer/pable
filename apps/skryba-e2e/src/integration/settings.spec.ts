import { assertSettings, setSettings } from '../support/app.po';
import { Language } from '@skryba/domain-types';

const targetLang = Language.Polish;
const sourceLang = Language.English;

describe('Configuration', () => {
  beforeEach(() => cy.visit('/'));

  it('should let use change settings and persist them', () => {
    // Function helper example, see `../support/app.po.ts` file
    setSettings(sourceLang, targetLang);

    cy.reload();

    assertSettings(sourceLang, targetLang);
  });
});
