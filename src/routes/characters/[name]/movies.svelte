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
  import { characters } from '../../../stores/characters';
  export let characterName: string;

  const character = $characters?.find((c) => c.name === characterName);

  import { onMount } from 'svelte';
  import type { Movie, MoviesResponse } from '../../../types';

  let movieData: Movie[] | undefined;
  let isError = false;
  let isLoading = false;
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
  });
</script>

<section aria-labelledby="character-movies-heading">
  <h2 id="character-movies-heading">{character?.name} Movies</h2>
  {#if isError}
    <div role="alert">
      There was a problem loading {character?.name}'s movies, please try refreshing the page
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
