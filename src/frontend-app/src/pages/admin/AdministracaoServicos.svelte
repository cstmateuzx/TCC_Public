<script>
  import { onMount } from "svelte";
  import AppHeader from "../../components/layout/AppHeader.svelte";
  import PageShell from "../../components/layout/PageShell.svelte";
  import Alert from "../../components/ui/Alert.svelte";
  import { api } from "../../lib/api";

  let servicos = [];
  let servicoParaEditar = null;
  let precoEditado = "";
  let mensagem = "";
  let erro = false;

  const carregarServicos = async () => {
    try {
      const response = await api.get("/servicos");
      servicos = response.data?.result?.servicos ?? [];
      erro = false;
    } catch {
      mensagem = "Erro ao carregar serviços.";
      erro = true;
    }
  };

  const editarPrecoServico = async (id_servico) => {
    try {
      await api.put(`/servicos/${id_servico}`, { preco: parseFloat(precoEditado) });
      await carregarServicos();
      cancelarEdicao();
      mensagem = "Preço atualizado com sucesso!";
      erro = false;
    } catch {
      mensagem = "Erro ao editar serviço.";
      erro = true;
    }
  };

  const excluirServico = async (id_servico) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    try {
      await api.delete(`/servicos/${id_servico}`);
      await carregarServicos();
      mensagem = "Serviço excluído com sucesso!";
      erro = false;
    } catch {
      mensagem = "Erro ao excluir serviço.";
      erro = true;
    }
  };

  const iniciarEdicao = (servico) => {
    servicoParaEditar = servico;
    precoEditado = servico.preco;
  };

  const cancelarEdicao = () => {
    servicoParaEditar = null;
  };

  onMount(carregarServicos);
</script>

<AppHeader variant="admin" />

<PageShell title="Serviços" subtitle="Tabela de preços por perfil de tatuagem" wide={true} card={false}>
  <Alert variant={erro ? "danger" : "success"} message={mensagem} />

  <div class="page-card table-responsive">
    <table class="table-bxd">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tamanho</th>
          <th>Complexidade</th>
          <th>Cores</th>
          <th>Preço</th>
          <th class="text-end">Ações</th>
        </tr>
      </thead>
      <tbody>
        {#each servicos as servico}
          <tr>
            <td>{servico.id_servico}</td>
            <td>{servico.tamanho}</td>
            <td>{servico.complexidade}</td>
            <td>{servico.cores}</td>
            <td>R$ {Number(servico.preco).toFixed(2)}</td>
            <td class="text-end">
              <button type="button" class="btn btn-bxd-warning btn-icon me-1" title="Editar" on:click={() => iniciarEdicao(servico)}>✎</button>
              <button type="button" class="btn btn-bxd-danger btn-icon" title="Excluir" on:click={() => excluirServico(servico.id_servico)}>🗑</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</PageShell>

{#if servicoParaEditar}
  <div class="modal-backdrop-bxd" role="dialog" aria-modal="true">
    <div class="modal-card-bxd">
      <div class="modal-card-bxd__header">
        <h2 class="modal-card-bxd__title">Editar preço</h2>
      </div>
      <div class="modal-card-bxd__body">
        <div class="mb-3">
          <label class="form-label">Tamanho</label>
          <input type="text" class="form-control" value={servicoParaEditar.tamanho} disabled />
        </div>
        <div class="mb-3">
          <label class="form-label">Complexidade</label>
          <input type="text" class="form-control" value={servicoParaEditar.complexidade} disabled />
        </div>
        <div class="mb-3">
          <label class="form-label">Cores</label>
          <input type="text" class="form-control" value={servicoParaEditar.cores} disabled />
        </div>
        <div class="mb-3">
          <label for="precoEditado" class="form-label">Preço (R$)</label>
          <input type="number" id="precoEditado" class="form-control" bind:value={precoEditado} step="0.01" min="0" />
        </div>
      </div>
      <div class="modal-card-bxd__footer">
        <button type="button" class="btn btn-bxd-secondary" on:click={cancelarEdicao}>Cancelar</button>
        <button type="button" class="btn btn-bxd-primary" on:click={() => editarPrecoServico(servicoParaEditar.id_servico)}>Salvar</button>
      </div>
    </div>
  </div>
{/if}
