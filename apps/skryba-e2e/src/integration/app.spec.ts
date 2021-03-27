import { getTitle } from '../support/app.po';

describe('skryba', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    getTitle().contains('Skryba 2.0');
  });
});
