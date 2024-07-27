<script lang="ts">
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import BottomBar from '$lib/components/bottom-bar/bottom-bar.svelte';

	const { data, children } = $props();
</script>

<div class="grid md:grid-cols-[auto_1fr] divide-x-2">
	<div class="hidden md:block p-4">
		<Sidebar />
	</div>
	<div class="grid grid-rows-[auto_1fr_auto] h-dvh">
		<Navigation user={data.user} />
		<main class="container overflow-y-auto">
			{@render children()}
		</main>
		<div class="md:hidden bg-secondary w-screen">
			<BottomBar />
		</div>
	</div>
</div>
