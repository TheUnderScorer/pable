import { Language, TranslationEntry } from '@skryba/domain-types';

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

  cy.wait('@translationRequest');

  if (expectedTranslation) {
    cy.get('.targetWord').last().should('have.value', expectedTranslation);
  }

  cy.get(`.sourceWord`).last().type('{enter}');
};

export const removeEntry = (index: number) => {
  cy.get('.delete-entry').eq(index).click();
};

export const editEntry = (
  index: number,
  {
    sourceWord,
    targetWord,
  }: Pick<Partial<TranslationEntry>, 'sourceWord' | 'targetWord'>
) => {
  if (sourceWord) {
    cy.get('.sourceWord').eq(index).clear().type(sourceWord);

    cy.wait('@translationRequest');
  }

  if (targetWord) {
    cy.get('.targetWord').eq(index).clear().type(targetWord);
  }
};

export const selectAlternative = (
  rowIndex: number,
  alternativeIndex: number
) => {
  cy.get('.show-alternatives').eq(rowIndex).click();
  cy.get('.alternative').eq(alternativeIndex).click();
};

export const clearTable = () => {
  cy.get('#clear_all').click();
  cy.get('#confirm').click();
};

export const importEntries = (fileName = 'words.txt') => {
  cy.get('#upload_entries_upload').attachFile(fileName);
};

export const exportEntries = () => {
  cy.get('#export_entries').click();

  cy.wait(1000);

  return cy.readFile('cypress/downloads/words.txt');
};

export const uploadDocument = (file: string) => {
  cy.get('#translate_document_file_upload').attachFile(file);
};
