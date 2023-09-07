<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>
<div class="container mx-auto p-8 space-y-8">
  <h1 class="h1">{data.items.slug}</h1>
  <div>{@html data.items.id}</div>
</div>

<svelte:head>
  <title>List: {data.items.slug}</title>
</svelte:head>