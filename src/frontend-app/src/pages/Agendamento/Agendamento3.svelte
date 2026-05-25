<script>
  import { onMount } from "svelte";
  import AppHeader from "../../components/layout/AppHeader.svelte";
  import PageShell from "../../components/layout/PageShell.svelte";
  import BookingSteps from "../../components/ui/BookingSteps.svelte";
  import Alert from "../../components/ui/Alert.svelte";
  import { api, mensagemErroApi } from "../../lib/api";
  import {
    getBooking,
    clearBooking,
    hasHorarioSelecionado,
    hasServicoCalculado,
  } from "../../lib/booking";
  import { irParaHome, agendamento2, agendamento1 } from "../../stores/navigation";

  let booking = getBooking();
  let mensagem = "";
  let sucesso = false;
  let loading = false;

  onMount(() => {
    if (!hasHorarioSelecionado()) {
      agendamento1();
      return;
    }
    if (!hasServicoCalculado()) {
      agendamento2();
      return;
    }
    booking = getBooking();
  });

  const confirmarAgendamento = async () => {
    booking = getBooking();

    if (!booking.horario?.id_horario) {
      mensagem = "Horário inválido. Volte e selecione novamente.";
      return;
    }
    if (!hasServicoCalculado()) {
      mensagem = "Dados do serviço incompletos. Volte à etapa anterior.";
      agendamento2();
      return;
    }

    loading = true;
    mensagem = "";
    sucesso = false;

    try {
      await api.put(`/horarios/${booking.horario.id_horario}`);
      sucesso = true;
      mensagem = "Agendamento confirmado com sucesso!";
      clearBooking();
      setTimeout(() => irParaHome(), 1500);
    } catch (err) {
      mensagem = mensagemErroApi(err, "Erro ao confirmar agendamento.");
      if (err.response?.status === 409) {
        clearBooking();
      }
    } finally {
      loading = false;
    }
  };
</script>

<AppHeader variant="user" />

<PageShell title="Confirmação" subtitle="Revise os dados antes de finalizar">
  <BookingSteps current={3} />

  <div class="resumo page-card" style="margin-bottom: 1rem; padding: 1rem;">
    {#if booking.data}
      <p><strong>Data:</strong> {booking.data}</p>
    {/if}
    {#if booking.horario}
      <p><strong>Horário:</strong> {booking.horario.hora}</p>
    {/if}
    {#if booking.tamanho}
      <p><strong>Tamanho:</strong> {booking.tamanho} cm · {booking.complexidade} · {booking.cores}</p>
    {/if}
    {#if booking.preco != null}
      <p><strong>Preço:</strong> R$ {Number(booking.preco).toFixed(2)}</p>
    {/if}
  </div>

  <div class="d-flex gap-2 flex-wrap mt-4">
    <button
      type="button"
      class="btn btn-bxd-primary"
      on:click={confirmarAgendamento}
      disabled={loading || sucesso}
    >
      {loading ? "Confirmando..." : "Confirmar agendamento"}
    </button>
    <button type="button" class="btn btn-bxd-secondary" on:click={agendamento2} disabled={loading}>
      Voltar
    </button>
    <button type="button" class="btn btn-bxd-link" on:click={irParaHome} disabled={loading}>
      Cancelar
    </button>
  </div>

  <Alert variant="danger" message={!sucesso ? mensagem : ""} />
  <Alert variant="success" message={sucesso ? mensagem : ""} />
</PageShell>

<style>
  .resumo p {
    margin: 0.5rem 0;
    color: var(--bxd-text);
  }
</style>
