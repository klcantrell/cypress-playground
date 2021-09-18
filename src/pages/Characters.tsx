import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCharacters } from '../context/characters';
import { PeopleResponse } from '../types';

function Characters(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { get: getCharacters, set: setCharacters } = useCharacters();

  useEffect(() => {
    if (getCharacters() === null && !isLoading && !isError) {
      setIsLoading(true);
      fetch('https://swapi.dev/api/people?page=1')
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Star Wars people request failed');
          }
        })
        .then((swapiData: PeopleResponse) => {
          setCharacters(swapiData.results);
          setIsLoading(false);
        })
        .catch((_error) => {
          setIsError(true);
          setIsLoading(false);
        });
    }
  }, [getCharacters, setCharacters, isLoading, isError]);

  let content: React.ReactElement;

  if (isError) {
    content = (
      <div role='alert'>
        There was a problem loading Star Wars characters, please try refreshing
        the page
      </div>
    );
  } else if (isLoading || getCharacters() === null) {
    content = <div role='status'>Loading characters...</div>;
  } else {
    content = (
      <ul>
        {getCharacters()?.map((character) => (
          <li key={character.name}>
            <Link
              to={`/characters/${encodeURIComponent(character.name)}/movies`}>
              {character.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section aria-labelledby='characters-heading'>
      <h2 id='characters-heading'>Characters</h2>
      {content}
    </section>
  );
}

export default Characters;
