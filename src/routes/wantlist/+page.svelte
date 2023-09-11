<script lang="ts">
  /** @type {import('./$types').PageData} */
  import {
    URL,
    USERNAME,
    AUTH_KEY,
    AUTH_SECRET,
    AUTH_TOKEN,
  } from '../../constants';
  import { wishlistDataFormatter } from '$lib/utils/utils';
  import RecordTable from '$lib/RecordTable.svelte';
  import { getModalStore, Paginator, tableMapperValues } from '@skeletonlabs/skeleton';
  // import type { ModalSettings, PaginationSettings } from '@skeletonlabs/skeleton';
  // import type { SourceData, SortFunctionTypes } from "../../types";

  export let data;

  let page = 1;
  let per_page = 100;
  // let loading: boolean = !data;
  let loading = !data;

  // export let tableData: SourceData = {
  export let tableData = {
    head: [
      { field: 'number' },
      { field: 'cover' },
      { field: "title", title: "Name" },
      { field: "artist", title: "Artist" },
    ],
    body: [],
    meta: [],
  };

  let paginationSettings = {
    page: page - 1,
    limit: per_page,
    size: 0,
    amounts: [10,25,50,100],
  };
//  } satisfies PaginationSettings;

  if (data) {
    // const formattedData = data?.wants?.map((item: any, i: number) => wishlistDataFormatter(item, ((page - 1) * per_page), i));
    const formattedData = data?.wants?.map((item, i) => wishlistDataFormatter(item, ((page - 1) * per_page), i));

    tableData.body = tableMapperValues(formattedData, ['number', 'cover', 'name', 'artist']);
    tableData.meta = tableMapperValues(formattedData, ['id', 'artist', 'name', 'image', 'cover']);
    paginationSettings.size = data?.pagination?.items;
  }

  const fetchData = () => fetch(`${URL}/users/${USERNAME}/wants?per_page=${per_page}&page=${page}`, {
    method: 'GET',
    headers: {
      Authorization: `Discogs key=${AUTH_KEY}, secret=${AUTH_SECRET}, token=${AUTH_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
      'Content-Type': "application/x-www-form-urlencoded",
    }
  });

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

  // const handlePagination = async (e: CustomEvent) => {
  const handlePagination = async (e) => {
    loading = true;
    page = e.detail + 1;
    const collectionRes = await fetchData();
    const fetchedData = await collectionRes.json();
    // const readyData = fetchedData.wants.map((item: any, i: number) => wishlistDataFormatter(item, ((page - 1) * per_page), i));
    const readyData = fetchedData.wants.map((item, i) => wishlistDataFormatter(item, ((page - 1) * per_page), i));
    tableData.body = tableMapperValues(readyData, ['number', 'cover', 'name', 'artist']);
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
    // const readyData = fetchedData.wants.map((item: any, i: number) => wishlistDataFormatter(item, ((page - 1) * per_page), i));
    const readyData = fetchedData.wants.map((item, i) => wishlistDataFormatter(item, ((page - 1) * per_page), i));
    tableData.body = tableMapperValues(readyData, ['number', 'cover', 'name', 'artist']);
    tableData.meta = tableMapperValues(readyData, ['id', 'artist', 'name', 'image', 'cover']);
    paginationSettings.limit = per_page;
    loading = false;
  };
</script>

<div class="container mx-auto p-8 space-y-8">
  <RecordTable
    source={tableData}
    on:selected={handleRowClick}
    loading={loading}
    handleSort={() => {}}
    sortable={false}
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
  <title>Me Wants</title>
</svelte:head>