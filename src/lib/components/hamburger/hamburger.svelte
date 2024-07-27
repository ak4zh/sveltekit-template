<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    import { MenuIcon } from 'lucide-svelte';
	import Sidebar from "../sidebar/sidebar.svelte";
	import { afterNavigate } from "$app/navigation";
    let open = $state(false);

    afterNavigate(() => open = false )
  </script>
   
<Sheet.Root bind:open openFocus={"#nav-items"}>
    <Sheet.Trigger asChild let:builder>
        <Button variant="outline" size="icon" builders={[builder]}>
            <MenuIcon class="w-4 h-4" />
        </Button>
    </Sheet.Trigger>
    <Sheet.Content side="left" class="overflow-auto w-64" id="nav-items">
        <!-- <div> -->
            <Sidebar />
        <!-- </div> -->
    </Sheet.Content>
</Sheet.Root>
