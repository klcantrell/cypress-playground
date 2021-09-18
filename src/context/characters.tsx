import React, { useContext, createContext, useState, useMemo } from 'react';
import { Character } from '../types';

interface Props {
  children: React.ReactElement;
}

interface ContextValue {
  get: () => Character[] | null;
  set: (characters: Character[]) => void;
}

const CharactersContext = createContext<ContextValue>({
  get: () => null,
  set: (_characters) => {},
});

export function CharactersProvider({ children }: Props): React.ReactElement {
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const contextValue = useMemo(
    () => ({
      get: () => characters,
      set: setCharacters,
    }),
    [characters, setCharacters]
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
