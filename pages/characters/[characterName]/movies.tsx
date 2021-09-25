import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCharacters } from '../../../context/characters';
import type { MoviesResponse, PeopleResponse } from '../../../types';
import { GetStaticPaths, GetStaticProps } from 'next';

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch('https://swapi.dev/api/people?page=1');
  const data: PeopleResponse = await response.json();
  const paths = data.results.map((c) => ({
    params: { characterName: c.name },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (_context) => {
  return {
    props: {},
  };
};

export default function CharacterMovies(): React.ReactElement {
  const router = useRouter();
  const { characterName } = router.query;
  const { characters, fetchCharacters } = useCharacters();
  const currentCharacter =
    characters?.find(
      (c) => c.name === decodeURIComponent(characterName as string)
    ) ?? null;

  const [data, setData] = useState<MoviesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (currentCharacter === null) {
      fetchCharacters();
    }
  }, [currentCharacter, fetchCharacters]);

  useEffect(() => {
    if (data === null && !isLoading && !isError && currentCharacter) {
      setIsLoading(true);
      fetch('https://swapi.dev/api/films')
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Star Wars films request failed');
          }
        })
        .then((swapiData) => {
          setData(swapiData);
          setIsLoading(false);
        })
        .catch((_error) => {
          setIsError(true);
          setIsLoading(false);
        });
    }
  }, [data, setData, isLoading, isError, currentCharacter, fetchCharacters]);

  let content: React.ReactElement;

  if (isError) {
    content = (
      <div role='alert'>
        There was a problem loading Star Wars characters, please try refreshing
        the page
      </div>
    );
  } else if (isLoading || data === null) {
    content = <div role='status'>Loading character&apos;s movies...</div>;
  } else {
    content = (
      <ul>
        {data.results
          .filter((m) => currentCharacter?.films.includes(m.url))
          .map((movie) => (
            <li key={movie.title}>{movie.title}</li>
          ))}
      </ul>
    );
  }

  return (
    <section aria-labelledby='character-movies-heading'>
      <h2 id='character-movies-heading'>
        {decodeURIComponent(characterName as string)} Movies
      </h2>
      {content}
    </section>
  );
}
