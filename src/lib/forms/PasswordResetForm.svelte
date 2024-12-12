<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { Loader2 } from 'lucide-svelte';
	import { resetPasswordSchema, type ResetPasswordSchema } from './schemas';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from '$app/environment';
	import * as m from '$paraglide/messages.js';

	interface Props {
		data: SuperValidated<Infer<ResetPasswordSchema>>;
	}

	let { data }: Props = $props();
	const form = superForm(data, {
		validators: zodClient(resetPasswordSchema)
	});
	const { form: formData, enhance, submitting, delayed } = form;
</script>

<div class="flex flex-col gap-4">
	<form use:enhance method="POST">
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">{m.reset_your_password()}</Card.Title>
				<Card.Description>{m.password_reset_description()}</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field {form} name="email">
					<Form.Control >
						{#snippet children({ attrs })}
												<Form.Label>Email</Form.Label>
							<Input {...attrs} bind:value={$formData.email} />
																	{/snippet}
										</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button class="w-full" disabled={$submitting || $delayed}>
					{#if $submitting || $delayed}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{m.please_wait()}
					{:else}{m.send_password_reset_email()}{/if}
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
