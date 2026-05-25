<script>
  import { onMount } from "svelte";
  import AppHeader from "../../components/layout/AppHeader.svelte";
  import PageShell from "../../components/layout/PageShell.svelte";
  import Alert from "../../components/ui/Alert.svelte";
  import { api } from "../../lib/api";

  let usuarios = [];
  let usuarioParaEditar = null;
  let nomeEditado = "";
  let emailEditado = "";
  let idadeEditada = "";
  let mensagem = "";
  let erro = false;

  const carregarUsuarios = async () => {
    try {
      const response = await api.get("/usuarios");
      usuarios = response.data?.result?.usuarios ?? [];
      erro = false;
    } catch {
      mensagem = "Erro ao carregar a lista de usuários.";
      erro = true;
    }
  };

  const editarUsuario = async (id_usuario) => {
    try {
      await api.put(`/usuarios/${id_usuario}`, {
        nome: nomeEditado,
        email: emailEditado,
        idade: idadeEditada,
      });
      await carregarUsuarios();
      cancelarEdicao();
      mensagem = "Usuário atualizado com sucesso!";
      erro = false;
    } catch {
      mensagem = "Erro ao editar usuário.";
      erro = true;
    }
  };

  const excluirUsuario = async (id_usuario) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await api.delete(`/usuarios/${id_usuario}`);
      await carregarUsuarios();
      mensagem = "Usuário excluído com sucesso!";
      erro = false;
    } catch {
      mensagem = "Erro ao excluir usuário.";
      erro = true;
    }
  };

  const iniciarEdicao = (usuario) => {
    usuarioParaEditar = usuario;
    nomeEditado = usuario.nome;
    emailEditado = usuario.email;
    idadeEditada = usuario.idade;
  };

  const cancelarEdicao = () => {
    usuarioParaEditar = null;
  };

  onMount(carregarUsuarios);
</script>

<AppHeader variant="admin" />

<PageShell title="Usuários" subtitle="Clientes cadastrados no sistema" wide={true} card={false}>
  <Alert variant={erro ? "danger" : "success"} message={mensagem} />

  <div class="page-card table-responsive">
    <table class="table-bxd">
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Idade</th>
          <th class="text-end">Ações</th>
        </tr>
      </thead>
      <tbody>
        {#each usuarios as usuario}
          <tr>
            <td>{usuario.nome}</td>
            <td>{usuario.email}</td>
            <td>{usuario.idade}</td>
            <td class="text-end">
              <button type="button" class="btn btn-bxd-warning btn-icon me-1" title="Editar" on:click={() => iniciarEdicao(usuario)}>✎</button>
              <button type="button" class="btn btn-bxd-danger btn-icon" title="Excluir" on:click={() => excluirUsuario(usuario.id_usuario)}>🗑</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</PageShell>

{#if usuarioParaEditar}
  <div class="modal-backdrop-bxd" role="dialog" aria-modal="true">
    <div class="modal-card-bxd">
      <div class="modal-card-bxd__header">
        <h2 class="modal-card-bxd__title">Editar usuário</h2>
      </div>
      <div class="modal-card-bxd__body">
        <div class="mb-3">
          <label for="nomeEditado" class="form-label">Nome</label>
          <input type="text" id="nomeEditado" class="form-control" bind:value={nomeEditado} />
        </div>
        <div class="mb-3">
          <label for="emailEditado" class="form-label">E-mail</label>
          <input type="email" id="emailEditado" class="form-control" bind:value={emailEditado} />
        </div>
        <div class="mb-3">
          <label for="idadeEditada" class="form-label">Idade</label>
          <input type="number" id="idadeEditada" class="form-control" bind:value={idadeEditada} />
        </div>
      </div>
      <div class="modal-card-bxd__footer">
        <button type="button" class="btn btn-bxd-secondary" on:click={cancelarEdicao}>Cancelar</button>
        <button type="button" class="btn btn-bxd-primary" on:click={() => editarUsuario(usuarioParaEditar.id_usuario)}>Salvar</button>
      </div>
    </div>
  </div>
{/if}
