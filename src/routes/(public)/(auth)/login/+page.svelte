<script lang="ts">
	import LoginForm from '$lib/forms/LoginForm.svelte';
	import { Button }from '$lib/components/ui/button';
	import { Copy } from 'lucide-svelte';
	import * as m from "$paraglide/messages.js"

	let { data } = $props();
	let creds = $state({ email: data.form?.email, password: data.form?.password });
</script>


<div class="mx-auto flex max-w-lg flex-col items-center gap-8 py-8">
	<div class="flex gap-4">
		<Button variant="outline" on:click={() => { creds = { email: 'admin@example.com', password: 'admin123'} }}>
			<Copy class="mr-2 inline h-4 w-4"/>Login as Admin
		</Button>
		<Button variant="outline" on:click={() => { creds = { email: 'demo@example.com', password: 'demo123'} }}>
			<Copy class="mr-2 inline h-4 w-4"/>Login as User
		</Button>
	</div>
	{#key creds}
		<LoginForm data={creds} />
	{/key}
</div>
