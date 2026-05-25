<script>
  import AppHeader from "../components/layout/AppHeader.svelte";
  import PageShell from "../components/layout/PageShell.svelte";
  import Alert from "../components/ui/Alert.svelte";
  import { api } from "../lib/api";
  import { irParaLogin } from "../stores/navigation";

  let nome = "";
  let user = "";
  let senha = "";
  let conf_senha = "";
  let mensagem = "";
  let sucesso = false;

  const cadastrarAdm = async () => {
    mensagem = "";
    sucesso = false;

    if (senha !== conf_senha) {
      mensagem = "As senhas não coincidem.";
      return;
    }

    try {
      const res = await api.post("/adm/novo", { nome, user, senha, conf_senha });
      sucesso = true;
      mensagem = res.data.message;
      nome = "";
      user = "";
      senha = "";
      conf_senha = "";
    } catch (err) {
      mensagem = err.response?.data?.message || "Erro ao cadastrar administrador.";
    }
  };
</script>

<AppHeader variant="admin" />

<PageShell title="Cadastro de administrador">
  <form class="row g-3" on:submit|preventDefault={cadastrarAdm}>
    <div class="col-12 col-md-6">
      <label for="nome" class="form-label">Nome</label>
      <input type="text" id="nome" bind:value={nome} class="form-control" required />
    </div>
    <div class="col-12 col-md-6">
      <label for="user" class="form-label">Usuário</label>
      <input type="text" id="user" bind:value={user} class="form-control" required />
    </div>
    <div class="col-12 col-md-6">
      <label for="senha" class="form-label">Senha</label>
      <input type="password" id="senha" bind:value={senha} class="form-control" required />
    </div>
    <div class="col-12 col-md-6">
      <label for="conf_senha" class="form-label">Confirmar senha</label>
      <input type="password" id="conf_senha" bind:value={conf_senha} class="form-control" required />
    </div>
    <div class="col-12">
      <button type="submit" class="btn btn-bxd-primary">Cadastrar</button>
    </div>
  </form>

  <p class="mt-4 mb-0">
    <button type="button" class="btn btn-bxd-link" on:click={irParaLogin}>Voltar ao login</button>
  </p>

  <Alert variant="danger" message={!sucesso ? mensagem : ""} />
  <Alert variant="success" message={sucesso ? mensagem : ""} />
</PageShell>
