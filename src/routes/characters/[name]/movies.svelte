<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ page }) => {
    return {
      props: {
        characterName: decodeURIComponent(page.params.name),
      },
    };
  };
</script>

<script lang="ts">
  import { movies } from '../../../stores/movies';
  import { characters, fetchCharacters } from '../../../stores/characters';
  import { onMount } from 'svelte';
  import type { Movie, MoviesResponse } from '../../../types';

  export let characterName: string;

  let movieData: Movie[] | undefined;
  let isError = false;
  let isLoading = false;

  $: character = $characters?.find((c) => c.name === characterName);
  $: characterMovies = movieData?.filter((m) => character?.films.includes(m.url));

  onMount(async () => {
    if ($movies === undefined) {
      isLoading = true;
      try {
        const response = await fetch('https://swapi.dev/api/films');
        movieData = ((await response.json()) as MoviesResponse).results;
        movies.set(movieData);
        isLoading = false;
      } catch {
        isError = true;
        isLoading = false;
      }
    } else {
      movieData = $movies;
    } 
    if (character === undefined) {
      fetchCharacters();
    }
  });
</script>

<section aria-labelledby="character-movies-heading">
  <h2 id="character-movies-heading">{characterName} Movies</h2>
  {#if isError}
    <div role="alert">
      There was a problem loading {characterName}'s movies, please try refreshing the page
    </div>
  {:else if isLoading || characterMovies === undefined}
    <div role="status">Loading character's movies...</div>
  {:else}
    <ul>
      {#each characterMovies as movie}
        <li>
          {movie.title}
        </li>
      {/each}
    </ul>
  {/if}
</section>
