import Link from 'next/link';
import { useEffect } from 'react';
import { useCharacters } from '../context/characters';
import type { Character } from '../types';

interface Props {
  data: Character[] | null;
}

function Characters({ data }: Props): React.ReactElement {
  const { setCharacters } = useCharacters();

  useEffect(() => {
    setCharacters(data ?? []);
  }, [setCharacters, data]);

  return (
    <section aria-labelledby='characters-heading'>
      <h2 id='characters-heading'>Characters</h2>
      <ul>
        {data?.map((character) => (
          <li key={character.name}>
            <Link
              href={`/characters/${encodeURIComponent(character.name)}/movies`}>
              {character.name}
            </Link>
          </li>
        )) ?? (
          <div>
            There was a problem loading Star Wars characters, please try again
            later
          </div>
        )}
      </ul>
    </section>
  );
}

export default Characters;
