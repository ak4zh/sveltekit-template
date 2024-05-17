<script lang="ts">
	import { APP_NAME } from '$lib/constants';
	export let data;
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			Bevestig je emailadres
		</h1>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Check je email om je emailadres te bevestigen voor de inlog als Partner bij {APP_NAME}. 
			Controleer eventueel ook je map ongewenste mail/spam Heb je geen mail ontvangen,
			<a href="/verify/resend-email-{encodeURIComponent(data?.user?.email)}" class="underline"
				>klik dan hier</a
			> om opnieuw te verzenden.
		</p>
	</div>
</section>
