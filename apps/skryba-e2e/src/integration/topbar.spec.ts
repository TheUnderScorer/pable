import { clientRoutes } from '@skryba/shared-frontend';

describe('Topbar', () => {
  beforeEach(() => {
    cy.window().then((window) => {
      window.localStorage.setItem('didTranslateDocumentOnboard', 'true');
    });

    cy.visit('/');
  });

  it('should navigate to different pages', () => {
    cy.contains('Translate document').click();
    cy.location('pathname').should('equal', clientRoutes.translateDocument);

    cy.contains('Table').click();
    cy.location('pathname').should('equal', clientRoutes.langTable);
  });
});
