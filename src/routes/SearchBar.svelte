<script lang="ts">
  let {
    searchQuery = $bindable(),
    filterValue = $bindable(),
    sortValue = $bindable(),
  } = $props(); 

  import MdiSearch from "~icons/mdi/search";
  import { Input } from "$lib/components/ui/input/index";

	import * as Select from "@/components/ui/select";
	import type { SearchBarProps } from "@/context";
  
  const SORT_CHOICES = ["id", "name"];
  const FILTER_CHOICES = ["id", "name"];

  const LONG_HAND_MATCHER = (x: string) => x == "id" ? "ID no." : "name";

  const sortTriggerContent = $derived("Sort by " + (sortValue ? LONG_HAND_MATCHER(sortValue) : "..."));
  const filterTriggerContent = $derived(filterValue ? LONG_HAND_MATCHER(filterValue) : "...");
</script>


<div class="flex flex-col justify-center items-center gap-1
              md:flex-row">
  <div class="relative flex flex-row items-center justify-center w-full">
    <Input id="searchQuery"
            type="text"
            bind:value={searchQuery}
            placeholder={`Search by ${filterTriggerContent}...`}
            class="bg-card text-sm border focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
    <MdiSearch class="grow size-4 m-auto text-input-foreground 
                        absolute top-1/2 -translate-1/2 right-0 pointer-events-none" />
  </div>
  <div class="flex flex-row justify-center items-center w-full gap-x-1">
    <Select.Root type="single"
                  name="sort"
                  bind:value={sortValue}>
      <Select.Trigger class="w-1/2">
        {sortTriggerContent}
      </Select.Trigger>
      <Select.Content>
        {#each SORT_CHOICES as value}
          <Select.Item {value}>
            {value == "id" ? "ID no." : "Name"}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <Select.Root type="single"
                  name="filter"
                  bind:value={filterValue} >
      <Select.Trigger class="w-1/2">
        Filter by {filterTriggerContent}
      </Select.Trigger>
      <Select.Content>
        {#each FILTER_CHOICES as value}
          <Select.Item {value}>
            {value == "id" ? "ID no." : "Name"}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
</div>