<script>
	import * as m from '$paraglide/messages.js';
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			{m.password_changed_successfully()}
		</h1>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			{m.password_reset_success_description()}
		</p>
	</div>
</section>
