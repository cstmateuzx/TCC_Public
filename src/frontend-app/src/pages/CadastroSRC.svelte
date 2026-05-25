<script>
  import AppHeader from "../components/layout/AppHeader.svelte";
  import PageShell from "../components/layout/PageShell.svelte";
  import Alert from "../components/ui/Alert.svelte";
  import { api } from "../lib/api";

  let tamanho = 5;
  let complexidade = "";
  let cores = "";
  let mensagem = "";
  let sucesso = false;

  function classificarTamanho(cm) {
    if (cm <= 5) return "pequeno";
    if (cm <= 15) return "medio";
    return "grande";
  }

  function calcularPrecoBase(tamanhoCat, comp, cor) {
    const tabela = {
      pequeno: {
        simples: { unicolor: 350, multicolor: 450 },
        complexa: { unicolor: 450, multicolor: 600 },
      },
      medio: {
        simples: { unicolor: 950, multicolor: 1000 },
        complexa: { unicolor: 1000, multicolor: 1250 },
      },
      grande: {
        simples: { unicolor: 1250, multicolor: 1350 },
        complexa: { unicolor: 1350, multicolor: 1500 },
      },
    };
    return tabela[tamanhoCat]?.[comp]?.[cor] ?? null;
  }

  const cadastrarServico = async () => {
    mensagem = "";
    sucesso = false;

    const tamanhoCat = classificarTamanho(Number(tamanho));
    const preco = calcularPrecoBase(tamanhoCat, complexidade, cores);

    if (!preco) {
      mensagem = "Preencha tamanho, complexidade e cores corretamente.";
      return;
    }

    try {
      const res = await api.post("/servicos/novo", {
        tamanho: tamanhoCat,
        complexidade,
        cores,
        preco,
      });
      sucesso = true;
      mensagem = res.data.message;
    } catch (err) {
      mensagem = err.response?.data?.message || "Erro ao cadastrar serviço.";
    }
  };
</script>

<AppHeader variant="admin" />

<PageShell title="Cadastro de serviço" subtitle="O preço é calculado automaticamente com base nos parâmetros">
  <form class="row g-3" on:submit|preventDefault={cadastrarServico}>
    <div class="col-12">
      <label for="tamanho" class="form-label">Tamanho (cm)</label>
      <input type="number" id="tamanho" class="form-control" bind:value={tamanho} min="1" required />
    </div>

    <div class="col-12">
      <span class="form-label d-block">Complexidade</span>
      <div class="d-flex gap-3 flex-wrap">
        <label class="form-check-label">
          <input type="radio" class="form-check-input me-1" bind:group={complexidade} value="simples" required />
          Simples
        </label>
        <label class="form-check-label">
          <input type="radio" class="form-check-input me-1" bind:group={complexidade} value="complexa" />
          Complexa
        </label>
      </div>
    </div>

    <div class="col-12">
      <span class="form-label d-block">Cores</span>
      <div class="d-flex gap-3 flex-wrap">
        <label class="form-check-label">
          <input type="radio" class="form-check-input me-1" bind:group={cores} value="unicolor" required />
          Unicolor
        </label>
        <label class="form-check-label">
          <input type="radio" class="form-check-input me-1" bind:group={cores} value="multicolor" />
          Multicolor
        </label>
      </div>
    </div>

    <div class="col-12">
      <button type="submit" class="btn btn-bxd-primary">Cadastrar serviço</button>
    </div>
  </form>

  <Alert variant="danger" message={!sucesso ? mensagem : ""} />
  <Alert variant="success" message={sucesso ? mensagem : ""} />
</PageShell>
