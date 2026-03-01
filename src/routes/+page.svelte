<script lang="ts">
  import { Skeleton } from "@/components/ui/skeleton";

  import { onMount, tick } from "svelte";
  import type { NameIdPair, SpeciesDetails, SpeciesShort } from "@/types"
  
  import SearchBar from "./SearchBar.svelte";
  import SpeciesCard from "@/components/SpeciesCard.svelte";
	import { fetchNameIdPairs } from "@/utils";

  let isLoading: boolean = $state(false);
  let sentinel = $state<HTMLDivElement>();

  let speciesList: SpeciesShort[] = $state([]);
  let nameIdPairs: NameIdPair[] = $state([]);

  let indexCurrentlyShown: number = $state(0);
  let observer: IntersectionObserver;

  let searchQuery: string = $state("");
  let filterValue: string = $state("name");
  let sortValue: string = $state("id");

  let isHasMore: boolean = $derived(speciesList.length <= indexCurrentlyShown);

  let nameIdPairsQueried: NameIdPair[] = $derived(nameIdPairs
        .filter(pair => {
          const query = searchQuery?.toLowerCase() ?? "";
          if (!query)
            return true;
          if (filterValue === "name")
            return pair.name.toLowerCase().startsWith(query);
          return pair.id.toString().includes(query);
        })
        .sort((a, b) => {
          if (sortValue === "name")
            return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
          return a.id - b.id;
        })
      );


  onMount(() => {
    (async () => {
      const fetchResult = await fetchNameIdPairs();
      nameIdPairs = fetchResult;
    })();

    observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting && !isLoading && isHasMore) {
                isLoading = true;
                hydrateThenPushItems(nameIdPairsQueried.slice(indexCurrentlyShown, indexCurrentlyShown + 10) as SpeciesShort[])
                  .finally(() => { isLoading = false });
              }
            },
            { rootMargin: '200px' }
          );

    if (sentinel)
      observer.observe(sentinel);

    return () => observer.disconnect();
  });


  let _debounceTimer: ReturnType<typeof setTimeout>;
  let _currentSearchCounter: number = 0;
  $effect(() => {
    sortValue;
    filterValue;
    searchQuery;
    speciesList = [];
    indexCurrentlyShown = 0;
    isLoading = false;

    clearTimeout(_debounceTimer);

    const _searchCounter = ++_currentSearchCounter;

    _debounceTimer = setTimeout(() => {
      if (_searchCounter !== _currentSearchCounter)
        return;
      isLoading = true;
      hydrateThenPushItems(nameIdPairsQueried.slice(0, 10) as SpeciesShort[])
        .finally(() => {
          if (_searchCounter === _currentSearchCounter)
            isLoading = false;
        });
    }, 300);
  });


  async function hydrateThenPushItems(items: SpeciesShort[]) {
    indexCurrentlyShown += items.length;
    try {
      for (const item of items) {
        const subResponse = await fetch(item.url);
        const subResult = await subResponse.json();
  
        const types: string[] = subResult.types.map((t: any) => t.type.name.toUpperCase());
        item.types = types;
        item.details = {...subResult, types} as SpeciesDetails;
      }

      speciesList.push(...items);
      
      await tick();
      if (sentinel && observer) {
        observer.unobserve(sentinel);
        observer.observe(sentinel);
      }
    } catch(e) {
      alert("Failed to hydrate:"+e);
    }
  }
</script>


<div class="p-4 space-y-4">
  <SearchBar bind:searchQuery bind:filterValue bind:sortValue />
  <div class="card-grid">
    {#each speciesList as speciesItem}
      <SpeciesCard {...speciesItem} />
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
