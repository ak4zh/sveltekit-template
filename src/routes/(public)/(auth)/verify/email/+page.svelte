<script lang="ts">
	import { APP_NAME } from '$lib/constants';
	import { enhance } from "$app/forms";
	import { Button } from '$lib/components/ui/button';
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			Confirm Your Email Address
		</h1>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Check your email to confirm your email address to log in at {APP_NAME}.
			If necessary, also check your junk mail/spam folder.
		</p>
		<form method="POST" use:enhance>
			<Button type="submit">Resend Verification Email</Button>
		</form> 
	</div>
</section>
