<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from "$lib/components/ui/input";
	import * as Card from '$lib/components/ui/card';
	import { Loader2 } from 'lucide-svelte';
	import { userUpdateSchema, type UserUpdateSchema } from './schemas';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from "$app/environment";
    import * as Avatar from "$lib/components/ui/avatar/index.js";

    const { data } : { data: SuperValidated<Infer<UserUpdateSchema>> | undefined } = $props();
	const form = superForm(data, {
        validators: zodClient(userUpdateSchema),
        resetForm: false
    })
	const { form: formData, enhance, submitting, delayed, tainted } = form;
</script>

<form use:enhance method="POST" class="w-fit">
    <Card.Root>
        <Card.Header class="space-y-1">
            <Card.Header class="space-y-1">
                <div class="mx-auto">
                    <Avatar.Root class="w-16 h-16 text-2xl">
                        <Avatar.Fallback>{$formData.name.slice(0, 2)?.toUpperCase()}</Avatar.Fallback>
                    </Avatar.Root>    
                </div>
				<Card.Title class="text-2xl">Profile</Card.Title>
				<Card.Description>Update your profile settings below.</Card.Description>
			</Card.Header>
        </Card.Header>
        <Card.Content class="grid gap-4">
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
        </Card.Content>
        <Card.Footer>
            <div class="block w-full">
                <Form.Button class="w-full" disabled={!$tainted || $submitting || $delayed}
                    >{#if $submitting || $delayed}
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                        Please wait{:else}Update{/if}
                </Form.Button>
            </div>
        </Card.Footer>
    </Card.Root>
</form>
<div class="w-full">
    {#if browser}
        <SuperDebug data={$formData} />
    {/if}
</div>
