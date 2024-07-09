<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { type Icon, Loader2, Pencil } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as m from '$paraglide/messages.js';
	import type { Component } from 'svelte';

	let { 
		data, 
		title,
		description,
		triggerVariant,
		triggerSize,
		triggerText,
		form
	 }: {
		form: Component<any>
		title: string;
		description: string | undefined;
		data: any;
		triggerVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | undefined,
		triggerSize: "default" | "sm" | "lg" | "icon" | undefined,
		triggerText: string
	 } = $props();
	let dialogOpen = writable(false);
	let sheetOpen = writable(false);
	let disabled = writable(false);
</script>

<div class="hidden md:block">
	<Dialog.Root bind:open={$dialogOpen}>
		<Dialog.Trigger asChild let:builder>
			<Button variant={triggerVariant} builders={[builder]} size={triggerSize}>
				{#if triggerSize === 'icon'}
					<span class="sr-only">{triggerText}</span>
					<Pencil class="h-4 w-4" />
				{:else}
					{triggerText}
				{/if}
			</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{title}</Dialog.Title>
				<Dialog.Description>
					{description}
				</Dialog.Description>
			</Dialog.Header>
				<svelte:component this={form} {data} {disabled} {dialogOpen} {sheetOpen}/>
			<Dialog.Footer>
				<Button type="submit" form="edit-{data.id}" disabled={$disabled}>
					{#if $disabled}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" /> {m.please_wait()}
					{:else}
						{m.save_changes()}
					{/if}
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
<div class="md:hidden">
	<Sheet.Root bind:open={$sheetOpen}>
		<Sheet.Trigger asChild let:builder>
			<Button variant={triggerVariant}  builders={[builder]} size={triggerSize}>
				{#if triggerSize === 'icon'}
					<span class="sr-only">{triggerText}</span>
					<Pencil class="h-4 w-4" />
				{:else}
					{triggerText}
				{/if}
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="right">
			<Sheet.Header>
				<Sheet.Title>{title}</Sheet.Title>
				<Sheet.Description>
					{description}
				</Sheet.Description>
			</Sheet.Header>
				<svelte:component this={form} {data} {disabled} {dialogOpen} {sheetOpen}/>
			<Sheet.Footer class="py-4">
				<Sheet.Close asChild let:builder>
					<Button
						type="submit"
						form="edit-{data.id}"
						disabled={$disabled}
					>
						{#if $disabled}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />{m.please_wait()}
						{:else}
							{m.save_changes()}
						{/if}
					</Button>
				</Sheet.Close>
			</Sheet.Footer>
		</Sheet.Content>
	</Sheet.Root>
</div>
