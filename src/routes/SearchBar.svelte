<script lang="ts">
  import MdiSearch from "~icons/mdi/search";
  import { Input } from "$lib/components/ui/input/index";

  let searchFilter = "name" // TODO: make this getContext()
</script>


<div class="relative flex flex-row items-center justify-center">
  <Input id="searchQuery"
          type="text"
          // TODO: value bound to contextualized sort
          class="bg-input focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          // TODO: add filter name to placeholder
          placeholder={`Search by ${searchFilter}...`} />
  <MdiSearch class="grow size-4 m-auto text-muted-foreground absolute top-1/2 -translate-1/2 right-4 pointer-events-none" />
  <!-- TODO: Add filters dropdown-->
  <!-- TODO: Add sort category dropdown  -->
</div>