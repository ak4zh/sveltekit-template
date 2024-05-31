<script>
	import Footer from '$lib/components/footer/footer.svelte';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	const { data, children } = $props();
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<div class="flex flex-col sm:gap-4 sm:py-4">
		<Navigation user={data.user} />
		<main class="p-4">
			{@render children()}
		</main>
	</div>
	<Footer />
</div>
