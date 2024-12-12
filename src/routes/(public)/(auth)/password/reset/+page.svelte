<script lang="ts">
	import PasswordResetForm from '$lib/forms/PasswordResetForm.svelte';
	let { data } = $props();
</script>

<div class="mx-auto flex max-w-lg flex-col items-center gap-8 py-8">
	<PasswordResetForm data={data.form} />
</div>
