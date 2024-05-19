<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Dialog from "$lib/components/ui/dialog/index.js";
	import UserUpdateForm from '$lib/forms/UserUpdateForm.svelte';
	import { Loader2, Pencil } from 'lucide-svelte';
	import { writable } from 'svelte/store';
    import * as Sheet from "$lib/components/ui/sheet/index.js";

    let { data } = $props();
    let dialogOpen = writable(false);
    let sheetOpen = writable(false);
    let disabled = writable(false);
</script>


<div class="hidden md:block">
    <Dialog.Root bind:open={$dialogOpen}>
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
                <UserUpdateForm {data} {disabled} {dialogOpen} {sheetOpen} />
            <Dialog.Footer>
                <Button type="submit" form="edit-${data.id}" disabled={$disabled}>
                    {#if $disabled}
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Please wait
                    {:else}
                        Save changes
                    {/if}
                </Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>    
</div>
<div class="md:hidden">
    <Sheet.Root bind:open={$sheetOpen}>
        <Sheet.Trigger asChild let:builder>
            <Button
                variant="ghost"
                builders={[builder]}
                size="icon"
                class="relative h-8 w-8 p-0"
            >
                <span class="sr-only">Edit user</span>
                <Pencil class="h-4 w-4" />
            </Button>
        </Sheet.Trigger>
        <Sheet.Content side="bottom">
            <Sheet.Header>
            <Sheet.Title>Edit user</Sheet.Title>
            <Sheet.Description>
                Make changes to your user here. Click save when you're done.
            </Sheet.Description>
            </Sheet.Header>
            <UserUpdateForm {data} {disabled} {dialogOpen} {sheetOpen} />
            <Sheet.Footer class="py-4">
            <Sheet.Close asChild let:builder >
                <Button builders={[builder]} type="submit" form="edit-${data.id}" disabled={$disabled}>
                    {#if $disabled}
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Please wait
                    {:else}
                        Save changes
                    {/if}
                </Button>
            </Sheet.Close>
            </Sheet.Footer>
        </Sheet.Content>
    </Sheet.Root> 
</div>    

