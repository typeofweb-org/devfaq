/* eslint-disable no-undef */

/// <reference types="cypress" />

describe('Page and navigation works', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('successfully loads a page', () => {
    cy.get('[data-cy="logo"]').should('be.visible');
    cy.title().should('include', 'DevFAQ.pl');
  });

  it('shows info site when items are not selected', () => {
    cy.get('[data-cy="navigate-list"]').should('have.css', 'color', 'rgb(255, 255, 255)');

    cy.get('[data-cy="navigate-selected-questions"]').click();
    cy.contains('Najpierw zaznacz jakieś pytania, a następnie wróć tutaj aby zobaczyć podgląd!');
  });

  it('shows list of selected items when any selected', () => {
    cy.get('section input').first().click();
    cy.get('section input').eq(3).click();
    cy.get('section input').eq(6).click();

    cy.get('[data-cy="navigate-selected-questions"]').click();
    cy.get('article').should('have.length', 3);
  });
});

describe('Filters work', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows questions in category JS by default', () => {
    cy.get('[data-cy="category"]').within(() => {
      cy.contains('strong', 'JS');
    });

    cy.url().should('contain', 'questions/js');
  });

  it('shows questions in specific category', () => {
    cy.get('[data-cy="technology-filter"]').contains('React').click();
    cy.get('[data-cy="category"]').within(() => {
      cy.contains('strong', 'React');
    });
    cy.url().should('contain', 'questions/react');
  });

  it('shows questions in selected level', () => {
    cy.get('[data-cy=filter-level-junior] > button').click();
    // wait because of leave animation
    cy.wait(1000);
    cy.get('[data-cy="question-meta-level"]').each((el) => {
      expect(el).to.contain('junior');
    });
  });
});

describe('Add new question works like a charm', () => {
  // const successText =
  //   'Jeszcze momencik… a Twoje pytanie pojawi się na liście dostępnych pytań. Najpierw musimy rzucić na nie okiem i zatwierdzić.';

  beforeEach(() => {
    cy.visit('/');
  });

  it('it successfully opens question form and adds new question', () => {
    cy.get('[data-cy="open-add-question-form"]').click();
    cy.get('[data-cy="change-technology"]').select('React');
    cy.get('[data-cy="change-level"]').select('Mid');
    // submit button is still disabled
    cy.get('[data-cy="submit-question"]').should('be.disabled');
    cy.get('[data-cy="add-question-body"]').type('To be or not to be that is the question');
    cy.get('[data-cy="submit-question"]').should('be.enabled');

    // @todo enable on test admin account
    // cy.get('[data-cy="submit-question"]').click();
    // cy.contains(successText);

    // cy.get('[data-cy="close-add-question-form"]').click();
    // cy.contains(successText).should('not.exist');
  });
});
