<script lang="ts">
	import PasswordUpdateForm from '$lib/forms/PasswordUpdateForm.svelte';
	export let data;
</script>

<div class="mx-auto flex max-w-lg flex-col items-center gap-8 py-8">
	<PasswordUpdateForm data={data.form} action="" />
</div>
