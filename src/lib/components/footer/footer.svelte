<script lang="ts">
	import { APP_NAME } from "$lib/constants";
    let currentYear = new Date().getFullYear();
</script>


<section class="">
	<footer class="flex bottom-0 flex-col gap-4 text-center place-items-center m-4">
		<div class="container mx-auto flex justify-center space-x-8">
			<a
				href="/privacy"
				class="mr-4 text-sm text-gray-500 hover:underline md:mr-6 dark:text-gray-400"
				>Privacy Policy</a
			>
	
			<a
				href="/disclaimer"
				class="mr-4 text-sm text-gray-500 hover:underline md:mr-6 dark:text-gray-400"
				>Disclaimer</a
			>
	
			<a
				href="/terms"
				class="mr-4 text-sm text-gray-500 hover:underline md:mr-6 dark:text-gray-400"
				>Terms of service</a
			>
		</div>
		<span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
			Copyright© {currentYear} {APP_NAME}
		</span>
	</footer>
</section>
