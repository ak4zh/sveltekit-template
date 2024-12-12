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

	interface Props {
		value: string;
	}

	let { value }: Props = $props();
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild>
		<Button
			size="icon"
			variant="ghost"
			onclick={() => {
				copyText(value);
				copiedMessage(`Invite URL copied to clipboard!`);
			}}><Copy /></Button
		>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Copy to clipboard</p>
	</Tooltip.Content>
</Tooltip.Root>
