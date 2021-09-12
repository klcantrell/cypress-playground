import { useEffect, useState } from 'react';

interface Character {
  name: string;
}

interface PeopleResponse {
  results: Character[];
}

function Characters(): React.ReactElement {
  const [data, setData] = useState<PeopleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (data === null && !isLoading && !isError) {
      setIsLoading(true);
      fetch('https://swapi.dev/api/people?page=1')
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Star Wars people request failed');
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
  }, [data, setData, isLoading, isError]);

  let content: React.ReactElement;

  if (isError) {
    content = (
      <div role='alert'>
        There was a problem loading Star Wars characters, please try refreshing
        the page
      </div>
    );
  } else if (isLoading || data === null) {
    content = <div role='status'>Loading characters...</div>;
  } else {
    content = (
      <ul>
        {data.results.map((character) => (
          <li>{character.name}</li>
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
