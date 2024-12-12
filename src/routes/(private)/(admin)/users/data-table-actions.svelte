<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Trash2 } from 'lucide-svelte';
	import { userDeleteSchema, type UserDeleteSchema } from '$lib/forms/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as m from '$paraglide/messages.js';

	let { data }: { data: SuperValidated<Infer<UserDeleteSchema>> } = $props();
	const form = superForm(data, {
		validators: zodClient(userDeleteSchema)
	});
	const { form: formData, enhance } = form;
</script>

<AlertDialog.Root>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild >
			{#snippet children()}
						<Button variant="ghost" size="icon">
					<span class="sr-only">{m.open_actions()}</span>
					<Ellipsis class="h-4 w-4" />
				</Button>
								{/snippet}
				</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>{m.actions()}</DropdownMenu.Label>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<AlertDialog.Trigger>
					<Trash2 class="mr-2 inline h-4 w-4" />{m.button_delete()}
				</AlertDialog.Trigger>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{m.are_you_sure()}</AlertDialog.Title>
			<AlertDialog.Description>
				{m.user_delete_warning()}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{m.cancel()}</AlertDialog.Cancel>
			<form action="/users?/delete" method="POST" use:enhance>
				<input hidden value={$formData.id} name="id" />
				<AlertDialog.Action
					type="submit"
					class={buttonVariants({ variant: 'destructive' })}
				>
					<Trash2 />
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
