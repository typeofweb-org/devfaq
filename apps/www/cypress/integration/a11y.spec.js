/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('a11y', () => {
  beforeEach(() => {
    cy.visit('/');
    // Inject the axe-core library
    cy.injectAxe();
  });

  //@todo enable when a11 audit is ready
  it.skip('checks a11y for main page', () => {
    cy.checkA11y();
  });

  it.skip('checks a11y for selected questions page', () => {
    cy.get('section input').first().click();
    cy.checkA11y();
  });
});
