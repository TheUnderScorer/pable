import { clientRoutes } from '@skryba/shared-frontend';
import {
  addEntryToTableWithoutTranslation,
  importEntries,
  uploadDocument,
} from '../support/app.po';
import { apiRoutes, FetchTranslationsResult } from '@skryba/domain-types';

describe('Translate document', () => {
  beforeEach(() => {
    cy.visit(clientRoutes.translateDocument);
  });

  it('should display upload field', () => {
    cy.get('.file-dropzone').should('have.length', 1);
  });

  it('should upload file and translate it basing on entries from table - simple document', () => {
    cy.visit(clientRoutes.langTable);

    cy.intercept(`http://localhost:3000/${apiRoutes.fetchLanguages}`, {
      translation: 'Foo',
    } as FetchTranslationsResult).as('translationRequest');

    addEntryToTableWithoutTranslation('Bar');

    cy.wait(500);

    cy.visit(clientRoutes.translateDocument);

    uploadDocument('translate-document/simple.txt');

    cy.get('.translated-document').should('contain', 'Foo Foo hehe');
    cy.get('.file-name').should('contain', 'simple.txt');
    cy.get('.translation-list-item')
      .should('contain', 'bar')
      .should('contain', 'Foo')
      .should('have.length', 1);
  });

  it('should let user switch between translation and original', () => {
    cy.visit(clientRoutes.langTable);

    cy.intercept(`http://localhost:3000/${apiRoutes.fetchLanguages}`, {
      translation: 'Foo',
    } as FetchTranslationsResult).as('translationRequest');

    addEntryToTableWithoutTranslation('Bar');

    cy.wait(500);

    cy.visit(clientRoutes.translateDocument);

    uploadDocument('translate-document/simple.txt');

    cy.get('#display_switch').parent().click();
    cy.get('.original-document')
      .should('be.visible')
      .should('contain', 'Foo bar hehe');
    cy.get('.translated-document').should('not.be.visible');
    cy.get('.file-name').should('contain', 'simple.txt (original)');
  });

  it('should support restoring original words', () => {
    cy.visit(clientRoutes.langTable);

    cy.intercept(`http://localhost:3000/${apiRoutes.fetchLanguages}`, (req) => {
      if (req.body.word === 'Bar') {
        req.reply({
          translation: 'Foo',
        } as FetchTranslationsResult);

        return;
      }

      req.reply({
        translation: 'Ipsum',
      } as FetchTranslationsResult);
    }).as('translationRequest');

    addEntryToTableWithoutTranslation('Bar');
    addEntryToTableWithoutTranslation('Lorem');

    cy.wait(500);

    cy.visit(clientRoutes.translateDocument);

    uploadDocument('translate-document/simple1.txt');

    cy.get('.translated-entry-trigger').first().click();
    cy.get('.translation-list-item').first().should('have.class', 'highlight');
    cy.contains('Restore original word').click();
    cy.get('.translated-entry-trigger').should('have.length', 1);
    cy.get('.translated-document').should(
      'contain',
      'Foo bar Ipsum ipsum testing 123'
    );
    cy.get('.translation-list-item s').should('have.length', 2);

    cy.get('.translated-restored-entry-trigger').click();
    cy.contains('Restore translation').click();
    cy.get('.translated-restored-entry-trigger').should('have.length', 0);
    cy.get('.translation-list-item s').should('have.length', 0);

    cy.get('.translated-document').should(
      'contain',
      'Foo Foo Ipsum ipsum testing 123'
    );
  });

  it.only('should handle flow with multiple words', () => {
    cy.visit(clientRoutes.langTable);
    importEntries('translate-document/advanced.txt');

    cy.wait(4000);

    cy.visit(clientRoutes.translateDocument);

    uploadDocument('translate-document/advanced.txt');

    cy.wait(1000);
  });
});
