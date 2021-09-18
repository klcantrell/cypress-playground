import type { Movie } from 'src/types';
import { writable } from 'svelte/store';

export const movies = writable<Movie[] | undefined>();
