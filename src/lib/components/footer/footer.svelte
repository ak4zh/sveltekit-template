<script lang="ts">
	import { APP_NAME } from '$lib/constants';
	import * as m from '$paraglide/messages.js';
	import Separator from '../ui/separator/separator.svelte';
	let currentYear = new Date().getFullYear();
</script>

<footer class="flex flex-col gap-4 text-center py-4">
	<div class="mx-auto flex justify-center space-x-8">
		<a
			href="/privacy"
			class="mr-4 text-sm text-gray-500 hover:underline dark:text-gray-400 md:mr-6"
			>{m.privacy()}</a
		>
		<a
			href="/disclaimer"
			class="mr-4 text-sm text-gray-500 hover:underline dark:text-gray-400 md:mr-6"
			>{m.disclaimer()}</a
		>
		<a
			href="/terms"
			class="mr-4 text-sm text-gray-500 hover:underline dark:text-gray-400 md:mr-6"
			>{m.terms()}</a
		>
	</div>
</footer>
