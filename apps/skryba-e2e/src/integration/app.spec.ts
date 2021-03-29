import { getTitle } from '../support/app.po';

describe('Skryba', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getTitle().contains('Skryba 2.0');
  });
});
