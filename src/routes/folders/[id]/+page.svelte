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
  import { getModalStore, Table, Paginator, tableMapperValues } from '@skeletonlabs/skeleton';
  import type { ModalSettings, PaginationSettings, TableSource } from '@skeletonlabs/skeleton';
  export let data;

  const formattedData = data.collectionData.releases.map(tableDataFormatter);
  const id = data.id;
  let page = 1;
  let per_page = 50;

  export let tableData: TableSource = {
    // A list of heading labels.
    head: [
      '',
      '<button type="button" class="btn variant-soft"><span></span><span>Name</span></button>',
      '<button type="button" class="btn bg-gradient-to-br variant-gradient-warning-error"><span><i class="fa-solid fa-circle-down"></i></span><span>Artist</span></button>',
      '<button type="button" class="btn variant-soft"><span></span><span>Released</span></button>',
      '<button type="button" class="btn variant-soft"><span></span><span>Acquired</span></button>',
    ],
    // The data visibly shown in your table body UI.
    body: tableMapperValues(formattedData, ['cover', 'name', 'artist', 'released', 'acquired']),
    meta: tableMapperValues(formattedData, ['id', 'artist', 'name', 'image', 'cover']),
    foot: ['', '', '', 'Total', `<code class="code">${formattedData.length}</code>`]
  };
  
  const handleRowClick = (e: CustomEvent) => {
    const modalStore = getModalStore();
    const modal: ModalSettings = {
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
  } satisfies PaginationSettings;

  const fetchData = () => fetch(`${URL}/users/${USERNAME}/collection/folders/${id}/releases?sort=artist&per_page=${per_page}&page=${page}`, {
    method: 'GET',
    headers: {
      Authorization: `Discogs key=${AUTH_KEY}, secret=${AUTH_SECRET}, token=${AUTH_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
    }
  });

  const handlePagination = async (e: CustomEvent) => {
    page = e.detail + 1;
    const collectionRes = await fetchData();
    const fetchedData = await collectionRes.json();
    const readyData = fetchedData.releases.map(tableDataFormatter);
    tableData.body = tableMapperValues(readyData, ['cover', 'name', 'artist', 'released', 'acquired']);
    tableData.meta = tableMapperValues(readyData, ['id', 'artist', 'name', 'image', 'cover']);
    paginationSettings.page = fetchedData.pagination.page - 1;
  };
  const handleAmount = async (e: CustomEvent) => {
    per_page = e.detail;
    const collectionRes = await fetchData();
    const fetchedData = await collectionRes.json();
    const readyData = fetchedData.releases.map(tableDataFormatter);
    tableData.body = tableMapperValues(readyData, ['cover', 'name', 'artist', 'released', 'acquired']);
    tableData.meta = tableMapperValues(readyData, ['id', 'artist', 'name', 'image', 'cover']);
    paginationSettings.limit = per_page;
  };
</script>

<div class="container mx-auto p-8 space-y-8">
  <Table source={tableData} interactive on:selected={handleRowClick} />
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