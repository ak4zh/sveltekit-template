<script lang="ts">
	import { APP_NAME } from '$lib/constants';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as m from "$paraglide/messages.js"
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			{m.heading_confirm_your_email()}
		</h1>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			{m.confirm_your_email_description({ appName: APP_NAME })}
		</p>
		<form method="POST" use:enhance>
			<Button type="submit">{m.button_resend_verification_email()}</Button>
		</form>
	</div>
</section>
