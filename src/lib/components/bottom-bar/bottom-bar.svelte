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

<div class="sm:hidden fixed bottom-0 z-50 w-full h-16 bg-white shadow-md dark:bg-gray-800 drop-shadow border-t-2">
    <div class="max-w-screen-lg mx-auto flex items-center justify-between h-full px-4">
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
</div>
