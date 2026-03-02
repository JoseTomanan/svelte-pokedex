<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/pokeball.svg';
  import NavBar from './NavBar.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Oak's Assistant</title>
</svelte:head>

<div class="flex justify-center bg-fixed min-h-[92vh]">
  <NavBar/>
  <div class="pt-15 container">
    {@render children()}
  </div>
</div>
<footer class="flex justify-center py-4">
  <p class="text-xs text-muted-foreground/60">Made with love, by Jose &hearts;</p>
</footer>
