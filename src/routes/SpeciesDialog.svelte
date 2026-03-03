<script lang="ts">
  const initialDetails: SpeciesDetails = $props();
  // svelte-ignore state_referenced_locally
  let details: SpeciesDetails = $state({ ...initialDetails });

  // svelte-ignore state_referenced_locally
  if (!details)
    throw new Error("'details' not defined in SpeciesDialog props.");

  // svelte-ignore state_referenced_locally
  if (!details.types)
    throw new Error("'details.types' not defined in SpeciesDialog props. ID="+details.id);

  import MdiArrowBack from "~icons/mdi/arrow-back";
  import MdiArrowForward from "~icons/mdi/arrow-forward";

	import type { SpeciesDetails } from "@/types";
  import * as Dialog from "../lib/components/ui/dialog";
	import { titleCase, getIdAsParam, nameCase } from "@/utils";
	import { onMount } from "svelte";
	import { MAX_COUNT, TYPE_BG_COLORS, TYPE_WEAKNESSES } from "@/constants";
	import { Skeleton } from "@/components/ui/skeleton";
	import Progress from "@/components/ui/progress/progress.svelte";

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

  let isNewDetailsLoading: boolean = $state(false);
  let isImageLoading: boolean = $state(false);
  let thumbnailImageLink: string = $derived(`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${idParam}.png`);
  let imageSrc = $state();

  onMount(async () => {
    console.log("Child "+details.id+" has been opened");
    fetchImage();
  }); 

  async function fetchImage() {
    imageSrc = undefined;
    isImageLoading = true;

    const img = new Image();
    img.src = thumbnailImageLink;
  
    await img.decode();

    imageSrc = thumbnailImageLink;
    isImageLoading = false;
  }

  async function fetchNewDetails(id: number) {
    // console.log("FETCHING FROM "+id);
    isNewDetailsLoading = true;
    isImageLoading = true;
    details.id = id;
    details.name = "LOADING";
    details.types = [" "];
    details.height = -1;
    details.weight = -1;
    details.order = -1;

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const result = await response.json();
      
      const types = result.types.map((t: any) => t.type.name.toUpperCase());
      details = {...result, types} as SpeciesDetails;
  
      fetchImage();
    } catch {
      console.log("Error fetching new details.");
    } finally {
      isNewDetailsLoading = false;
    }
  }
</script>


{#snippet manyTypesBlock(types: string[])}
  {#each types as type}
    {@const bgColor = TYPE_BG_COLORS[type as keyof typeof TYPE_BG_COLORS]}
    <span class={`${bgColor} text-foreground w-fit px-1 rounded-sm text-xs font-medium`}>
      {type}
    </span>
  {/each}
{/snippet}


<Dialog.Content class="border-none flex flex-col justify-start h-158
            xs:h-148">
  <Dialog.Header class="flex flex-row items-center justify-between z-10 [&>button]:transition">
    <div class="min-w-1/5">
      <button onclick={() => fetchNewDetails(details.id-1)}>
        {#if details.id != 1}
          <MdiArrowBack />
          #{getIdAsParam(details.id-1)}
        {/if}
      </button>
    </div>
    <Dialog.Title class="flex flex-col justify-center items-center *:space-x-0.5 flex-1 h-12">
      <div class="flex flex-wrap justify-center items-center gap-x-0.5 gap-y-0.5">
        {#if isNewDetailsLoading}
          <Skeleton class="grayscale-100 w-18 h-4.5 rounded-none"/>
        {:else}
          <span>{nameCase(details.name)}</span>
        {/if}
        <span class="font-mono opacity-70">#{idParam}</span>
      </div>
      <div>
        {@render manyTypesBlock(details.types!)}
      </div>
    </Dialog.Title>
    <div class="min-w-1/5 flex justify-end">
      <button onclick={() => fetchNewDetails(details.id+1)}>
        {#if details.id != MAX_COUNT}
          #{getIdAsParam(details.id+1)}
          <MdiArrowForward />
        {/if}
      </button>
    </div>
  </Dialog.Header>

  <div class="relative flex justify-center -my-4">
    <span class={`${imageBackdropColor} absolute size-48 rounded-full opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10`}
            aria-hidden="true"
            ></span>
    <div class="h-64">
      {#if isImageLoading}
        <Skeleton class="bg-foreground/50 rounded-full size-32
                    top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 relative" />
      {:else}
        <img src={imageSrc as string}
              alt="Pokemon"
              class="w-64 h-auto relative"/>
      {/if}
    </div>
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
        <h6>ABILITY</h6>
        <p class="truncate">{nameCase(details.abilities[0].ability.name)}</p>
      </div>
      <div class="hidden xs:flex xs:flex-col
                    card h-fit -space-y-0.5 leading-0 text-center flex-1
                    [&>h6]:font-medium [&>p]:font-light">
        <h6>ORDER</h6>
        <p>{details.order}</p>
      </div>
    </div>

    <stats class="card flex flex-col">
      {#each statsHalves as statsHalf}
        <div class="flex-1">
          {#each statsHalf as s}
            <span class="flex flex-row gap-2 items-center">
              <span class="flex flex-row items-center justify-between gap-x-1 flex-1">
                <h6 class="font-semibold">{s.stat.name == "hp" ? "HP" : titleCase(s.stat.name)}</h6>
                <h6 class="font-light">{s.base_stat}</h6>
              </span>
              <Progress value={s.base_stat}
                    max={255}
                    class="saturate-0 w-1/3 xs:w-1/2" />
            </span>
          {/each}
        </div>
      {/each}
    </stats>

    <weaknesses class="flex space-x-0.5 items-baseline p-2 rounded bg-card border border-border
                  ">
      <span class="text-sm mr-2 font-semibold shrink-0">Weak against:</span>
      <div class="flex flex-wrap gap-1 leading-none items-start px-1 bg-card/60">
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