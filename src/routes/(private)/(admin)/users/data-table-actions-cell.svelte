<script lang="ts">
	import { page } from '$app/stores';
	import CopyToClipboard from '$lib/components/copy-to-clipboard/copy-to-clipboard.svelte';
	import CrudSheet from '$lib/components/crud-sheet/crud-sheet.svelte';
	import DataTableActions from './data-table-actions.svelte';
	import * as m from '$paraglide/messages.js';
	import UserUpdateForm from '$lib/forms/UserUpdateForm.svelte';

	let { referralCode, updateFormData, deleteFormData } = $props();
</script>

<div class="flex gap-2">
	<CopyToClipboard value={`${$page.url.origin}/r/${referralCode}`} />
	<CrudSheet 
		title={m.edit_user()}
		description={m.edit_user_description()}
		triggerText=m.edit_user()
		triggerSize="icon"
		triggerVariant="ghost"
		form={UserUpdateForm} 
		data={updateFormData} />
	<DataTableActions data={deleteFormData} />
</div>
