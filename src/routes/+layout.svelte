<script lang="ts">
	import '../app.css';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n.js';
	import { ModeWatcher } from 'mode-watcher';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';

	const { children } = $props();
	const flash = $state(getFlash(page));
	$effect(() => {
		if ($flash) {
			switch ($flash.type) {
				case 'success':
					//console.log('flash.message.success: ' + $flash.message);
					toast.success($flash.message);
					break;
				case 'error':
					//console.log('flash.message.error: ' + $flash.message);
					toast.error($flash.message);
					break;
			}
		}
	});
</script>

<ParaglideJS {i18n}>
	<ModeWatcher />
	<Toaster />
	{@render children()}
</ParaglideJS>
