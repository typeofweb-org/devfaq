/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('dev Faq navigate', () => {
  it('has empty site while any questions selected', () => {
    cy.visit('/');
    cy.get('[data-cy="navigate list"]').should('have.css', 'color', 'rgb(255, 255, 255)');

    cy.get('[data-cy="navigate selected-questions"]').click();
    cy.contains('Najpierw zaznacz jakieś pytania, a następnie wróć tutaj aby zobaczyć podgląd!');
  });

  it('shows list of selected items', () => {
    cy.visit('/');

    cy.get('section input').first().click();
    cy.get('[data-cy="navigate selected-questions"]').click();
    cy.get('article').should('have.length', 1);
  });
});
