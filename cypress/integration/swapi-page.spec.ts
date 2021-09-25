import swapiPeople from '../fixtures/swapi-people.json';
import swapiMovies from '../fixtures/swapi-movies.json';

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
        cy.wrap(characterItem).should('include.text', expectedNames[index]);
      });
  });

  it('displays an error when the request fails', () => {
    cy.intercept('https://swapi.dev/api/people?page=1', { statusCode: 500 }).as(
      'swapiPeople'
    );

    cy.visit('/');
    cy.wait('@swapiPeople');

    cy.findByRole('alert', { name: /character load failed alert/i }).should(
      'have.text',
      'There was a problem loading Star Wars characters, please try refreshing the page'
    );
  });

  it("clicking a character shows the character's movies page", () => {
    const expectedCharacter = swapiPeople.results[0];
    const expectedMovies = swapiMovies.results
      .filter((m) => expectedCharacter.films.includes(m.url))
      .slice()
      .sort((a, b) => Number(a.url) - Number(b.url));
    cy.intercept('https://swapi.dev/api/people?page=1', {
      delay: 100,
      body: swapiPeople,
    }).as('swapiPeople');
    cy.intercept('https://swapi.dev/api/films', {
      delay: 100,
      body: swapiMovies,
    }).as('swapiMovies');
    cy.visit('/');
    cy.wait('@swapiPeople');
    cy.findByRole('region', { name: 'Characters' })
      .findByRole('list')
      .findAllByRole('listitem')
      .eq(0)
      .findByRole('link')
      .click();

    cy.findByRole('status').should(
      'have.text',
      "Loading character's movies..."
    );
    cy.wait('@swapiMovies');

    cy.location('pathname').should(
      'equal',
      `/characters/${encodeURIComponent(expectedCharacter.name)}/movies`
    );
    cy.findByRole('region', { name: `${expectedCharacter.name} Movies` })
      .as('moviesSection')
      .findByRole('heading', {
        level: 2,
        name: `${expectedCharacter.name} Movies`,
      })
      .should('be.visible')
      .get('@moviesSection')
      .findByRole('list')
      .findAllByRole('listitem')
      .should('have.length', expectedMovies.length)
      .each((movieItem, index) => {
        cy.wrap(movieItem).should('include.text', expectedMovies[index].title);
      });
  });
});
