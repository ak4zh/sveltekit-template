<script lang="ts">
	import { APP_NAME } from '$lib/constants';
	import * as m from "$paraglide/messages.js"
	let currentYear = new Date().getFullYear();
</script>

<section>
	<footer class="bottom-0 m-4 flex flex-col place-items-center gap-4 text-center">
		<div class="container mx-auto flex justify-center space-x-8">
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
		<span class="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
			{m.copyright()}© {currentYear}
			{APP_NAME}
		</span>
	</footer>
</section>
