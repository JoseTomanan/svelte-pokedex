<script lang="ts">
  const { data } = $props();
  // svelte-ignore state_referenced_locally
  const nameIdPairs = data.nameIdPairs;

  import { Skeleton } from "@/components/ui/skeleton";

  import { onMount, tick } from "svelte";
  import type { NameIdPair, SpeciesDetails, SpeciesShort } from "@/types"
  
  import SearchBar from "./SearchBar.svelte";
  import SpeciesCard from "./SpeciesCard.svelte";

  let isLoading: boolean = $state(true);
  let sentinel = $state<HTMLDivElement>();
  let observer: IntersectionObserver;
  let searchQuery: string = $state("");
  let filterValue: string = $state("name");
  let sortValue: string = $state("id");
  let isSortAscending: boolean = $state(true)


  // ================ Caching, fetching, etc. ================
  let indexCurrentlyShown: number = $state(0);

  let nameIdPairsQueried: SpeciesShort[] = $state([]);
  let speciesListDerived: SpeciesShort[] = $derived(nameIdPairsQueried.slice(0, indexCurrentlyShown));

  let isHasMore: boolean = $derived(nameIdPairsQueried.length > indexCurrentlyShown);

  let _debounceTimer: ReturnType<typeof setTimeout>;
  let currentSearchCounter: number = 0;
  let activeSearchCounter: number = 0;

  $effect(() => {
    sortValue;
    filterValue;
    searchQuery;

    nameIdPairsQueried = nameIdPairs
        .filter(pair => {
          const query = searchQuery?.toLowerCase() ?? "";
          if (!query)
            return true;
          if (filterValue === "name")
            return pair.name.toLowerCase().startsWith(query);
          return pair.id.toString().includes(query);
        })
        .sort((a, b) => {
          let res;
          if (sortValue === "name")
            res = a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
          else
            res = a.id - b.id;
          return isSortAscending ? res : -res;
        }) as SpeciesShort[];

    indexCurrentlyShown = 0;
    isLoading = false;

    clearTimeout(_debounceTimer);
    const _searchCounter = ++currentSearchCounter;
    activeSearchCounter = _searchCounter;

    _debounceTimer = setTimeout(() => {
      if (activeSearchCounter !== currentSearchCounter)
        return;
      console.log("::: $effect hydration operation started");
      isLoading = true;
      hydrateItems(0, 10)
        .finally(() => {
          if (activeSearchCounter === currentSearchCounter)
            isLoading = false;
        });
      console.log("::: $effect hydration operation completed");
    }, 300);
  });

  async function hydrateItems(startIndex: number, endIndex: number) {
    const _arraySnapshot = nameIdPairsQueried.slice();
    const nameIdPairsSlice = _arraySnapshot.slice(startIndex, endIndex);

    console.log(startIndex, endIndex);
    console.log(`--> length of slice = ${nameIdPairsQueried.slice(startIndex, endIndex).length}`);

    try {
      const newItems: SpeciesShort[] = [];
      for (const item of nameIdPairsSlice) {
        if (activeSearchCounter !== currentSearchCounter)
          return;

        const subResponse = await fetch(item.url);
        const subResult = await subResponse.json();
        const types: string[] = subResult.types.map((t: any) => t.type.name.toUpperCase());
        const details: SpeciesDetails = { ...subResult, types } as SpeciesDetails;
        
        newItems.push({...item, types, details});
      }

      if (activeSearchCounter !== currentSearchCounter)
        return;

      nameIdPairsQueried = [
              ...nameIdPairsQueried.slice(0, startIndex),
              ...newItems,
              ...nameIdPairsQueried.slice(endIndex)
            ];

      indexCurrentlyShown += endIndex - startIndex;
      
      await tick();
      if (sentinel && observer) {
        observer.unobserve(sentinel);
        observer.observe(sentinel);
      }
    } catch(e) {
      alert("FAILED TO FINISH HYDRATION OPERATION:\n"+e+"\n\nSTART INDEX: "+startIndex+"\nEND INDEX: "+endIndex);
    }
  }


  // ================ On mount ================
  onMount(() => {
    observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting && !isLoading && isHasMore) {
                isLoading = true;
                hydrateItems(indexCurrentlyShown, indexCurrentlyShown + 10)
                  .finally(() => { isLoading = false });
                console.log(`::: observer hydration operation completed for ${indexCurrentlyShown}:${indexCurrentlyShown+10}`);
              }
            },
            { rootMargin: '200px' }
          );

    if (sentinel)
      observer.observe(sentinel);

    return () => observer.disconnect();
  });
</script>


<div class="p-4 space-y-3">
  <SearchBar bind:searchQuery
          bind:filterValue
          bind:sortValue
          bind:isSortAscending />
  <h6 class="text-right w-full opacity-60">
    {isLoading
      ? "Loading..."
      : `Showing ${nameIdPairsQueried.length} items`}
  </h6>
  <div class="card-grid">
    {#each speciesListDerived as speciesItem}
      {#if speciesItem.types}
        <SpeciesCard {...speciesItem} />
      {/if}
    {/each}

    {#if isLoading || isHasMore}
      {#each { length: 4 } as _}
        <Skeleton class="bg-muted-foreground/25 min-h-32"/>
      {/each}
    {/if}
  </div>

  {#if isHasMore}
    <div bind:this={sentinel}></div>
  {:else}
    <h4 class="opacity-60 flex justify-center items-center">
      END OF LIST
    </h4>
  {/if}
</div>
