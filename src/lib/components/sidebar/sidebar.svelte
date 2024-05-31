<script lang="ts">
	import { User, UsersRound, Settings, Package2 } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
    import { page } from '$app/stores';
    import * as m from '$paraglide/messages.js';

    function currentPage(path: string) { 
        return $page.url.pathname === path 
            ? 'group bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground' 
    };

    const items = [
        {
            title: m.profile(),
            path: '/profile',
            icon: User,
        },
        {
            title: m.users(),
            path: '/users',
            icon: UsersRound,
        },
    ]
</script>

<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
		<a
			href="##"
			class="button group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
		>
			<Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
			<span class="sr-only">Acme Inc</span>
		</a>
        {#each items as item}
            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder>
                    <a
                        href="{item.path}"
                        class="{currentPage(item.path)} transition-colors flex h-9 w-9 items-center justify-center rounded-lg md:h-8 md:w-8"
                        use:builder.action
                        {...builder}
                    >
                        <svelte:component this={item.icon} class="h-5 w-5 group-hover:scale-110" />
                        <span class="sr-only">{item.title}</span>
                    </a>
                </Tooltip.Trigger>
                <Tooltip.Content side="right">{item.title}</Tooltip.Content>
            </Tooltip.Root>
        {/each}
	</nav>
	<nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<a
					href="##"
					class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
					use:builder.action
					{...builder}
				>
					<Settings class="h-5 w-5" />
					<span class="sr-only">Settings</span>
				</a>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Settings</Tooltip.Content>
		</Tooltip.Root>
	</nav>
</aside>
