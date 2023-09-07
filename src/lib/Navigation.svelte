<script lang="ts">
	/** @type {import('./$types').PageData} */
  import { page } from '$app/stores';
  
  $: classesActive = (href: string) => (href === $page.url.pathname ? 'variant-ghost-warning' : '');

	export let data;
</script>
<div id="sidebar-left" class="lg:block">
  <nav class="list-nav">
    <ul>
      <li>
        <a href="/" class="{classesActive('/')}">
          <span class="flex-auto">Home</span>
        </a>
      </li>
      <li>
        <a href="/wantlist" class="{classesActive('/wantlist')}">
          <span class="flex-auto">Wantlist</span>
        </a>
      </li>
    </ul>
  </nav>
  <hr class="!my-6 opacity-50">
  <nav class="list-nav">
    <span class="h2 font-bold pl-4 text-2xl">Folders:</span>
    <ul>
      {#each data.folders.folders as folder}
        <li>
          <a href="/folders/{folder.id}" class="{classesActive(`/folders/${folder.id}`)}">
            <span class="badge variant-filled-warning">{folder.count}</span>
            <span class="flex-auto">{folder.name}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
  <hr class="!my-6 opacity-50">
  <nav class="list-nav">
    <span class="h3 font-bold pl-4 text-2xl">Lists:</span>
    <ul>
      {#each data.lists as list}
        <li>
          <a href="{list.href}" class="{classesActive(list.href)}">
            <span class="flex-auto">{list.name}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</div>