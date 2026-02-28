<script lang="ts">
  const { name, id, url, types }: SpeciesShort = $props();

  import { Trigger } from "./ui/dialog";
  import { Skeleton } from "./ui/skeleton";
	import { TYPE_BG_COLORS, TYPE_RING_COLORS } from "@/constants";

  import type { SpeciesShort, SpeciesDetails } from "@/types";
	import { getIdAsParam, nameCase } from "@/utils";
	import { onMount } from "svelte";

  const idParam: string = $derived(getIdAsParam(id));
  const thumbnailImageLink = $derived(`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${idParam}.png`);

  const typeIcons = import.meta.glob('$lib/assets/pokemon-types-icons/*.svg', {
    eager: true,
    query: '?url',
    import: 'default',
  });

  const getTypeIcon = (t: string) => typeIcons[`/src/lib/assets/pokemon-types-icons/${t}.svg`];
  const ringColor = $derived(TYPE_RING_COLORS[types[0] as keyof typeof TYPE_RING_COLORS]);

  let isImageLoading: boolean = $state(false);
  let imageSrc = $state();

  onMount(async () => {
    isImageLoading = true;
    const img = new Image();

    img.src = thumbnailImageLink;
    img.onload = () => {
      imageSrc = thumbnailImageLink;
      isImageLoading = false;
    }

    img.onerror = () => isImageLoading = false;
  });
</script>


<Trigger class={`card group ${ringColor} flex flex-col items-center overflow-clip transition
                  hover:ring-2 hover:bg hover:border-card`}>
  <div class="flex flex-row justify-between items-center gap-1 w-full">
    <h4 class="font-semibold">
      {nameCase(name)}
    </h4>
    <h4 class="font-mono z-2 leading-none bg-card text-foreground/60">
      #{idParam}
    </h4>
  </div>
  <div class="flex flex-row justify-between items-end w-full">
    <div class="flex flex-row gap-1">
      {#each types as type}
        {@const thisBgColor = TYPE_BG_COLORS[type as keyof typeof TYPE_BG_COLORS]}
        {@const typeIconUrl = (() => {
                const returnableIcon = getTypeIcon(type.toLowerCase());
                if (typeof returnableIcon !== "string")
                  throw new Error(`ICON FOR TYPE '${type}' NOT FOUND`); 
                return returnableIcon; 
              })()}
        <span class={`${thisBgColor} p-1 text-foreground rounded-full w-fit opacity-80
                        group-hover:opacity-100`}>
          <img src={typeIconUrl as string}
                class="size-4"
                alt={type} />
        </span>
      {/each}
    </div>
    {#if isImageLoading}
      <Skeleton class="rounded-full size-26 bg-muted-foreground/25"/>
    {:else}
      <img src={imageSrc as string}
            alt={name}
            class="h-40 w-60 px-10 opacity-60 z-1 -mt-6 -mb-8 -ml-8
                    group-hover:opacity-100"/>
    {/if}
  </div>
</Trigger>
