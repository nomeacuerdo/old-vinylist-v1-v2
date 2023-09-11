<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	// import type { SourceData, SortByTypes, SortFunctionTypes } from "../types";
	// export let loading: boolean;
	// export let source: SourceData;
	// export let handleSort: SortFunctionTypes;
	// export let sortable: boolean;
	export let loading;
	export let source;
	export let handleSort;
	export let sortable;

	// Row click Event handling
	const dispatch = createEventDispatcher();
	// const onRowClick = (event: MouseEvent, rowIndex: number) => {
	const onRowClick = (event, rowIndex) => {
		event.preventDefault();
		event.stopPropagation();
		const rowMetaData = source.meta ? source.meta[rowIndex] : source.body[rowIndex];
		dispatch("selected", rowMetaData);
	}

	// Header sorting handling
	// let sortBy: SortByTypes = {col: "artist", sort_order: "asc"};
	let sortBy = {col: "artist", sort_order: "asc"};

	// $: classesActive = (sorted: string) => (sorted === sortBy.col ? 'btn bg-gradient-to-br variant-gradient-warning-error' : 'btn variant-soft');
	$: classesActive = (sorted) => (sorted === sortBy.col ? 'btn bg-gradient-to-br variant-gradient-warning-error' : 'btn variant-soft');
	// $: sort = (event: MouseEvent, column: string | undefined) => {
	$: sort = (event, column) => {
		loading = true;
		event.stopPropagation();
		if (sortBy.col == column) {
			sortBy.sort_order = sortBy.sort_order === "desc" ? "asc" : "desc";
		} else {
			sortBy.col = column;
			sortBy.sort_order = "asc";
		}
		
		handleSort(sortBy);
	}
</script>

<div class="table-container">
	<table class="table table-interactive">
		<thead class="table-head">
			<tr>
				{#each source.head as cell}
					<th>
						{#if cell.field && cell.title && sortable}
							<button type="button" class="{classesActive(cell.field)}" on:click={(e) => { sort(e, cell.field); }}>
								{#if sortBy.col === cell.field && sortBy.sort_order === "desc"}
									<span><i class="fa-solid fa-circle-up"></i></span>
								{:else if sortBy.col === cell.field && sortBy.sort_order === "asc"}
									<span><i class="fa-solid fa-circle-down"></i></span>
								{/if}
								<span>{@html cell.title ? cell.title : '-'}</span>
							</button>
						{:else if (!cell.field && cell.title) || !sortable}
							<span>{@html cell.title || ''}</span>
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="table-body">
			{#if loading}
				<tr aria-rowindex={1}>
					<td role="gridcell" aria-colindex={1} tabindex=0 colspan={source.head.length}>
						<ProgressRadial class="mx-auto my-4" stroke={400} meter="stroke-warning-500" track="stroke-warning-500/30" />
					</td>
				</tr>
			{:else}
				{#each source.body as row, rowIndex}
					<tr on:click={(e) => { onRowClick(e, rowIndex); }} aria-rowindex={rowIndex + 1}>
						{#each row as cell, cellIndex}
							<td role="gridcell" aria-colindex={cellIndex + 1} tabindex={cellIndex === 0 ? 0 : -1}>
								{@html cell ? cell : '-'}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>