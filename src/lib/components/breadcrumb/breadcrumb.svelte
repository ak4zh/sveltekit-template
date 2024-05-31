<script lang="ts">
	import { page } from "$app/stores";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

    function generateBreadcrumbs(path: string) {
        const segments = path.split("/").slice(1);
        const breadcrumbs = segments.map((segment, index) => {
            const url = `/${segments.slice(0, index + 1).join("/")}`;
            const text = segment.charAt(0).toUpperCase() + segment.slice(1);
            return { url, text };
        });
        return breadcrumbs;
    };

    const breadcrumbs = $derived(generateBreadcrumbs($page.url.pathname));
</script>

<Breadcrumb.Root>
    <Breadcrumb.List>
        {#each breadcrumbs as breadcrumb, i}
            <Breadcrumb.Item>
                {#if breadcrumb.url === $page.url.pathname}
                    <Breadcrumb.Page>{breadcrumb.text}</Breadcrumb.Page>
                {:else}
                    <Breadcrumb.Link href="{breadcrumb.url}">{breadcrumb.text}</Breadcrumb.Link>
                {/if}
            </Breadcrumb.Item>
            {#if i+1 < breadcrumbs.length}
                 <Breadcrumb.Separator />
            {/if}
        {/each}
    </Breadcrumb.List>
</Breadcrumb.Root>
