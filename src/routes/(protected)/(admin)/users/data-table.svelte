<script lang="ts">
    import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
    import { addSortBy, addTableFilter, addColumnFilters } from "svelte-headless-table/plugins";
    import { queryParam, ssp } from 'sveltekit-search-params';
    import { writable, type Writable } from "svelte/store";
    import * as Table from "$lib/components/ui/table";
    import DataTableActions from "./data-table-actions.svelte";
    import type { UserDeleteSchema } from '$lib/forms/schemas';
	  import { type SuperValidated, type Infer } from 'sveltekit-superforms';
    import { page } from '$app/stores';
    import * as Pagination from "$lib/components/ui/pagination";
	  import type { User } from "lucia";
    import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-svelte";
    import { Button } from '$lib/components/ui/button';
    import { Input } from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select/index.js";

    let { deleteForm } : { deleteForm: SuperValidated<Infer<UserDeleteSchema>> } = $props();
    let users: Writable<User[]> = writable($page.data.users || []);
    let count = writable($page.data.count);
    let table = createTable(users, { 
      sort: addSortBy({ serverSide: true }),
      colFilter: addColumnFilters({ serverSide: true }),
      filter: addTableFilter({
        serverSide: true,
        fn: ({ filterValue, value }) =>
          value.toLowerCase().includes(filterValue.toLowerCase()),
      }),
    });
    const columns = table.createColumns([
        table.column({
            accessor: "name",
            header: "Name",
            plugins: {
              sort: {
                disable: false,
              }
            },
        }),
        table.column({
            accessor: "email",
            header: "Email",
            plugins: {
              sort: {
                disable: false,
              },
            },
        }),
        table.column({
            accessor: "role",
            header: "Role",
            plugins: {
              sort: {
                disable: false,
              },
            },
        }),
        table.column({
            accessor: ({ id }) => id,
            header: "",
            cell: ({ value }) => {
              return createRender(DataTableActions, { id: value, deleteForm });
            },
            plugins: {
              sort: {
                disable: true,
              },
              filter: {
                exclude: true,
              },
            },
        }),
    ]);
    const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =  table.createViewModel(columns);
    const { sortKeys } = pluginStates.sort;
    const { filterValue } = pluginStates.filter;
    const { filterValues } = pluginStates.colFilter;
    
    const sspPage = queryParam('page', ssp.number(1), { showDefaults: false });
    const sspLimit = queryParam('limit', ssp.number(10), { showDefaults: false });
    const sspSortBy = queryParam('sort', ssp.string());
    const sspSortOrder = queryParam('order', ssp.string());
    const sspSearch = queryParam('search', ssp.string(), { debounceHistory: 500 });
    const sspName = queryParam('name', ssp.string(), { debounceHistory: 500 });
    const sspEmail = queryParam('email', ssp.string(), { debounceHistory: 500 });
    const sspRole = queryParam('role', ssp.string());

    $effect(() => {
      users.set($page.data.users || []);
      count.set($page.data.count);
    });

    $effect(() => {
      // sspSearch.set($filterValue || null);
      sspName.set($filterValues.name as string || null);
      sspEmail.set($filterValues.email as string || null);
      sspSortBy.set($sortKeys?.[0]?.id || null);
      sspSortOrder.set($sortKeys?.[0]?.order || null);
      sspRole.set($filterValues.role?.value || null);
      sspLimit.set($filterValues.limit?.value || null);
    })
</script>

<div>
  <div class="rounded-md border">
      <Table.Root {...$tableAttrs}>
        <Table.Header>
          {#each $headerRows as headerRow}
            <Subscribe rowAttrs={headerRow.attrs()}>
              <Table.Row>
                {#each headerRow.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                    <Table.Head {...attrs}>
                        {#if props.sort.disabled}
                          <Render of={cell.render()} />
                        {:else}
                          <Button variant="ghost" on:click={(e) => props.sort.toggle(e)}>
                            <Render of={cell.render()} />
                            {#if props.sort.order === 'asc'}
                              <ArrowUp class={"ml-2 h-4 w-4"} />
                            {:else if props.sort.order === 'desc'}
                              <ArrowDown class={"ml-2 h-4 w-4"} />
                            {:else}
                              <ArrowUpDown class={"ml-2 h-4 w-4"} />
                            {/if}
                          </Button>
                          {#if cell.id === 'role'}
                            <div class="flex items-center py-4">
                              <Select.Root bind:selected={$filterValues.role}>
                                <Select.Trigger class="w-[180px]">
                                  <Select.Value placeholder="Select a role" />
                                </Select.Trigger>
                                <Select.Content>
                                  <Select.Group>
                                    <Select.Item value="" label="">-</Select.Item>
                                    <Select.Item value="user" label="USER">USER</Select.Item>
                                    <Select.Item value="admin" label="ADMIN">ADMIN</Select.Item>
                                  </Select.Group>
                                </Select.Content>
                                <Select.Input name="role" bind:value={$filterValues[cell.id]} />
                              </Select.Root>
                            </div>
                          {:else}
                            <div class="flex items-center py-4">
                              <Input
                                class="max-w-sm"
                                placeholder="Search..."
                                type="text"
                                bind:value={$filterValues[cell.id]}
                              />
                            </div>
                          {/if}
                        {/if}

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
  <div class="flex flex-col-reverse md:flex-row md:justify-between items-center gap-4 py-4">
    <div>
      <Select.Root bind:selected={$filterValues.limit}>
        <Select.Trigger class="w-[180px]">
          <Select.Value placeholder="users per page" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="" label="">-</Select.Item>
            <Select.Item value="5" label="5 users per page">5 users per page</Select.Item>
            <Select.Item value="10" label="10 users per page">10 users per page</Select.Item>
            <Select.Item value="25" label="25 users per page">25 users per page</Select.Item>
            <Select.Item value="50" label="50 users per page">50 users per page</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>  
    </div>
    <div>
      <Pagination.Root
        class="mx-auto w-auto flex-row"
        count={$count}
        page={$sspPage}
        perPage={$sspLimit}
        onPageChange={page => ($sspPage = page)}
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
</div>
