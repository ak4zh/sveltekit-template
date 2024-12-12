<script lang="ts">
	import { HomeIcon, FileIcon, CogIcon } from 'lucide-svelte';
	import { page } from '$app/stores';
	import Button from '../ui/button/button.svelte';

	function currentPage(path: string) {
		return $page.url.pathname === path
			? 'group bg-muted text-primary'
			: 'text-muted-foreground hover:text-primary';
	}

	const items = [
		{
			title: 'Dashboard',
			path: '/dashboard',
			icon: HomeIcon
		},
		{
			title: 'Profile',
			path: '/profile',
			icon: FileIcon
		},
	];
</script>


<div class="grid grid-rows-[auto_1fr_auto] gap-4 h-svh">
	<div class="flex flex-col justify-center items-center items-center">
		<!-- <div class="bg-primary p-2 rounded-full">
			<img class="w-8 h-8" src="/logo-white.svg" alt="{$page.data.userOrgs.find(o => o.id === $page.data.user.orgId)?.name}"/>
		</div>
		<p class="text-sm font-bold border-b px-4 py-2 md:hidden">
			{$page.data.userOrgs.find(o => o.id === $page.data.user.orgId)?.name}
		</p> -->
	</div>
    <nav class="text-sm font-medium">
        <ul>
            {#each items as item}
                <li>
                    <a
                        href={item.path}
                        class="flex items-center gap-2 rounded-lg px-3 py-2 transition-all {currentPage(item.path)}"
                    >
                        <item.icon class="h-4 w-4" />
                        {item.title}
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
	<div class="mx-auto">
		<div class="flex gap-4 flex-col">
			<Button href="/orgs" class="text-xs" size="sm">
				<CogIcon class="mr-2 w-4 h-4" />
                Manage Organizations
			</Button>
		</div>
	</div>
</div>
