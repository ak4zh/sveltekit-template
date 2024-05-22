<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { Loader2 } from 'lucide-svelte';
	import { userUpdatePasswordSchema, type UserUpdatePasswordSchema } from './schemas';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from '$app/environment';
	import * as m from "$paraglide/messages.js"

	let { action, data }: { action: string, data: SuperValidated<Infer<UserUpdatePasswordSchema>> } = $props()
	const form = superForm(data, {
		validators: zodClient(userUpdatePasswordSchema)
	});
	const { form: formData, enhance, submitting, delayed, tainted } = form;
	let disabled = $state(false)
	$effect(() => { disabled = !$tainted || $submitting || $delayed})
</script>

<div class="flex flex-col gap-4">
	<form use:enhance method="POST" action={action}>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">{m.changeYourPassword()}</Card.Title>
				<Card.Description>{m.changeYourPasswordDescription()}</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>{m.newPassword()}</Form.Label>
						<Input {...attrs} bind:value={$formData.password} type="password" />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="confirmPassword">
					<Form.Control let:attrs>
						<Form.Label>{m.confirmNewPassword()}</Form.Label>
						<Input {...attrs} bind:value={$formData.confirmPassword} type="password"/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button class="w-full" disabled={disabled}>
					{#if $submitting || $delayed}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{m.pleaseWait()}
					{:else}{m.updatePassword()}{/if}
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
