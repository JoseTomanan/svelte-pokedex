<script lang="ts">
  import { Root as DialogRoot } from "@/components/ui/dialog";
  import { Skeleton } from "@/components/ui/skeleton";

  import { onMount, tick } from "svelte";
  import type { Resource, SpeciesDetails, SpeciesShort } from "@/types"
  
  import SearchBar from "./SearchBar.svelte";
  import SpeciesCard from "@/components/SpeciesCard.svelte";
	import SpeciesDialog from "@/components/SpeciesDialog.svelte";

  let isLoading: boolean = $state(false);
  let isHasMore: boolean = $state(true);
  let sentinel = $state<HTMLDivElement>();

  let speciesList: SpeciesShort[] = $state([]);
  let previousUrl: string = "";
  let nextUrl: string = "BABABA";

  let observer: IntersectionObserver;

  onMount(() => {
    fetchItemsFromLink("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10");

    observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting)
                fetchItemsFromLink(nextUrl);
            }, { rootMargin: '200px' }
            );

    if (sentinel)
      observer.observe(sentinel);

    return () => observer.disconnect();
  });

  async function fetchItemsFromLink(url: string) {
    if (isLoading || !isHasMore)
      return;

    console.log("Fetching from "+url);
    
    isLoading = true;
    try {
      const response = await fetch(url);
      const result = await response.json();

      for (const item of result.results as Resource[]) {
        const subResponse = await fetch(item.url);
        const subResult = await subResponse.json();

        const id: number = subResult.id;
        const types: string[] = subResult.types.map((t: any) => t.type.name.toUpperCase());
        
        const details: SpeciesDetails = {...subResult, types} as SpeciesDetails;

        speciesList.push({
          ...item, id, types, details
        } as SpeciesShort);
      }
      
      previousUrl = result.previous;
      nextUrl = result.next;

      await tick();
      if (sentinel && observer) {
        observer.unobserve(sentinel);
        observer.observe(sentinel);
      }
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
      <DialogRoot>
        <SpeciesCard {...speciesItem} />
        <SpeciesDialog {...speciesItem.details} />
      </DialogRoot>
    {/each}
    {#if isLoading}
      {#each { length: 6 } as _}
        <Skeleton class="bg-muted-foreground/25"/>
      {/each}
    {/if}
    {#if isHasMore}
      <div bind:this={sentinel}></div>
    {:else}
      <div class="w-full flex justify-center items-center">
        <h4>End of list.</h4>
      </div>
    {/if}
  </div>
</div>
