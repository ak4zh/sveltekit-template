<script lang="ts">
	import PasswordResetForm from '$lib/forms/PasswordResetForm.svelte';
	export let data;
</script>

<div class="flex flex-col items-center gap-8 mx-auto max-w-lg py-8">
	<PasswordResetForm data={data.form} />
</div>
