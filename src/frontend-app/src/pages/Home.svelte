<script>
  import AppHeader from "../components/layout/AppHeader.svelte";
  import PageShell from "../components/layout/PageShell.svelte";
  import { irParaAgendamento } from "../stores/navigation";
</script>

<AppHeader variant="user" />

<PageShell card={false}>
  <div class="page-card hero-bxd">
    <h1>Bem-vindo ao BXD Tattoo</h1>
    <p>Agende sua sessão e explore os serviços do estúdio.</p>
    <button type="button" class="btn btn-bxd-primary" on:click={irParaAgendamento}>
      Iniciar agendamento
    </button>
  </div>
</PageShell>
