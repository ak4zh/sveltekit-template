<script lang="ts">
	  import DataTable from "./data-table.svelte";
    export let data;
</script>

<div class="container mx-auto py-10">
	  <DataTable deleteForm={data.deleteForm} />
</div>