<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { Loader2 } from 'lucide-svelte';
	import { loginSchema, type LoginSchema } from './schemas';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from '$app/environment';
	import * as m from "$paraglide/messages.js"

	export let data: SuperValidated<Infer<LoginSchema>>;
	const form = superForm(data, {
		validators: zodClient(loginSchema)
	});
	const { form: formData, enhance, submitting, delayed } = form;
</script>

<div class="flex flex-col gap-4">
	<form use:enhance method="POST">
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">{m.login()}</Card.Title>
				<Card.Description
					>{m.not_registered()} <a href="/register" class="underline">{m.create_account()} here.</a
					></Card.Description
				>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>{m.email()}</Form.Label>
						<Input {...attrs} bind:value={$formData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>{m.password()}</Form.Label>
						<Input {...attrs} type="password" bind:value={$formData.password} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<div class="block w-full">
					<Form.Button class="w-full" disabled={$submitting || $delayed}
						>{#if $submitting || $delayed}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							{m.please_wait()}{:else}{m.login()}{/if}
					</Form.Button>
	
					<div class="mt-6 text-center text-sm">
						<a href="/password/reset" class="underline">{m.forgot_password()}</a>
					</div>
				</div>
			</Card.Footer>
		</Card.Root>
	</form>
	<div>
		{#if browser}
			<SuperDebug data={$formData} />
		{/if}
	</div>
	
</div>
