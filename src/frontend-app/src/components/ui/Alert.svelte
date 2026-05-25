<script>
  /** @type {'success' | 'danger' | 'info'} */
  export let variant = "info";
  export let message = "";
</script>

{#if message}
  <div class="alert-bxd alert-bxd--{variant}" role="alert">
    {message}
  </div>
{/if}
