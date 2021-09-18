import type { Character } from 'src/types';
import { writable } from 'svelte/store';

export const characters = writable<Character[] | undefined>();
