<script lang="ts">
  const inputDetails: SpeciesDetails = $props();
  
  let details: SpeciesDetails = $derived(inputDetails);

  import MdiArrowBack from "~icons/mdi/arrow-back";
  import MdiArrowForward from "~icons/mdi/arrow-forward";

	import type { SpeciesDetails } from "@/types";
  import * as Dialog from "./ui/dialog";
	import { titleCase, getIdAsParam, nameCase } from "@/utils";
	import { onMount } from "svelte";
	import { TYPE_BG_COLORS, TYPE_WEAKNESSES } from "@/constants";

  const idParam: string = $derived(getIdAsParam(details.id));
  const imageBackdropColor = $derived( TYPE_BG_COLORS[details.types[0] as keyof typeof TYPE_BG_COLORS] )
  const statsHalves = $derived( [details.stats.slice(0, 3), details.stats.slice(3)] );

  const typeWeaknesses = $derived(
    Array.from(
      new Set(
        details.types
          .flatMap((type) => TYPE_WEAKNESSES[type as keyof typeof TYPE_WEAKNESSES])
      )
    )
  );

  let isImageLoading: boolean = $state(true);
  let thumbnailImageLink: string = $derived(`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${idParam}.png`);
  let imageSrc = $state();

  onMount(async () => {
    fetchImage();
  }); 

  async function fetchImage() {
    imageSrc = undefined;

    const img = new Image();

    img.src = thumbnailImageLink;
    img.onload = () => {
      imageSrc = thumbnailImageLink;
      isImageLoading = false;
    }

    img.onerror = () => isImageLoading = false;
  }

  async function fetchNewDetails(id: number) {
    console.log(id);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const result = await response.json();
      
      const types = result.types.map((t: any) => t.type.name.toUpperCase());
      details = {...result, types} as SpeciesDetails;
  
      fetchImage();
    } catch {
      console.log("Error fetching new details.");
    }
  }
</script>


{#snippet manyTypesBlock(types: string[])}
  {#each types as type}
    {@const bgColor = TYPE_BG_COLORS[type as keyof typeof TYPE_BG_COLORS]}
    <span class={`${bgColor} text-foreground w-fit px-1 rounded-sm text-xs`}>
      {type}
    </span>
  {/each}
{/snippet}


<Dialog.Content class="border-none overflow-clip" showCloseButton={false}>
  <Dialog.Header class="flex flex-row items-center justify-between z-10">
    <button class="transition"
            onclick={() => fetchNewDetails(details.id-1)}>
      {#if details.id != 1}
        <MdiArrowBack />
        #{getIdAsParam(details.id-1)}
      {/if}
    </button>
    <Dialog.Title class="flex flex-col items-center *:space-x-0.5">
      <div>
        {nameCase(details.name)}
        <span class="font-mono opacity-70">#{idParam}</span>
      </div>
      <div>
        {@render manyTypesBlock(details.types)}
      </div>
    </Dialog.Title>
    <button class="transition"
            onclick={() => fetchNewDetails(details.id+1)}>
      {#if details.id != 1350}
        #{getIdAsParam(details.id+1)}
        <MdiArrowForward />
      {/if}
    </button>
  </Dialog.Header>
  <div class="relative flex justify-center -my-4">
    <span class={`${imageBackdropColor} absolute size-48 rounded-full opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10`}
            aria-hidden="true"
            ></span>
    {#if isImageLoading}
      <span class="rounded-full w-48 m-8 relative"
              aria-hidden="true"
              ></span>
    {:else}
      <img src={imageSrc as string}
            alt="Pokemon"
            class="w-64 h-auto relative"/>
    {/if}
  </div>
  <pokemon-details class="flex flex-col justify-between space-y-1">
    <div class="flex flex-row gap-1 w-full">
      <div class="card h-fit -space-y-0.5 leading-0 text-center flex-1
                    [&>h6]:font-medium [&>p]:font-light">
        <h6>HEIGHT</h6>
        <p>{(details.height * 0.10).toFixed(1)} m</p>
      </div>
      <div class="card h-fit -space-y-0.5 leading-0 text-center flex-1
                    [&>h6]:font-medium [&>p]:font-light">
        <h6>WEIGHT</h6>
        <p>{details.weight} kg</p>
      </div>
      <div class="card h-fit -space-y-0.5 leading-0 text-center flex-1
                    [&>h6]:font-medium [&>p]:font-light">
        <h6>SPECIES</h6>
        <p>{nameCase(details.species.name)}</p>
      </div>
      <div class="hidden sm:flex sm:flex-col
                    card h-fit -space-y-0.5 leading-0 text-center flex-1
                    [&>h6]:font-medium [&>p]:font-light">
        <h6>ORDER</h6>
        <p>{details.order}</p>
      </div>
    </div>
    <stats class="card flex flex-col sm:flex-row">
      {#each statsHalves as statsHalf}
        <div class="flex-1">
          {#each statsHalf as s}
            <span class="flex flex-row gap-2 [&>h6]:flex-1">
              <h6 class="font-semibold">{s.stat.name == "hp" ? "HP" : titleCase(s.stat.name)}</h6>
              <h6 class="font-light">{s.base_stat}</h6>
            </span>
          {/each}
        </div>
      {/each}
    </stats>
    <weaknesses class="flex space-x-1 items-baseline p-2 rounded bg-card border border-border">
      <span class="text-sm mr-2 font-semibold shrink-0">Weak against:</span>
      <div class="flex flex-wrap gap-1 leading-none items-start">
        {@render manyTypesBlock(typeWeaknesses)}
      </div>
    </weaknesses>
  </pokemon-details>
</Dialog.Content>


<style>
  button {
    color: var(--input-foreground);
    border-radius: calc(var(--radius) - 6px);
    opacity: 30%;
    font-family: var(--font-mono);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
  }

  button:hover {
    opacity: 70%;
  }
</style>