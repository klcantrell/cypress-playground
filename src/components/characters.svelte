<script lang="ts">
  import { onMount } from 'svelte';
  import { characters, fetchCharacters } from '../stores/characters';

  let isError = false;
  let isLoading = false;

  onMount(async () => {
    if ($characters === undefined) {
      isLoading = true;
      try {
        await fetchCharacters();
        isLoading = false;
      } catch {
        isError = true;
        isLoading = false;
      }
    }
  });
</script>

<section aria-labelledby="characters-heading">
  <h2 id="characters-heading">Characters</h2>
  {#if isError}
    <div role="alert">
      There was a problem loading Star Wars characters, please try refreshing the page
    </div>
  {:else if isLoading || $characters === undefined}
    <div role="status">Loading characters...</div>
  {:else}
    <ul>
      {#each $characters as character}
        <li>
          <a href={`/characters/${encodeURIComponent(character.name)}/movies`}>
            {character.name}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</section>
