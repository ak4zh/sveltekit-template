<script lang="ts">
	import LoginForm from '$lib/forms/LoginForm.svelte';
	export let data;
</script>

<div class="mx-auto flex max-w-lg flex-col items-center gap-8 py-8">
	<LoginForm data={data.form} />
</div>
