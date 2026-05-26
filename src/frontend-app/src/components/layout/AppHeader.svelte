<script>
  import { link } from "svelte-spa-router";
  import { fazerLogout } from "../../lib/auth";

  /** @type {'user' | 'admin'} */
  export let variant = "user";

  let menuOpen = false;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
  };
</script>

<header>
  <nav class="navbar navbar-dark navbar-bxd shadow-sm">
    <div class="container d-flex justify-content-between align-items-center flex-wrap gap-2">
      <a
        href={variant === "admin" ? "/admin" : "/home"}
        class="navbar-brand d-flex align-items-center gap-2 border-0 bg-transparent p-0"
        use:link
      >
        <span class="brand-mark" aria-hidden="true">BXD</span>
        <span class="brand-text d-none d-sm-inline">Tattoo Studio</span>
      </a>

      {#if variant === "user"}
        <div class="nav-links-desktop d-flex gap-3">
          <a href="/home" class="nav-link-bxd nav-btn" use:link>Início</a>
          <a href="/agendamento/1" class="nav-link-bxd nav-btn" use:link>Agendar</a>
        </div>
      {:else}
        <div class="nav-links-desktop d-flex flex-wrap gap-2 justify-content-center">
          <a href="/admin" class="nav-link-bxd nav-btn" use:link>Painel</a>
          <a href="/admin/novo" class="nav-link-bxd nav-btn" use:link>Novo admin</a>
          <a href="/admin/servico" class="nav-link-bxd nav-btn" use:link>Novo serviço</a>
          <a href="/admin/horarios" class="nav-link-bxd nav-btn" use:link>Horários</a>
        </div>
      {/if}

      <div class="dropdown">
        <button
          class="btn btn-bxd-secondary btn-sm dropdown-toggle"
          type="button"
          on:click={toggleMenu}
          aria-expanded={menuOpen}
        >
          Menu
        </button>
        <ul class="dropdown-menu dropdown-menu-end" class:show={menuOpen}>
          {#if variant === "admin"}
            <li>
              <a href="/admin/administradores" class="dropdown-item" use:link on:click={() => (menuOpen = false)}>
                Administradores
              </a>
            </li>
            <li>
              <a href="/admin/usuarios" class="dropdown-item" use:link on:click={() => (menuOpen = false)}>
                Usuários
              </a>
            </li>
            <li>
              <a href="/admin/servicos" class="dropdown-item" use:link on:click={() => (menuOpen = false)}>
                Serviços
              </a>
            </li>
            <li>
              <a href="/admin/horarios" class="dropdown-item" use:link on:click={() => (menuOpen = false)}>
                Horários
              </a>
            </li>
            <li><hr class="dropdown-divider" /></li>
          {/if}
          <li>
            <button type="button" class="dropdown-item" on:click={fazerLogout}>
              Sair
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>

