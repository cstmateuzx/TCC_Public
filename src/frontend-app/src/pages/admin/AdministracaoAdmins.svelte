<script>
  import { onMount } from "svelte";
  import AppHeader from "../../components/layout/AppHeader.svelte";
  import PageShell from "../../components/layout/PageShell.svelte";
  import Alert from "../../components/ui/Alert.svelte";
  import { api } from "../../lib/api";

  let adms = [];
  let admParaEditar = null;
  let nomeEditado = "";
  let userEditado = "";
  let mensagem = "";
  let erro = false;

  const carregarAdms = async () => {
    try {
      const response = await api.get("/adms");
      adms = response.data?.result?.adms ?? [];
      erro = false;
    } catch {
      mensagem = "Erro ao carregar administradores.";
      erro = true;
    }
  };

  const editarAdm = async (id_adm) => {
    try {
      await api.put(`/adms/${id_adm}`, { nome: nomeEditado, user: userEditado });
      await carregarAdms();
      cancelarEdicao();
      mensagem = "Administrador atualizado com sucesso!";
      erro = false;
    } catch {
      mensagem = "Erro ao editar administrador.";
      erro = true;
    }
  };

  const excluirAdm = async (id_adm) => {
    if (!confirm("Tem certeza que deseja excluir este administrador?")) return;
    try {
      await api.delete(`/adms/${id_adm}`);
      await carregarAdms();
      mensagem = "Administrador excluído com sucesso!";
      erro = false;
    } catch {
      mensagem = "Erro ao excluir administrador.";
      erro = true;
    }
  };

  const iniciarEdicao = (adm) => {
    admParaEditar = adm;
    nomeEditado = adm.nome;
    userEditado = adm.user;
  };

  const cancelarEdicao = () => {
    admParaEditar = null;
  };

  onMount(carregarAdms);
</script>

<AppHeader variant="admin" />

<PageShell title="Administradores" subtitle="Contas com acesso ao painel" wide={true} card={false}>
  <Alert variant={erro ? "danger" : "success"} message={mensagem} />

  <div class="page-card table-responsive">
    <table class="table-bxd">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Usuário</th>
          <th class="text-end">Ações</th>
        </tr>
      </thead>
      <tbody>
        {#each adms as adm}
          <tr>
            <td>{adm.nome}</td>
            <td>{adm.user}</td>
            <td class="text-end">
              <button type="button" class="btn btn-bxd-warning btn-icon me-1" title="Editar" on:click={() => iniciarEdicao(adm)}>✎</button>
              <button type="button" class="btn btn-bxd-danger btn-icon" title="Excluir" on:click={() => excluirAdm(adm.id_adm)}>🗑</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</PageShell>

{#if admParaEditar}
  <div class="modal-backdrop-bxd" role="dialog" aria-modal="true">
    <div class="modal-card-bxd">
      <div class="modal-card-bxd__header">
        <h2 class="modal-card-bxd__title">Editar administrador</h2>
      </div>
      <div class="modal-card-bxd__body">
        <div class="mb-3">
          <label for="nomeEditado" class="form-label">Nome</label>
          <input type="text" id="nomeEditado" class="form-control" bind:value={nomeEditado} />
        </div>
        <div class="mb-3">
          <label for="userEditado" class="form-label">Usuário</label>
          <input type="text" id="userEditado" class="form-control" bind:value={userEditado} />
        </div>
      </div>
      <div class="modal-card-bxd__footer">
        <button type="button" class="btn btn-bxd-secondary" on:click={cancelarEdicao}>Cancelar</button>
        <button type="button" class="btn btn-bxd-primary" on:click={() => editarAdm(admParaEditar.id_adm)}>Salvar</button>
      </div>
    </div>
  </div>
{/if}
