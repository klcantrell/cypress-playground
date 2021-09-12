import swapiPeople from '../fixtures/swapi-people.json';

describe('Characters', () => {
  it('displays character names', () => {
    cy.intercept('https://swapi.dev/api/people?page=1', swapiPeople).as(
      'swapiPeople'
    );
    const expectedNames = swapiPeople.results.map((r) => r.name);

    cy.visit('/');

    cy.findByRole('status').should('have.text', 'Loading characters...');
    cy.wait('@swapiPeople');

    cy.findByRole('region', { name: 'Characters' })
      .as('charactersSection')
      .findByRole('heading', { level: 2, name: 'Characters' })
      .should('be.visible')
      .get('@charactersSection')
      .findByRole('list')
      .findAllByRole('listitem')
      .each((characterItem, index) => {
        cy.wrap(characterItem).should('have.text', expectedNames[index]);
      });
  });

  it('displays an error when the request fails', () => {
    cy.intercept('https://swapi.dev/api/people?page=1', { statusCode: 500 }).as(
      'swapiPeople'
    );

    cy.visit('/');
    cy.wait('@swapiPeople');

    cy.findByRole('alert').should(
      'have.text',
      'There was a problem loading Star Wars characters, please try refreshing the page'
    );
  });
});
