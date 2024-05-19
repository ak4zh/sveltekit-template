<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Card from '$lib/components/ui/card';
	import { Loader2 } from 'lucide-svelte';
	import { signUpSchema, type SignUpSchema } from './schemas';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from '$app/environment';
	import * as m from "$paraglide/messages.js"

	export let data: SuperValidated<Infer<SignUpSchema>>;
	const form = superForm(data, {
		validators: zodClient(signUpSchema)
	});
	const { form: formData, enhance, submitting, delayed } = form;
</script>
<div class="flex flex-col gap-4">
	<form use:enhance method="POST" >
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Create an account</Card.Title>
				<Card.Description
					>Already have an account? <a href="/login" class="underline">Log in here.</a
					></Card.Description
				>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<!-- {#if $allErrors?.length}
					<Alert.Root variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>
							<ol class="list-decimal">
								{#each $allErrors as error}
									<li>{error.path[0].toUpperCase()}{error.path.slice(1)} - {error.messages}</li>
								{/each}
							</ol>
						</Alert.Description>
					</Alert.Root>
				{/if} -->
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>{m.name()}</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
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
				<Form.Field {form} name="terms">
					<Form.Control let:attrs>
						<div class="flex items-center space-x-2">
							<Checkbox
								{...attrs}
								id="terms"
								bind:checked={$formData.terms}
								aria-labelledby="terms-label"
							/>
							<Form.Label
								id="terms-label"
								for="terms"
								class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Accept terms and conditions
							</Form.Label>
						</div>
						<input name={attrs.name} value={$formData.terms} hidden />
					</Form.Control>
					<Form.Description>
						You agree to the <a href="/terms" class="text-primaryHover underline">terms</a>
						and
						<a href="/privacy" class="text-primaryHover underline">privacy policy</a>.
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button class="w-full" disabled={$submitting || $delayed}>
					{#if $submitting || $delayed}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Please wait
					{:else}Sign Up{/if}
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