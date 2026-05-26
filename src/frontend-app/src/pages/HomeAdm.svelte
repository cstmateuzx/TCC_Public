<script>
  import AppHeader from "../components/layout/AppHeader.svelte";
  import PageShell from "../components/layout/PageShell.svelte";
  import {
    irParaCadastroADM,
    irParaCadastroSRC,
    irParaCadastroHora,
    administrarADM,
    administrarUser,
    administrarServico,
    administrarHorarios,
  } from "../stores/navigation";
</script>

<AppHeader variant="admin" />

<PageShell
  title="Painel administrativo"
  subtitle="Gerencie cadastros, serviços e horários disponíveis"
  wide={true}
  card={false}
>
  <div class="admin-grid">
    <button type="button" class="admin-tile page-card" on:click={irParaCadastroADM}>
      <strong>Novo administrador</strong>
      <span>Cadastrar acesso ao painel</span>
    </button>
    <button type="button" class="admin-tile page-card" on:click={irParaCadastroSRC}>
      <strong>Novo serviço</strong>
      <span>Preços por tamanho e complexidade</span>
    </button>
    <button type="button" class="admin-tile page-card" on:click={irParaCadastroHora}>
      <strong>Horários</strong>
      <span>Disponibilizar datas para agendamento</span>
    </button>
    <button type="button" class="admin-tile page-card" on:click={administrarADM}>
      <strong>Administradores</strong>
      <span>Listar e editar</span>
    </button>
    <button type="button" class="admin-tile page-card" on:click={administrarUser}>
      <strong>Usuários</strong>
      <span>Listar e editar clientes</span>
    </button>
    <button type="button" class="admin-tile page-card" on:click={administrarServico}>
      <strong>Serviços</strong>
      <span>Atualizar preços cadastrados</span>
    </button>
    <button type="button" class="admin-tile page-card" on:click={administrarHorarios}>
      <strong>Lista de horários</strong>
      <span>Ver disponíveis e ocupados</span>
    </button>
  </div>
</PageShell>
