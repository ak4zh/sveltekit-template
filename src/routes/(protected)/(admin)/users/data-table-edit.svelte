<script lang="ts">
    import { Button, buttonVariants } from '$lib/components/ui/button';
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Form from '$lib/components/ui/form';
	import { Input } from "$lib/components/ui/input";
	import { Loader2, Pencil } from 'lucide-svelte';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from "$app/environment";
    import { userUpdateByAdminSchema, type UserUpdateByAdminSchema } from '$lib/forms/schemas';
    import * as Select from "$lib/components/ui/select/index.js";

    let { data } = $props();
    let open = $state(false);
	const form = superForm(data, {
		validators: zodClient(userUpdateByAdminSchema),
        resetForm: false,
        onResult({ result }) {
            if (result.type === 'success') open = false;
        }
	});
	const { form: formData, enhance, submitting, delayed } = form;
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger asChild let:builder>
        <Button
            variant="ghost"
            builders={[builder]}
            size="icon"
            class="relative h-8 w-8 p-0"
            >
            <span class="sr-only">Edit user</span>
            <Pencil class="h-4 w-4" />
        </Button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Edit user</Dialog.Title>
            <Dialog.Description>
                Make changes to your user here. Click save when you're done.
            </Dialog.Description>
        </Dialog.Header>            
        <form use:enhance method="POST" action="?/update" id="edit-${$formData.id}">
            <input hidden name="id" value={$formData.id} />
            <Form.Field {form} name="role">
                <Form.Control>
                    <Form.Label>Role</Form.Label>
                    <Select.Root onSelectedChange={(e) => $formData.role = e?.value} selected={{'label': $formData.role, 'value': $formData.role}}>
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
        <Dialog.Footer>
            <Button type="submit" form="edit-${$formData.id}" disabled={$submitting || $delayed}>
                {#if $submitting || $delayed}
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Please wait
                {:else}
                    Save changes
                {/if}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
