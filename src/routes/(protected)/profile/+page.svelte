<script lang="ts">
	import ProfileUpdateForm from '$lib/forms/ProfileUpdateForm.svelte';
	export let data;
</script>

<div class="flex flex-col items-center gap-8 mx-auto max-w-lg py-8">
	<ProfileUpdateForm data={data.form} />
</div>
