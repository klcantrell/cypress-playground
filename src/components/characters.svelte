<script lang="ts">
  import { onMount } from 'svelte';
  import { characters } from '../stores/characters';
  import type { PeopleResponse, Character } from '../types';

  let data: Character[] | undefined;
  let isError = false;
  let isLoading = false;

  onMount(async () => {
    if ($characters === undefined) {
      isLoading = true;
      try {
        const response = await fetch('https://swapi.dev/api/people?page=1');
        data = ((await response.json()) as PeopleResponse).results;
        characters.set(data);
        isLoading = false;
      } catch {
        isError = true;
        isLoading = false;
      }
    } else {
      data = $characters;
    }
  });
</script>

<section aria-labelledby="characters-heading">
  <h2 id="characters-heading">Characters</h2>
  {#if isError}
    <div role="alert">
      There was a problem loading Star Wars characters, please try refreshing the page
    </div>
  {:else if isLoading || data === undefined}
    <div role="status">Loading characters...</div>
  {:else}
    <ul>
      {#each data as character}
        <li>
          <a href={`/characters/${encodeURIComponent(character.name)}/movies`}>
            {character.name}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</section>
