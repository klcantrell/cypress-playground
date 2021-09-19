import React, {
  useContext,
  createContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Character, PeopleResponse } from '../types';

interface Props {
  children: React.ReactElement;
}

interface ContextValue {
  characters: Character[] | null;
  setCharacters: (characters: Character[]) => void;
  fetchCharacters: () => Promise<PeopleResponse>;
}

const CharactersContext = createContext<ContextValue>({
  characters: null,
  setCharacters: (_characters) => {},
  fetchCharacters: () => Promise.resolve<PeopleResponse>({ results: [] }),
});

export function CharactersProvider({ children }: Props): React.ReactElement {
  const [characters, setCharacters] = useState<Character[] | null>(null);

  const fetchCharacters = useCallback(async () => {
    const res = await fetch('https://swapi.dev/api/people?page=1');
    if (res.ok) {
      const swapiData: PeopleResponse = await res.json();
      setCharacters(swapiData.results);
      return swapiData;
    } else {
      throw new Error('Star Wars people request failed');
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      characters,
      setCharacters,
      fetchCharacters,
    }),
    [characters, setCharacters, fetchCharacters]
  );

  return (
    <CharactersContext.Provider value={contextValue}>
      {children}
    </CharactersContext.Provider>
  );
}

export function useCharacters(): ContextValue {
  const context = useContext(CharactersContext);
  if (!context) {
    throw new Error('useCharacters must be used within a CharactersProvider');
  }
  return context;
}
