<script>
  import { onMount } from "svelte";
  import AppHeader from "../../components/layout/AppHeader.svelte";
  import PageShell from "../../components/layout/PageShell.svelte";
  import BookingSteps from "../../components/ui/BookingSteps.svelte";
  import Alert from "../../components/ui/Alert.svelte";
  import { api, mensagemErroApi } from "../../lib/api";
  import {
    getBooking,
    setBookingServico,
    hasHorarioSelecionado,
  } from "../../lib/booking";
  import { agendamento3, agendamento1 } from "../../stores/navigation";

  let tamanho = "";
  let complexidade = "";
  let cores = "";
  let preco = null;
  let mensagem = "";
  let calculando = false;

  let dataSelecionada = "";
  let horarioSelecionado = null;

  onMount(() => {
    if (!hasHorarioSelecionado()) {
      agendamento1();
      return;
    }
    const booking = getBooking();
    dataSelecionada = booking.data;
    horarioSelecionado = booking.horario;
    if (booking.tamanho) tamanho = booking.tamanho;
    if (booking.complexidade) complexidade = booking.complexidade;
    if (booking.cores) cores = booking.cores;
    if (booking.preco != null) preco = Number(booking.preco);
  });

  const calcularPreco = async () => {
    mensagem = "";
    preco = null;

    const tamanhoNum = Number(tamanho);
    if (tamanho === "" || Number.isNaN(tamanhoNum) || tamanhoNum < 0) {
      mensagem = "Informe um tamanho válido em centímetros.";
      return;
    }
    if (!complexidade || !cores) {
      mensagem = "Selecione complexidade e cores.";
      return;
    }

    calculando = true;
    try {
      const res = await api.get("/preco-servico", {
        params: { tamanho: tamanhoNum, complexidade, cores },
      });
      const valor = res.data.result?.preco;
      if (valor == null) {
        mensagem =
          "Não há serviço cadastrado para essa combinação. Peça ao estúdio cadastrar o preço.";
        return;
      }
      preco = Number(valor);
    } catch (err) {
      mensagem = mensagemErroApi(err, "Erro ao calcular preço.");
    } finally {
      calculando = false;
    }
  };

  const avancar = () => {
    if (preco === null || Number.isNaN(Number(preco))) {
      mensagem = "Calcule o preço antes de continuar.";
      return;
    }
    setBookingServico({ tamanho, complexidade, cores, preco });
    agendamento3();
  };
</script>

<AppHeader variant="user" />

<PageShell title="Detalhes da tatuagem" subtitle="Informe tamanho, complexidade e cores">
  <BookingSteps current={2} />

  {#if dataSelecionada && horarioSelecionado}
    <Alert
      variant="info"
      message={`Data: ${dataSelecionada} · Horário: ${horarioSelecionado.hora ?? "—"}`}
    />
  {/if}

  <form class="row g-3" on:submit|preventDefault={calcularPreco}>
    <div class="col-12">
      <label for="tamanho" class="form-label">Tamanho (cm)</label>
      <input
        type="number"
        id="tamanho"
        bind:value={tamanho}
        class="form-control"
        min="0"
        step="1"
        required
      />
    </div>

    <div class="col-12">
      <span class="form-label d-block">Complexidade</span>
      <label class="form-check-label me-3">
        <input type="radio" class="form-check-input me-1" bind:group={complexidade} value="simples" required />
        Simples
      </label>
      <label class="form-check-label">
        <input type="radio" class="form-check-input me-1" bind:group={complexidade} value="complexa" />
        Complexa
      </label>
    </div>

    <div class="col-12">
      <span class="form-label d-block">Cores</span>
      <label class="form-check-label me-3">
        <input type="radio" class="form-check-input me-1" bind:group={cores} value="unicolor" required />
        Unicolor
      </label>
      <label class="form-check-label">
        <input type="radio" class="form-check-input me-1" bind:group={cores} value="multicolor" />
        Multicolor
      </label>
    </div>

    <div class="col-12">
      <button type="submit" class="btn btn-bxd-primary" disabled={calculando}>
        {calculando ? "Calculando..." : "Calcular preço"}
      </button>
    </div>
  </form>

  <Alert variant="danger" message={mensagem} />

  {#if preco !== null && !Number.isNaN(preco)}
    <Alert variant="success" message={`Preço estimado: R$ ${preco.toFixed(2)}`} />
    <div class="d-flex gap-2 flex-wrap mt-2">
      <button type="button" class="btn btn-bxd-primary" on:click={avancar}>
        Continuar para confirmação
      </button>
      <button type="button" class="btn btn-bxd-secondary" on:click={agendamento1}>
        Voltar
      </button>
    </div>
  {/if}
</PageShell>
