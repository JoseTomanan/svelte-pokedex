<script lang="ts">
  const details: SpeciesDetails = $props();

	import type { SpeciesDetails } from "@/types";
  import * as Dialog from "./ui/dialog";
	import { getIdAsParam, nameCase } from "@/utils";
	import { onMount } from "svelte";
	import { Skeleton } from "./ui/skeleton";
	import { TYPE_BG_COLORS, TYPE_WEAKNESSES } from "@/constants";
	import { types } from "util";

  const idParam: string = $derived(getIdAsParam(details.id));

  onMount(async () => {
  }); 

  async function fetchNewDetails() {
    // TODO: fetch when Previous or Next is clicked
  }
</script>


{#snippet manyTypesBlock(types: string[])}
  {#each types as type}
    {@const bgColor = TYPE_BG_COLORS[type as keyof typeof TYPE_BG_COLORS]}
    <h6 class={`${bgColor} w-fit px-1 rounded-sm`}>
      {type}
    </h6>
  {/each}
{/snippet}

<Dialog.Content class="border-none overflow-clip">
  <Dialog.Header>
    <Dialog.Title>
      {nameCase(details.name)}
      <span class="font-mono opacity-80">
        #{idParam}
      </span>
    </Dialog.Title>
    <Dialog.Close></Dialog.Close>
  </Dialog.Header>
  <pokemon-details>
    <!-- TODO: styling -->
    <div class="flex justify-between items-start">
      <div class="space-y-1 leading-none">
        {@render manyTypesBlock(details.types)}
        <h6>Height: {details.height} cm</h6>
        <h6>Weight: {details.weight} kg</h6>
        <h6>Stats: {details.stats}</h6>
        <h6 class="">
          <!-- TODO: FINISH -->
          <b>WEAKNESSES:</b> <br>
          {#each details.types as type}
            {@const typeWeaknesses = TYPE_WEAKNESSES[type as keyof typeof TYPE_WEAKNESSES]}
            {@render manyTypesBlock(typeWeaknesses)}
          {/each}
        </h6>
      </div>
      <img src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${idParam}.png`}
            alt="Pokemon"
            class="size-128 -z-10 opacity-20 -ml-48 -mt-36 -mb-40" />
    </div>
  </pokemon-details>
  <div class="flex flex-row justify-between text-xs">
    <button>Previous</button>
    <button>Next</button>
  </div>
</Dialog.Content>


<style>
  button {
    background-color: var(--color-white);
    color: var(--accent-foreground);
    border-radius: calc(var(--radius) - 6px);
    border-color: var(--accent);
    border-width: 1px;
    padding-inline: var(--spacing);
  }
</style>