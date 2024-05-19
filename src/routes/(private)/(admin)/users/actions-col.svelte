<script lang="ts">
	import DataTableActions from "./data-table-actions.svelte";
	import DataTableEdit from "./data-table-edit.svelte";

    let { updateFormData, deleteFormData } = $props()
</script>


<DataTableEdit data={updateFormData} />
<DataTableActions data={deleteFormData} />
