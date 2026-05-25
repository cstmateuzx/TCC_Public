<script>
  import { fazerLogout } from "../../lib/auth";
  import {
    irParaHome,
    irParaHomeADM,
    irParaCadastroADM,
    irParaCadastroSRC,
    irParaCadastroHora,
    irParaAgendamento,
    administrarADM,
    administrarUser,
    administrarServico,
    administrarHorarios,
  } from "../../stores/navigation";

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
      <button
        type="button"
        class="navbar-brand d-flex align-items-center gap-2 border-0 bg-transparent p-0"
        on:click={variant === "admin" ? irParaHomeADM : irParaHome}
      >
        <span class="brand-mark" aria-hidden="true">BXD</span>
        <span class="brand-text d-none d-sm-inline">Tattoo Studio</span>
      </button>

      {#if variant === "user"}
        <div class="nav-links-desktop d-flex gap-3">
          <button type="button" class="nav-link-bxd nav-btn" on:click={irParaHome}>Início</button>
          <button type="button" class="nav-link-bxd nav-btn" on:click={irParaAgendamento}>Agendar</button>
        </div>
      {:else}
        <div class="nav-links-desktop d-flex flex-wrap gap-2 justify-content-center">
          <button type="button" class="nav-link-bxd nav-btn" on:click={irParaHomeADM}>Painel</button>
          <button type="button" class="nav-link-bxd nav-btn" on:click={irParaCadastroADM}>Novo admin</button>
          <button type="button" class="nav-link-bxd nav-btn" on:click={irParaCadastroSRC}>Novo serviço</button>
          <button type="button" class="nav-link-bxd nav-btn" on:click={irParaCadastroHora}>Horários</button>
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
              <button type="button" class="dropdown-item" on:click={administrarADM}>
                Administradores
              </button>
            </li>
            <li>
              <button type="button" class="dropdown-item" on:click={administrarUser}>
                Usuários
              </button>
            </li>
            <li>
              <button type="button" class="dropdown-item" on:click={administrarServico}>
                Serviços
              </button>
            </li>
            <li>
              <button type="button" class="dropdown-item" on:click={administrarHorarios}>
                Horários
              </button>
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

<style>
  .brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 6px;
    background: var(--bxd-accent);
    color: #1a1a1a;
    font-weight: 800;
    font-size: 0.7rem;
    letter-spacing: 0.02em;
  }

  .brand-text {
    font-weight: 600;
    color: var(--bxd-heading);
  }

  .dropdown-menu.show {
    display: block;
  }

  .dropdown-item {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
  }

  .nav-btn {
    background: none;
    border: none;
    padding: 0.25rem 0;
    cursor: pointer;
  }
</style>
