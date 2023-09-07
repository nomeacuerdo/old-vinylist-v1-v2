<script>
  import { page } from '$app/stores';

  console.log($page.error)
</script>

<div class="container mx-auto p-8 space-y-8">
  <h1 class="h1">
    <span class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text box-decoration-clone">
      Paila
    </span>
  </h1>
  <hr />
  <div class="mx-auto space-y-4">
    <code class="code">{$page.error.message}</code>
  </div>
</div>