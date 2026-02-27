<script lang="ts">
  import { onMount } from "svelte";
  import type { SpeciesShort } from "@/types"
  import { getIdAsParam } from "@/utils";
  
  import SearchBar from "./SearchBar.svelte";
  import SpeciesCard from "@/components/SpeciesCard.svelte";

  let isLoading: boolean = false;

  let speciesList: SpeciesShort[] = $state([]);
  let previousUrl: string = $state("");
  let nextUrl: string = $state("");

  onMount(() => {
    fetchItemsFromLink("https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=10");
  });

  async function fetchItemsFromLink(url: string) {
    isLoading = true;
    try {
      const response = await fetch(url);
      const result = await response.json();

      speciesList.push(
        ...result.results.map((item: { name: string; url: string }) => {
          const url: string = item.url;
          const secondLastSlashIndex = url.lastIndexOf("/", url.length - 2);
          const idString = url.slice(secondLastSlashIndex + 1, -1);

          return {...item, id: Number(idString)} satisfies SpeciesShort;
        })
      );
      
      previousUrl = result.previous;
      nextUrl = result.next;
    } catch (e) {
      alert("There was an error in fetching from PokeAPI:"+e)
    } finally {
      isLoading = false;
    }
  };
</script>


<div class="p-4 space-y-4">
  <SearchBar/>
  <div class="card-grid">
    {#each speciesList as speciesItem}
      {@const capitalizedName = speciesItem.name.charAt(0).toUpperCase() + speciesItem.name.slice(1)}
      <SpeciesCard id={getIdAsParam(speciesItem.id)}
              name={capitalizedName}
              url={speciesItem.url} 
              type="GRASS" />
    {/each}
  </div>
</div>
