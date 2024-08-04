<script lang="ts">
	import { page } from "$app/stores";
  import { Button } from '$lib/components/ui/button'

  const userErrorMessages = {
    '404': 'Oops! The page you’re looking for doesn’t exist.',
    '500': 'Sorry, something went wrong on our end. Please try again later.',
    '400': 'There was a problem with your request. Please check and try again.',
    '401': 'You need to log in to access this page.',
    '403': 'You don’t have permission to view this page.',
    '422': 'Your request could not be processed. Please check the details and try again.',
    // Add more error codes and messages as needed
  };

  function getUserErrorMessage(errorCode: number) {
    return userErrorMessages[`${errorCode}` as keyof typeof userErrorMessages] 
      || 'An unexpected error occurred. Please try again later.';
  }
</script>

<div class="grid place-items-center min-h-screen">
    <div class="grid gap-4">
      <h2 class="text-lg font-bold">{$page.error?.message}</h2>
      <h1 class="text-3xl font-bold">{$page.status}</h1>
      <p class="text-lg text-gray-400 dark:text-gray-500 mb-8">{getUserErrorMessage($page.status)}</p>
      <Button href="/">
          Return to Home
      </Button>
    </div>
</div>