<script lang="ts">
	import RegistrationForm from '$lib/forms/RegistrationForm.svelte';
	export let data;
</script>

<div class="flex flex-col items-center gap-8 mx-auto max-w-lg py-8">
	<RegistrationForm data={data.form} />
</div>
