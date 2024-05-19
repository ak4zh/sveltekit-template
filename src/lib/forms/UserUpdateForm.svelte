<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from '$app/environment';
	import { userUpdateByAdminSchema } from './schemas';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Writable } from 'svelte/store';
	import { User } from 'lucide-svelte';

	let {
		data,
		disabled,
		dialogOpen,
		sheetOpen
	}: {
		data: User;
		disabled: Writable<boolean>;
		dialogOpen: Writable<boolean>;
		sheetOpen: Writable<boolean>;
	} = $props();
	const form = superForm(data, {
		validators: zodClient(userUpdateByAdminSchema),
		resetForm: false,
		onResult({ result }) {
			if (result.type === 'success') {
				$dialogOpen = false;
				$sheetOpen = false;
			}
		}
	});
	const { form: formData, enhance, submitting, delayed } = form;
	$effect(() => {
		$disabled = $submitting || $delayed;
	});
	$effect(() => console.log('Comp:', open));
</script>

<div class="flex flex-col gap-4">
	<form use:enhance method="POST" action="?/update" id="edit-${$formData.id}">
		<input hidden name="id" value={$formData.id} />
		<Form.Field {form} name="role">
			<Form.Control>
				<Form.Label>Role</Form.Label>
				<Select.Root
					onSelectedChange={(e) => ($formData.role = e?.value)}
					selected={{ label: $formData.role, value: $formData.role }}
				>
					<Select.Trigger class="w-[180px]">
						<Select.Value placeholder="Select a role" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Item value="" label="">-</Select.Item>
							<Select.Item value="USER" label="USER">USER</Select.Item>
							<Select.Item value="ADMIN" label="ADMIN">ADMIN</Select.Item>
						</Select.Group>
					</Select.Content>
					<Select.Input name="role" bind:value={$formData.role} />
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Name</Form.Label>
				<Input {...attrs} bind:value={$formData.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</form>
	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</div>
