<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import AppHeader from "../../components/layout/AppHeader.svelte";
  import PageShell from "../../components/layout/PageShell.svelte";
  import BookingSteps from "../../components/ui/BookingSteps.svelte";
  import Alert from "../../components/ui/Alert.svelte";
  import { api, mensagemErroApi } from "../../lib/api";
  import {
    dataMinimaHoje,
    getBooking,
    setBookingHorario,
    clearBooking,
  } from "../../lib/booking";
  import { agendamento2 } from "../../stores/navigation";
  import { sessionStore } from "../../stores/session";
  import { irParaLogin } from "../../stores/navigation";

  let dataSelecionada = "";
  let horarios = [];
  let mensagem = "";
  let buscando = false;
  const minDate = dataMinimaHoje();

  onMount(() => {
    if (!get(sessionStore)) {
      irParaLogin();
      return;
    }
    const booking = getBooking();
    if (booking.data) dataSelecionada = booking.data;
  });

  const buscarHorarios = async () => {
    mensagem = "";
    horarios = [];

    if (!dataSelecionada) {
      mensagem = "Selecione uma data.";
      return;
    }

    if (dataSelecionada < minDate) {
      mensagem = "Não é possível agendar em datas passadas.";
      return;
    }

    buscando = true;
    try {
      const res = await api.get(`/horarios/${dataSelecionada}`);
      horarios = res.data.result?.horarios ?? [];
      if (horarios.length === 0) {
        mensagem = "Não há horários disponíveis nesta data. Tente outro dia.";
      }
    } catch (err) {
      mensagem = mensagemErroApi(err, "Erro ao carregar horários.");
      horarios = [];
    } finally {
      buscando = false;
    }
  };

  const selecionarHorario = (horario) => {
    if (!horario?.id_horario) {
      mensagem = "Horário inválido.";
      return;
    }
    setBookingHorario(dataSelecionada, horario);
    agendamento2();
  };
</script>

<AppHeader variant="user" />

<PageShell title="Agendamento" subtitle="Escolha a data e o horário da sua sessão">
  <BookingSteps current={1} />

  <form class="row g-3 mb-3" on:submit|preventDefault={buscarHorarios}>
    <div class="col-12">
      <label for="data" class="form-label">Data</label>
      <input
        type="date"
        id="data"
        bind:value={dataSelecionada}
        class="form-control"
        min={minDate}
        required
      />
    </div>
    <div class="col-12">
      <button type="submit" class="btn btn-bxd-primary" disabled={buscando}>
        {buscando ? "Buscando..." : "Buscar horários"}
      </button>
    </div>
  </form>

  <Alert variant="danger" message={mensagem} />

  {#if horarios.length > 0}
    <h2 class="h5 mt-4">Horários disponíveis</h2>
    <div class="table-responsive">
      <table class="table-bxd">
        <thead>
          <tr>
            <th>Hora</th>
            <th class="text-end">Ação</th>
          </tr>
        </thead>
        <tbody>
          {#each horarios as horario (horario.id_horario)}
            <tr>
              <td>{horario.hora}</td>
              <td class="text-end">
                <button
                  type="button"
                  class="btn btn-bxd-primary btn-sm"
                  on:click={() => selecionarHorario(horario)}
                >
                  Selecionar
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <p class="mt-4 mb-0">
    <button type="button" class="btn btn-bxd-link" on:click={() => { clearBooking(); }}>
      Limpar rascunho do agendamento
    </button>
  </p>
</PageShell>
