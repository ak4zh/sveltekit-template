<script lang="ts">
	import PasswordUpdateForm from '$lib/forms/PasswordUpdateForm.svelte';
	export let data;
</script>

<div class="flex flex-col items-center gap-8 mx-auto max-w-lg py-8">
	<PasswordUpdateForm data={data.form} />
</div>
