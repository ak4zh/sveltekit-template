<script lang="ts">
	import ProfileUpdateForm from '$lib/forms/ProfileUpdateForm.svelte';
	import PasswordUpdateForm from '$lib/forms/PasswordUpdateForm.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as m from '$paraglide/messages.js';

	export let data;
</script>

<div class="mx-auto flex max-w-lg flex-col items-center gap-8 py-8">
	<Tabs.Root value="account" class="w-[400px]">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="account">{m.account()}</Tabs.Trigger>
			<Tabs.Trigger value="password">{m.password()}</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="account">
			<ProfileUpdateForm data={data.form} action="/profile?/account" />
		</Tabs.Content>
		<Tabs.Content value="password">
			<PasswordUpdateForm data={data.passwordUpdateForm} action="/profile?/password" />
		</Tabs.Content>
	</Tabs.Root>
</div>
