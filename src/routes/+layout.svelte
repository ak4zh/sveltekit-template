<script lang="ts">
	import '../app.css';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit'
	import { i18n } from '$lib/i18n.js'
	import { ModeWatcher } from 'mode-watcher';
	import { getFlash } from 'sveltekit-flash-message';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import Footer from '$lib/components/footer/footer.svelte';
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import { Separator } from '$lib/components/ui/separator';

	const { data, children } = $props();
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
	<div class="relative flex min-h-screen flex-col">
		<div class="flex-1 flex-col">
			<Navigation user={data.user} />
			<div class="mx-auto mt-8 max-w-5xl md:mt-12">
				{@render children()}
			</div>
		</div>
		<Separator />
		<Footer />
	</div>	
</ParaglideJS>
