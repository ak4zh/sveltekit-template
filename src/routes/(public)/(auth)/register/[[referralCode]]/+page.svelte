<script lang="ts">
	import RegistrationForm from '$lib/forms/RegistrationForm.svelte';
	export let data;
</script>

<div class="mx-auto flex max-w-lg flex-col items-center gap-8 py-8">
	<RegistrationForm data={data.form} />
</div>
