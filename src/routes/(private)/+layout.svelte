<script lang="ts">
	import Footer from '$lib/components/footer/footer.svelte';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import BottomBar from '$lib/components/bottom-bar/bottom-bar.svelte';

	const { data, children } = $props();
</script>

<Sidebar />
<div class="flex flex-col min-h-screen sm:gap-4 sm:py-4 sm:pl-14">
	<Navigation user={data.user} />
	<!-- <div class="flex flex-col sm:gap-4 sm:pl-14">
		<Breadcrumb />
	</div> -->
	<main class="container">
		{@render children()}
	</main>
	<Footer />
	<BottomBar />
</div>