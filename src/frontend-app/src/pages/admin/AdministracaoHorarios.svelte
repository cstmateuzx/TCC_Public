<script>
  import { onMount } from "svelte";
  import AppHeader from "../../components/layout/AppHeader.svelte";
  import PageShell from "../../components/layout/PageShell.svelte";
  import Alert from "../../components/ui/Alert.svelte";
  import { api, mensagemErroApi } from "../../lib/api";
  import { irParaCadastroHora } from "../../stores/navigation";

  let horarios = [];
  let mensagem = "";
  let erro = false;
  let carregando = false;

  const carregarHorarios = async () => {
    carregando = true;
    try {
      const response = await api.get("/horarios");
      horarios = response.data?.result?.horarios ?? [];
      erro = false;
    } catch (err) {
      mensagem = mensagemErroApi(err, "Erro ao carregar horários.");
      erro = true;
    } finally {
      carregando = false;
    }
  };

  const excluirHorario = async (horario) => {
    if (horario.status === "ocupado") {
      mensagem = "Horários reservados não podem ser excluídos.";
      erro = true;
      return;
    }
    if (!confirm(`Excluir horário ${horario.data} às ${horario.hora}?`)) return;

    try {
      await api.delete(`/horarios/${horario.id_horario}`);
      mensagem = "Horário excluído com sucesso!";
      erro = false;
      await carregarHorarios();
    } catch (err) {
      mensagem = mensagemErroApi(err, "Erro ao excluir horário.");
      erro = true;
    }
  };

  onMount(carregarHorarios);
</script>

<AppHeader variant="admin" />

<PageShell title="Horários" subtitle="Slots disponíveis e reservados" wide={true} card={false}>
  <div class="d-flex gap-2 flex-wrap mb-3">
    <button type="button" class="btn btn-bxd-primary" on:click={irParaCadastroHora}>
      Novo horário
    </button>
    <button type="button" class="btn btn-bxd-secondary" on:click={carregarHorarios} disabled={carregando}>
      {carregando ? "Atualizando..." : "Atualizar lista"}
    </button>
  </div>

  <Alert variant={erro ? "danger" : "success"} message={mensagem} />

  <div class="page-card table-responsive">
    {#if horarios.length === 0 && !carregando}
      <p class="text-center mb-0" style="color: var(--bxd-text-muted)">
        Nenhum horário cadastrado. Use &quot;Novo horário&quot; para disponibilizar.
      </p>
    {:else}
      <table class="table-bxd">
        <thead>
          <tr>
            <th>Data</th>
            <th>Hora</th>
            <th>Status</th>
            <th>Cliente (ID)</th>
            <th class="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {#each horarios as horario (horario.id_horario)}
            <tr>
              <td>{horario.data}</td>
              <td>{horario.hora}</td>
              <td>
                {#if horario.status === "disponivel"}
                  <span class="badge-bxd badge-bxd--ok">Disponível</span>
                {:else}
                  <span class="badge-bxd badge-bxd--busy">Ocupado</span>
                {/if}
              </td>
              <td>{horario.usuario_sk ?? "—"}</td>
              <td class="text-end">
                {#if horario.status === "disponivel"}
                  <button
                    type="button"
                    class="btn btn-bxd-danger btn-sm"
                    on:click={() => excluirHorario(horario)}
                  >
                    Excluir
                  </button>
                {:else}
                  <span style="color: var(--bxd-text-muted); font-size: 0.85rem">—</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</PageShell>
