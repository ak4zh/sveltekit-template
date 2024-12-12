<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { Loader2 } from 'lucide-svelte';
	import { userUpdatePasswordSchema, type UserUpdatePasswordSchema } from './schemas';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from '$app/environment';
	import * as m from '$paraglide/messages.js';

	let {
		action,
		data
	}: { action: string; data: SuperValidated<Infer<UserUpdatePasswordSchema>> } = $props();
	const form = superForm(data, {
		validators: zodClient(userUpdatePasswordSchema)
	});
	const { form: formData, enhance, submitting, delayed, tainted } = form;
	let disabled = $state(false);
	$effect(() => {
		disabled = !$tainted || $submitting || $delayed;
	});
</script>

<div class="flex flex-col gap-4">
	<form use:enhance method="POST" {action}>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">{m.change_pour_password()}</Card.Title>
				<Card.Description>{m.change_your_password_description()}</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field {form} name="password">
					<Form.Control >
						{#snippet children({ attrs })}
												<Form.Label>{m.new_password()}</Form.Label>
							<Input {...attrs} bind:value={$formData.password} type="password" />
																	{/snippet}
										</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="confirmPassword">
					<Form.Control >
						{#snippet children({ attrs })}
												<Form.Label>{m.confirm_new_password()}</Form.Label>
							<Input {...attrs} bind:value={$formData.confirmPassword} type="password" />
																	{/snippet}
										</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button class="w-full" {disabled}>
					{#if $submitting || $delayed}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{m.please_wait()}
					{:else}{m.update_password()}{/if}
				</Form.Button>
			</Card.Footer>
		</Card.Root>
	</form>
	<div>
		{#if browser}
			<SuperDebug data={$formData} />
		{/if}
	</div>
</div>
