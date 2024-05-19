<script lang="ts">
	  import DataTable from "./data-table.svelte";
    import { Users, UserSearch } from "lucide-svelte";
	  import * as Card from "$lib/components/ui/card/index.js";
    import { linear } from 'svelte/easing';
	  import { tweened } from 'svelte/motion';
    let { data } = $props();
    let tweenConfig = { duration: 500, easing: linear };

    let total = tweened(data.total, tweenConfig);
    let count = tweened(data.count, tweenConfig);
    $effect(() => {
      total.set(data.total);
      count.set(data.count);
    })
</script>

<div class="flex gap-4 mx-auto">
  <div class="w-full">
    <Card.Root>
      <Card.Header
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <Card.Title class="text-sm font-medium">Total Users</Card.Title>
        <Users class="h-4 w-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">{Math.round($total)}</div>
      </Card.Content>
    </Card.Root>  
  </div>
  <div class="w-full">
    <Card.Root>
      <Card.Header
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <Card.Title class="text-sm font-medium">Filtered Users</Card.Title>
        <UserSearch class="h-4 w-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">{Math.round($count)}</div>
      </Card.Content>
    </Card.Root>  
  </div>
</div>
<div class="container mx-auto py-10">
	  <DataTable deleteForm={data.deleteForm} />
</div>