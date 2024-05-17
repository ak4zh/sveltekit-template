<script lang="ts">
	import LoginForm from '$lib/forms/LoginForm.svelte';
	export let data;
</script>

<div class="flex flex-col items-center gap-8 mx-auto max-w-lg py-8">
	<LoginForm data={data.form} />
</div>
