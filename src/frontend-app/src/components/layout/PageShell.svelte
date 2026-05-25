<script>
  export let title = "";
  export let subtitle = "";
  export let wide = false;
  export let card = true;
</script>

<section class="page-shell" class:page-shell--wide={wide}>
  {#if title}
    <h1 class="page-title">{title}</h1>
  {/if}
  {#if subtitle}
    <p class="page-subtitle">{subtitle}</p>
  {/if}

  {#if card}
    <div class="page-card">
      <slot />
    </div>
  {:else}
    <slot />
  {/if}
</section>
