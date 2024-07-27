<script>
	import Footer from '$lib/components/footer/footer.svelte';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import BottomBar from '$lib/components/bottom-bar/bottom-bar.svelte';
	const { data, children } = $props();
</script>

<div class="grid grid-rows-[auto_1fr_auto] min-h-screen">
	<Navigation user={data.user} />
	<main class="container">
		{@render children()}
	</main>
	<Footer />
</div>
