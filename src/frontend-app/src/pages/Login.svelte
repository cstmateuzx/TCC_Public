<script>
  import { sessionStore } from "../stores/session";
  import { api_base_url, irParaHome, irParaCadastro, irParaHomeADM } from "../stores/navigation";
  import PageShell from "../components/layout/PageShell.svelte";
  import Alert from "../components/ui/Alert.svelte";

  let userOrEmail = "";
  let senha = "";
  let mensagem = "";
  let sucesso = false;

  const fazerLogin = async () => {
    mensagem = "";
    sucesso = false;

    try {
      const res = await fetch(`${api_base_url}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userOrEmail, senha }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        sessionStore.set(data.token);
        userOrEmail = "";
        senha = "";
        if (data.role === "admin") {
          irParaHomeADM();
        } else {
          irParaHome();
        }
      } else {
        mensagem = data.message || "Erro ao fazer login.";
      }
    } catch {
      mensagem = "Erro de conexão. Tente novamente.";
    }
  };
</script>

<PageShell title="Entrar" subtitle="Acesse sua conta ou o painel administrativo">
  <form class="row g-3" on:submit|preventDefault={fazerLogin}>
    <div class="col-12">
      <label for="userOrEmail" class="form-label">Usuário ou e-mail</label>
      <input
        type="text"
        id="userOrEmail"
        bind:value={userOrEmail}
        class="form-control"
        placeholder="Digite seu login"
        required
      />
    </div>
    <div class="col-12">
      <label for="senha" class="form-label">Senha</label>
      <input
        type="password"
        id="senha"
        bind:value={senha}
        class="form-control"
        placeholder="Digite sua senha"
        required
      />
    </div>
    <div class="col-12">
      <button type="submit" class="btn btn-bxd-primary w-100">Entrar</button>
    </div>
  </form>

  <p class="text-center mt-4 mb-2" style="color: var(--bxd-text-muted)">Não possui cadastro?</p>
  <button type="button" class="btn btn-bxd-link w-100" on:click={irParaCadastro}>
    Criar conta de cliente
  </button>

  <Alert variant="danger" message={mensagem} />
  <Alert variant="success" message={sucesso ? "Login realizado!" : ""} />
</PageShell>
