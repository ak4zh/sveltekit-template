<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { addSortBy, addTableFilter, addColumnFilters } from 'svelte-headless-table/plugins';
	import { queryParameters, queryParam, ssp } from 'sveltekit-search-params';
	import { writable, type Writable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { page } from '$app/stores';
	import * as Pagination from '$lib/components/ui/pagination';
	import type { User } from 'lucia';
	import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select/index.js';
	import DataTableActionsCell from './data-table-actions-cell.svelte';
	import * as m from "$paraglide/messages.js"

	const queryStore = queryParameters({
		page: ssp.number(),
		limit: ssp.number(),
		sort: ssp.string(),
		order: ssp.string(),
		name: ssp.string(),
		email: ssp.string(),
		role: ssp.string()
	});
	const sspPage = queryParam('page', ssp.number(1), { showDefaults: false });
	const sspLimit = queryParam('limit', ssp.number(10), { showDefaults: false });
	const sspSortBy = queryParam('sort', ssp.string());
	const sspSortOrder = queryParam('order', ssp.string()) as Writable<'asc' | 'desc' | null>;
	const sspName = queryParam('name', ssp.string(), { debounceHistory: 500 });
	const sspEmail = queryParam('email', ssp.string(), { debounceHistory: 500 });
	const sspRole = queryParam('role', ssp.string());

	let users: Writable<User[]> = writable($page.data.users || []);
	let count = writable($page.data.count);
	let table = createTable(users, {
		sort: addSortBy({
			serverSide: true,
			initialSortKeys:
				$sspSortBy && $sspSortOrder ? [{ id: $sspSortBy, order: $sspSortOrder }] : []
		}),
		colFilter: addColumnFilters({
			serverSide: true
		}),
		filter: addTableFilter({
			serverSide: true,
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'name',
			header: m.name(),
			plugins: {
				sort: {
					disable: false
				},
				colFilter: {
					initialFilterValue: $queryStore.name
				}
			}
		}),
		table.column({
			accessor: 'email',
			header: m.email(),
			plugins: {
				sort: {
					disable: false
				},
				colFilter: {
					initialFilterValue: $queryStore.email
				}
			}
		}),
		table.column({
			accessor: 'role',
			header: m.role(),
			plugins: {
				sort: {
					disable: false
				},
				colFilter: {
					initialFilterValue: $queryStore.role
						? { label: $queryStore.role.toUpperCase(), value: $queryStore.role.toLowerCase() }
						: undefined
				}
			}
		}),
		table.column({
			accessor: (user) => user,
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActionsCell, {
					referralCode: value.referralCode,
					updateFormData: value,
					deleteFormData: { id: value.id }
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { sortKeys } = pluginStates.sort;
	const { filterValues } = pluginStates.colFilter;

	$effect(() => {
		users.set($page.data.users || []);
		count.set($page.data.count);
	});

	$effect(() => {
		sspName.set(($filterValues.name as string) || null);
		sspEmail.set(($filterValues.email as string) || null);
		sspSortBy.set($sortKeys?.[0]?.id || null);
		sspSortOrder.set($sortKeys?.[0]?.order || null);
		sspRole.set($filterValues.role?.value || null);
		sspLimit.set($filterValues.limit?.value || null);
	});
</script>

<div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe
									attrs={cell.attrs()}
									let:attrs
									props={cell.props()}
									let:props
								>
									<Table.Head {...attrs}>
										{#if props.sort.disabled}
											<Render of={cell.render()} />
										{:else}
											<Button
												variant="ghost"
												on:click={(e) => props.sort.toggle(e)}
											>
												<Render of={cell.render()} />
												{#if props.sort.order === 'asc'}
													<ArrowUp class={'ml-2 h-4 w-4'} />
												{:else if props.sort.order === 'desc'}
													<ArrowDown class={'ml-2 h-4 w-4'} />
												{:else}
													<ArrowUpDown class={'ml-2 h-4 w-4'} />
												{/if}
											</Button>
											{#if cell.id === 'role'}
												<div class="flex items-center py-4">
													<Select.Root bind:selected={$filterValues.role}>
														<Select.Trigger class="w-[180px]">
															<Select.Value
																placeholder="{m.select_role()}"
															/>
														</Select.Trigger>
														<Select.Content>
															<Select.Group>
																<Select.Item value="" label=""
																	>-</Select.Item
																>
																<Select.Item
																	value="user"
																	label="USER">USER</Select.Item
																>
																<Select.Item
																	value="admin"
																	label="ADMIN">ADMIN</Select.Item
																>
															</Select.Group>
														</Select.Content>
														<Select.Input
															name="role"
															bind:value={$filterValues[cell.id]}
														/>
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
	<div class="flex flex-col-reverse items-center gap-4 py-4 md:flex-row md:justify-between">
		<div>
			<Select.Root bind:selected={$filterValues.limit}>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder={m.users_per_page({ count: ""})} />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Item value="" label="">-</Select.Item>
						{#each [5, 10, 25, 50] as userCount}
							<Select.Item value="{userCount}" label="{m.users_per_page({ count: userCount })}"
								>{m.users_per_page({ count: userCount })}</Select.Item
							>
						{/each}
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
				onPageChange={(page) => ($sspPage = page)}
				let:pages
				let:currentPage
			>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton></Pagination.PrevButton>
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
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
