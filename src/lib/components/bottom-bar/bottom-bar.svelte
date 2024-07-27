<script lang="ts">
	import { page } from "$app/stores";
    import { Button } from "$lib/components/ui/button"
	import { HomeIcon, PlusIcon, BracesIcon, UserIcon } from "lucide-svelte";

    function currentPageClasses(path: string) {
        return $page.url.pathname === path
        ? 'link'
        : 'ghost'
    }
</script>

<div class="flex items-center justify-between">
    <a
        href="/"
        class="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-300"
    >
        <Button variant="{currentPageClasses('/')}" size="icon">
        <HomeIcon class="w-6 h-6" />
        </Button>
        <span class="text-xs mt-1">Home</span>
    </a>
    <a
        href="/profile"
        class="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-300"
    >
        <Button variant="{currentPageClasses('/profile')}" size="icon">
        <UserIcon class="w-6 h-6" />
        </Button>
        <span class="text-xs mt-1">Profile</span>
    </a>
</div>
