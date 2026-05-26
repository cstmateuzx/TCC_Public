<script>
  import PageShell from "../components/layout/PageShell.svelte";
  import Alert from "../components/ui/Alert.svelte";
  import { api } from "../lib/api";
  import { irParaLogin } from "../stores/navigation";

  let nome = "";
  let email = "";
  let idade = "";
  let senha = "";
  let conf_senha = "";
  let mensagem = "";
  let sucesso = false;

  const cadastrarUsuario = async () => {
    mensagem = "";
    sucesso = false;

    if (senha !== conf_senha) {
      mensagem = "As senhas não coincidem.";
      return;
    }

    try {
      await api.post("/usuarios/novo", { nome, email, idade, senha, conf_senha });
      sucesso = true;
      irParaLogin();
    } catch (err) {
      mensagem = err.response?.data?.message || "Erro ao cadastrar usuário.";
    }
  };
</script>

<PageShell title="Criar conta" subtitle="Cadastro de cliente">
  <form class="row g-3" on:submit|preventDefault={cadastrarUsuario}>
    <div class="col-12">
      <label for="nome" class="form-label">Nome</label>
      <input type="text" id="nome" class="form-control" bind:value={nome} required />
    </div>
    <div class="col-12">
      <label for="email" class="form-label">E-mail</label>
      <input type="email" id="email" class="form-control" bind:value={email} required />
    </div>
    <div class="col-12">
      <label for="idade" class="form-label">Idade</label>
      <input type="number" id="idade" class="form-control" bind:value={idade} min="1" required />
    </div>
    <div class="col-12">
      <label for="senha" class="form-label">Senha</label>
      <input type="password" id="senha" class="form-control" bind:value={senha} required />
    </div>
    <div class="col-12">
      <label for="conf_senha" class="form-label">Confirmar senha</label>
      <input type="password" id="conf_senha" class="form-control" bind:value={conf_senha} required />
    </div>
    <div class="col-12">
      <button type="submit" class="btn btn-bxd-primary w-100" disabled={senha !== conf_senha}>
        Cadastrar
      </button>
    </div>
  </form>

  <p class="text-center mt-4 mb-2 text-muted">Já possui conta?</p>
  <button type="button" class="btn btn-bxd-secondary w-100" on:click={irParaLogin}>Fazer login</button>

  <Alert variant="danger" message={mensagem} />
  <Alert variant="success" message={sucesso ? "Cadastro realizado! Redirecionando..." : ""} />
</PageShell>
