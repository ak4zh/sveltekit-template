<script lang="ts">
	import ProfileUpdateForm from '$lib/forms/ProfileUpdateForm.svelte';
	export let data;
</script>

<div class="mx-auto flex max-w-lg flex-col items-center gap-8 py-8">
	{#if data.form}<ProfileUpdateForm data={data.form} />{/if}
</div>
