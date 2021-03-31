import {
  addEntryToTableWithoutTranslation,
  clearTable,
  editEntry,
  exportEntries,
  importEntries,
  removeEntry,
  selectAlternative,
  setSettings,
} from '../support/app.po';
import {
  apiRoutes,
  FetchTranslationsResult,
  Language,
} from '@skryba/domain-types';

const assertEmptyTable = () => {
  cy.get('.translation-table-row').should('have.length', 1);
  cy.get('.targetWord').should('not.have.value');
  cy.get('.sourceWord').should('not.have.value');
};

describe('Language table', () => {
  beforeEach(() => {
    cy.visit('/');

    setSettings(Language.Polish, Language.English);
  });

  it('should let user add new entry into table and fetch translation for it', () => {
    addEntryToTableWithoutTranslation('test', 'test');
  });

  it('should let user edit added entry', () => {
    addEntryToTableWithoutTranslation('Lubię psy');
    addEntryToTableWithoutTranslation('Lubię koty');

    editEntry(1, {
      sourceWord: 'Lubię wszystkie zwierzęta',
      targetWord: 'Custom translation',
    });

    cy.get('.sourceWord')
      .eq(1)
      .should('have.value', 'Lubię wszystkie zwierzęta');
    cy.get('.targetWord').eq(1).should('have.value', 'Custom translation');
  });

  it('should show alternative translations', () => {
    cy.intercept(`http://localhost:3000/${apiRoutes.fetchLanguages}`, {
      translation: 'I like all animals',
      alternatives: ['I like all the animals'],
    } as FetchTranslationsResult).as('translationRequest');

    addEntryToTableWithoutTranslation('Lubię wszystkie zwierzęta');

    selectAlternative(0, 0);

    cy.get('.targetWord')
      .first()
      .should('have.value', 'I like all the animals');

    cy.get('.show-alternatives').first().click();
    cy.get('.alternative').eq(0).should('have.text', 'I like all animals');
  });

  it('should clear all entries', () => {
    addEntryToTableWithoutTranslation('Lubię psy');
    addEntryToTableWithoutTranslation('Lubię koty');

    clearTable();
    assertEmptyTable();
  });

  it('should import entries via file', () => {
    importEntries();

    cy.get('.translation-table-row').should('have.length', 145);
  });

  it('should import entries with undo', () => {
    importEntries();

    cy.get('#undo_import').click();

    assertEmptyTable();
  });

  it('should support navigation via arrows', () => {
    addEntryToTableWithoutTranslation('Lubię psy');
    addEntryToTableWithoutTranslation('Lubię koty');

    cy.get('.targetWord').eq(1).type('{uparrow}');
    cy.get('.targetWord').eq(0).should('have.focus');
    cy.get('.targetWord').eq(0).type('{downarrow}');
    cy.get('.targetWord').eq(1).should('have.focus');

    cy.get('.sourceWord').eq(1).type('{uparrow}');
    cy.get('.sourceWord').eq(0).should('have.focus');
    cy.get('.sourceWord').eq(0).type('{downarrow}');
    cy.get('.sourceWord').eq(1).should('have.focus');
  });

  it.only('should remove single entry', () => {
    addEntryToTableWithoutTranslation('Lubię psy');
    addEntryToTableWithoutTranslation('Lubię koty');

    removeEntry(1);

    cy.get('.translation-table-row').should('have.length', 2);
    cy.get('.sourceWord').first().should('have.value', 'Lubię psy');
    cy.get('.sourceWord').eq(1).should('not.have.value');
  });

  it('should export entries', () => {
    cy.intercept(`http://localhost:3000/${apiRoutes.fetchLanguages}`, {
      translation: 'I like dogs',
    } as FetchTranslationsResult).as('translationRequest');

    addEntryToTableWithoutTranslation('Lubię psy');

    const result = exportEntries();

    result.should('contain', 'Lubię psy/I like dogs');
  });
});
