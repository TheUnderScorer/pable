import { clientRoutes } from '@skryba/shared-frontend';
import {
  addEntryToTableWithoutTranslation,
  importEntries,
  uploadDocument,
} from '../support/app.po';
import { apiRoutes, FetchTranslationsResult } from '@skryba/domain-types';

function advancedSetup() {
  cy.visit(clientRoutes.langTable);
  importEntries('translate-document/advanced.txt');

  cy.wait(4000);

  cy.visit(clientRoutes.translateDocument);

  uploadDocument('translate-document/advanced.txt');
}

describe('Translate document', () => {
  beforeEach(() => {
    cy.window().then((window) => {
      window.localStorage.setItem('didTranslateDocumentOnboard', 'true');
    });
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

  it('should handle export with multiple restored words', () => {
    const entriesToRestore = 10;
    let restoredEntries = 0;

    cy.intercept(`http://localhost:3000/${apiRoutes.fetchLanguages}`, {
      translation: 'Foo',
    } as FetchTranslationsResult).as('translationRequest');

    advancedSetup();

    cy.wait(1000);

    cy.get('.translated-entry-trigger').each((el, index) => {
      if (restoredEntries > entriesToRestore) {
        return false;
      }

      if (index % 2 > 0) {
        cy.wrap(el).click();
        cy.contains('Restore original word').click();

        restoredEntries++;
      }
    });

    cy.get('#export_document').click();

    cy.fixture('translate-document/advanced-translated-expected.txt').then(
      (content) => {
        cy.readFile('cypress/downloads/advanced-translated.txt').should(
          'contain',
          content
        );
      }
    );
  });
});
