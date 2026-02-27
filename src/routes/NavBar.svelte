<script lang="ts">
  import pokeball from '$lib/assets/pokeball.svg';

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
</script>

<nav class="flex flex-row justify-between items-center">
  <button class="flex flex-row gap-2 justify-center items-center text-left cursor-pointer"
        onclick={scrollToTop}>
    <img src={pokeball}
          alt="Logo"
          class="size-8 slow-spin"/>
    <span class="hidden md:flex md:flex-col">
      <h3 class="-mb-1 font-semibold">
        Oak's Assistant
      </h3>
      <h5 class="-mt-1">Made for Professor Oak</h5>
    </span>
  </button>
  <div class="space-x-4 tracking-tight header-links">
    <a href="https://pokeapi.co/docs/v2">PokéAPI</a>
    <a href="https://github.com/JoseTomanan/oaks-assistant">Repository</a>
  </div>
</nav>