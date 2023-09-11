<script lang="ts">
  /** @type {import('./$types').PageData} */
  import {
    URL,
    USERNAME,
    AUTH_KEY,
    AUTH_SECRET,
    AUTH_TOKEN,
  } from '../../../constants';
  import { tableDataFormatter } from '$lib/utils/utils';
  import RecordTable from '$lib/RecordTable.svelte';
  import { getModalStore, Paginator, tableMapperValues } from '@skeletonlabs/skeleton';
  // import type { ModalSettings, PaginationSettings } from '@skeletonlabs/skeleton';
  // import type { SourceData, SortFunctionTypes, SortByTypes } from "../../../types";
  export let data;

  const formattedData = data.collectionData.releases.map(tableDataFormatter);
  const id = data.id;
  let page = 1;
  let per_page = 50;
  // let sort_by: SortByTypes = { col: 'artist', sort_order: 'asc' };
  let sort_by = { col: 'artist', sort_order: 'asc' };
  // let loading: boolean = formattedData.length === 0;
  let loading = formattedData.length === 0;

  // export let tableData: SourceData = {
  export let tableData = {
    head: [
      { field: 'cover' },
      { field: "title", title: "Name" },
      { field: "artist", title: "Artist" },
      { title: "Year" },
      { title: "Acquired" },
    ],
    body: tableMapperValues(formattedData, ['cover', 'name', 'artist', 'released', 'acquired']),
    meta: tableMapperValues(formattedData, ['id', 'artist', 'name', 'image', 'cover']),
  };
  
  // const handleRowClick = (e: CustomEvent) => {
  const handleRowClick = (e) => {
    const modalStore = getModalStore();
    // const modal: ModalSettings = {
    const modal = {
      type: 'alert',
      title: `${e.detail[1]} - ${e.detail[2]}`,
      buttonTextCancel: 'Close',
      image: e.detail[3],
    };
    modalStore.trigger(modal);
  };

  let paginationSettings = {
    page: page - 1,
    limit: per_page,
    size: data.collectionData.pagination.items,
    amounts: [10,25,50],
  };
  //} satisfies PaginationSettings;

  const fetchData = () => fetch(`${URL}/users/${USERNAME}/collection/folders/${id}/releases?sort=${sort_by.col}&sort_order=${sort_by.sort_order}&per_page=${per_page}&page=${page}`, {
    method: 'GET',
    headers: {
      Authorization: `Discogs key=${AUTH_KEY}, secret=${AUTH_SECRET}, token=${AUTH_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
    }
  });

  // const handlePagination = async (e: CustomEvent) => {
  const handlePagination = async (e) => {
    loading = true;
    page = e.detail + 1;
    const collectionRes = await fetchData();
    const fetchedData = await collectionRes.json();
    const readyData = fetchedData.releases.map(tableDataFormatter);
    tableData.body = tableMapperValues(readyData, ['cover', 'name', 'artist', 'released', 'acquired']);
    tableData.meta = tableMapperValues(readyData, ['id', 'artist', 'name', 'image', 'cover']);
    paginationSettings.page = fetchedData.pagination.page - 1;
    loading = false;
  };

  // const handleAmount = async (e: CustomEvent) => {
  const handleAmount = async (e) => {
    loading = true;
    per_page = e.detail;
    const collectionRes = await fetchData();
    const fetchedData = await collectionRes.json();
    const readyData = fetchedData.releases.map(tableDataFormatter);
    tableData.body = tableMapperValues(readyData, ['cover', 'name', 'artist', 'released', 'acquired']);
    tableData.meta = tableMapperValues(readyData, ['id', 'artist', 'name', 'image', 'cover']);
    paginationSettings.limit = per_page;
    loading = false;
  };

  // const handleSort: SortFunctionTypes = async (sortBy: SortByTypes) => {
  const handleSort = async (sortBy) => {
    loading = true;
    sort_by = sortBy;
    page = 1;
    const collectionRes = await fetchData();
    const fetchedData = await collectionRes.json();
    const readyData = fetchedData.releases.map(tableDataFormatter);
    tableData.body = tableMapperValues(readyData, ['cover', 'name', 'artist', 'released', 'acquired']);
    tableData.meta = tableMapperValues(readyData, ['id', 'artist', 'name', 'image', 'cover']);
    loading = false;
  };
</script>

<div class="container mx-auto p-8 space-y-8">
  <RecordTable
    source={tableData}
    on:selected={handleRowClick}
    handleSort={handleSort}
    loading={loading}
    sortable
  />
  <Paginator
    bind:settings={paginationSettings}
    on:page={handlePagination}
    on:amount={handleAmount}
    showFirstLastButtons="{false}"
    showPreviousNextButtons
    showNumerals
    maxNumerals={1}
    controlVariant="variant-glass-surface"
    active="variant-ghost-warning"
  />
</div>

<svelte:head>
  <title>Folder Contents</title>
</svelte:head>