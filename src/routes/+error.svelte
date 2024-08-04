<script>
	import { page } from "$app/stores";
  import { Button } from '$lib/components/ui/button'
</script>

<div class="grid place-items-center min-h-screen">
    <div class="grid gap-4">
      <h2 class="text-lg font-bold">{$page.error?.message}</h2>
      <h1 class="text-3xl font-bold">{$page.status}</h1>
      <p class="text-lg text-gray-400 dark:text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <Button href="/">
          Return to Menu
      </Button>
    </div>
</div>