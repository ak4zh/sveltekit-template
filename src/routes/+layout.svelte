<script>
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	const { data, children } = $props();
	const user = $derived(data.user)
</script>

<ModeWatcher />
<div class="relative flex min-h-screen flex-col">
	<div class="flex-1 flex-col">
		<Navigation {user} />
		<div class="mt-8 md:mt-12">
			{@render children()}
		</div>	
	</div>
</div>
