import {
  addEntryToTableWithoutTranslation,
  setSettings,
} from '../support/app.po';
import { Language } from '@skryba/domain-types';

describe('Language table', () => {
  beforeEach(() => cy.visit('/'));

  it('should let user add new entry into table and fetch translation for it', () => {
    setSettings(Language.Polish, Language.English);

    addEntryToTableWithoutTranslation('test', 'test');
  });
});
