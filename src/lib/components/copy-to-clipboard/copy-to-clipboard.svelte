<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Copy } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { copyText } from 'svelte-copy';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';

	const flash = getFlash(page);

	function copiedMessage(message: string) {
		$flash = { type: 'success', message };
	}

	export let value: string;
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild>
		<Button
			class="relative h-8 w-8 p-0"
			size="icon"
			variant="ghost"
			on:click={() => {
				copyText(value);
				copiedMessage(`Invite URL copied to clipboard!`);
			}}><Copy /></Button
		>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Copy to clipboard</p>
	</Tooltip.Content>
</Tooltip.Root>
