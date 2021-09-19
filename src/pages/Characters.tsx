import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCharacters } from '../context/characters';

function Characters(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { characters, fetchCharacters } = useCharacters();

  useEffect(() => {
    if (characters === null && !isLoading && !isError) {
      setIsLoading(true);
      fetchCharacters()
        .then((_swapiData) => {
          setIsLoading(false);
        })
        .catch((_error) => {
          setIsError(true);
          setIsLoading(false);
        });
    }
  }, [characters, fetchCharacters, isLoading, isError]);

  let content: React.ReactElement;

  if (isError) {
    content = (
      <div role='alert'>
        There was a problem loading Star Wars characters, please try refreshing
        the page
      </div>
    );
  } else if (isLoading || characters === null) {
    content = <div role='status'>Loading characters...</div>;
  } else {
    content = (
      <ul>
        {characters?.map((character) => (
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
