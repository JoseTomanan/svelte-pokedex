<script lang="ts">
  const { name, id, url, type } = $props();
  
  // svelte-ignore state_referenced_locally
  const imageSrc = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;

  import { onMount } from "svelte";

  let isLoading = false;

  onMount(async () => {
    isLoading = true;
    try {

    } catch (e) {
      alert("There was an error in fetching Pokemon details:\n"+e);
    } finally {
      isLoading = false;
    }
  });
</script>



<a href={`species/${id}`}
    class="card flex flex-col items-center
            hover:ring hover:ring-accent">
  <div class="flex flex-row justify-between items-center w-full">
    <h4 class="font-semibold">{name}</h4>
    <h5 class="font-mono">#{id}</h5>
  </div>
  <div class="flex flex-row justify-between items-end w-full">
    <span class="bg-accent px-2 text-accent-foreground rounded">
      {type.toUpperCase()}
    </span>
    <img src={imageSrc}
          alt={name}
          class="size-24"/>
  </div>
</a>