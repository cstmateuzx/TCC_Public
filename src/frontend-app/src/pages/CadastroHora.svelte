<script>
  import AppHeader from "../components/layout/AppHeader.svelte";
  import PageShell from "../components/layout/PageShell.svelte";
  import Alert from "../components/ui/Alert.svelte";
  import { api, mensagemErroApi } from "../lib/api";
  import { administrarHorarios } from "../stores/navigation";

  let datetime = "";
  let mensagem = "";
  let sucesso = false;

  const cadastrarHorario = async () => {
    mensagem = "";
    sucesso = false;

    try {
      const res = await api.post("/horario/novo", { datetime, usuario_sk: null });
      sucesso = true;
      mensagem = res.data.message;
      datetime = "";
    } catch (err) {
      mensagem = mensagemErroApi(err, "Erro ao cadastrar horário.");
    }
  };
</script>

<AppHeader variant="admin" />

<PageShell title="Disponibilizar horário">
  <form class="row g-3" on:submit|preventDefault={cadastrarHorario}>
    <div class="col-12">
      <label for="datetime" class="form-label">Data e hora</label>
      <input type="datetime-local" id="datetime" bind:value={datetime} class="form-control" required />
    </div>
    <div class="col-12">
      <button type="submit" class="btn btn-bxd-primary">Disponibilizar</button>
    </div>
  </form>

  <Alert variant="danger" message={!sucesso ? mensagem : ""} />
  <Alert variant="success" message={sucesso ? mensagem : ""} />

  {#if sucesso}
    <p class="mt-3 mb-0">
      <button type="button" class="btn btn-bxd-link" on:click={administrarHorarios}>
        Ver lista de horários
      </button>
    </p>
  {/if}
</PageShell>
