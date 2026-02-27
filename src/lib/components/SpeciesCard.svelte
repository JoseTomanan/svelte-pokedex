<script lang="ts">
  import { Trigger } from "./ui/dialog";

  import type { SpeciesShort, SpeciesDetails } from "@/types";
	import { getIdAsParam } from "@/utils";

  const { name, id, url, types }: SpeciesShort = $props();

  // svelte-ignore state_referenced_locally
  const idParam: string = getIdAsParam(id);
  
  // svelte-ignore state_referenced_locally
  const imageSrc = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${idParam}.png`;
</script>


<Trigger class="card flex flex-col items-center hover:ring hover:ring-accent">
  <div class="flex flex-row justify-between items-center w-full">
    <h4 class="font-semibold">
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </h4>
    <h5 class="font-mono">#{idParam}</h5>
  </div>
  <div class="flex flex-row justify-between items-end w-full">
    <div class="flex flex-col space-y-1">
      {#each types as type}
        <span class="bg-accent px-1 text-accent-foreground rounded w-fit">
          {type.toUpperCase()}
        </span>
      {/each}
    </div>
    <img src={imageSrc}
          alt={name}
          class="size-24"/>
  </div>
</Trigger>
