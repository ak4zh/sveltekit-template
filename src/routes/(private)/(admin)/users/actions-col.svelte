<script lang="ts">
	import { page } from '$app/stores';
	import CopyToClipboard from '$lib/components/copy-to-clipboard/copy-to-clipboard.svelte';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableEdit from './data-table-edit.svelte';

	let { referralCode, updateFormData, deleteFormData } = $props();
</script>

<div class="flex gap-2">
	<CopyToClipboard value={`${$page.url.origin}/r/${referralCode}`} />
	<DataTableEdit data={updateFormData} />
	<DataTableActions data={deleteFormData} />
</div>
