<script lang="ts">
    import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
    import { queryParam, ssp } from 'sveltekit-search-params';

    import { writable } from "svelte/store";
    import * as Table from "$lib/components/ui/table";
    import DataTableActions from "./data-table-actions.svelte";
    import type { UserDeleteSchema } from '$lib/forms/schemas';
	  import { type SuperValidated, type Infer } from 'sveltekit-superforms';
    import { page } from '$app/stores';
    import * as Pagination from "$lib/components/ui/pagination";

    let { deleteForm } : { deleteForm: SuperValidated<Infer<UserDeleteSchema>> } = $props();
    let users = writable($page.data.users || []);
    let total = writable($page.data.total || 1);
    $effect(() => {
      users.set($page.data.users || []);
      total.set($page.data.total || 1);
    });
    
    let table = createTable(users);
    const columns = table.createColumns([
        table.column({
            accessor: "id",
            header: "ID",
        }),
        table.column({
            accessor: "name",
            header: "Name",
        }),
        table.column({
            accessor: "email",
            header: "Email",
        }),
        table.column({
            accessor: "role",
            header: "Role",
        }),
        table.column({
            accessor: ({ id }) => id,
            header: "",
            cell: ({ value }) => {
              return createRender(DataTableActions, { id: value, deleteForm });
            },
        }),
    ]);
    const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =  table.createViewModel(columns);
    const pageNum = queryParam('page', ssp.number(1), { showDefaults: false });
    
</script>

<div>
  <div class="rounded-md border">
      <Table.Root {...$tableAttrs}>
        <Table.Header>
          {#each $headerRows as headerRow}
            <Subscribe rowAttrs={headerRow.attrs()}>
              <Table.Row>
                {#each headerRow.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                    <Table.Head {...attrs}>
                      <Render of={cell.render()} />
                    </Table.Head>
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        </Table.Header>
        <Table.Body {...$tableBodyAttrs}>
          {#each $pageRows as row (row.id)}
            <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
              <Table.Row {...rowAttrs}>
                {#each row.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs>
                    <Table.Cell {...attrs}>
                      <Render of={cell.render()} />
                    </Table.Cell>
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        </Table.Body>
      </Table.Root>
  </div>
  <div class="flex items-center justify-end space-x-4 py-4">
    <Pagination.Root
    class="mx-auto w-auto flex-row"
    count={$total}
    page={$pageNum}
    perPage={10}
    onPageChange={page => ($pageNum = page)}
    let:pages
    let:currentPage
  >
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.PrevButton>
        </Pagination.PrevButton>
      </Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item>
        <Pagination.NextButton />
      </Pagination.Item>
    </Pagination.Content>
  </Pagination.Root>
  </div>
</div>
