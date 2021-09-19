import type { Character, PeopleResponse } from 'src/types';
import { writable } from 'svelte/store';

export const characters = writable<Character[] | undefined>();

export const fetchCharacters = async (): Promise<void> => {
  const response = await fetch('https://swapi.dev/api/people?page=1');
  const data = ((await response.json()) as PeopleResponse).results;
  characters.set(data);
};
