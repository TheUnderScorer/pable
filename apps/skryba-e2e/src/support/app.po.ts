import { Language } from '@skryba/domain-types';

export const getTitle = () => cy.get('#title');

export const setSettings = (
  sourceLanguage: Language,
  targetLanguage: Language
) => {
  cy.get('#sourceLanguage').select(sourceLanguage);
  cy.get('#targetLanguage').select(targetLanguage);
};

export const assertSettings = (
  sourceLanguage: Language,
  targetLanguage: Language
) => {
  cy.get('#sourceLanguage').should('have.value', sourceLanguage);
  cy.get('#targetLanguage').should('have.value', targetLanguage);
};

export const addEntryToTableWithoutTranslation = (
  word: string,
  expectedTranslation?: string
) => {
  cy.get('.sourceWord').last().type(word).blur();

  cy.wait(6000);

  cy.get('.targetWord').last().should('have.value', expectedTranslation);
};
