<script>
  import { paginaAtual } from "./stores/navigation";
  import Login from "./pages/Login.svelte";
  import Cadastro from "./pages/Cadastro.svelte";
  import Home from "./pages/Home.svelte";
  import HomeAdm from "./pages/HomeAdm.svelte";
  import CadastroADM from "./pages/CadastroADM.svelte";
  import CadastroSRC from "./pages/CadastroSRC.svelte";
  import CadastroHora from "./pages/CadastroHora.svelte";
  import Agendamento1 from "./pages/Agendamento/Agendamento1.svelte";
  import Agendamento2 from "./pages/Agendamento/Agendamento2.svelte";
  import Agendamento3 from "./pages/Agendamento/Agendamento3.svelte";
  import AdministracaoAdmins from "./pages/admin/AdministracaoAdmins.svelte";
  import AdministracaoUsuarios from "./pages/admin/AdministracaoUsuarios.svelte";
  import AdministracaoServicos from "./pages/admin/AdministracaoServicos.svelte";
  import AdministracaoHorarios from "./pages/admin/AdministracaoHorarios.svelte";

  const rotas = {
    login: Login,
    cadastro: Cadastro,
    home: Home,
    homeadm: HomeAdm,
    cadadm: CadastroADM,
    cadsrc: CadastroSRC,
    cadhora: CadastroHora,
    ag1: Agendamento1,
    ag2: Agendamento2,
    ag3: Agendamento3,
    admadm: AdministracaoAdmins,
    admuser: AdministracaoUsuarios,
    admservico: AdministracaoServicos,
    admhorarios: AdministracaoHorarios,
  };

  /** @param {string} pagina */
  function componenteDaPagina(pagina) {
    if (pagina in rotas) {
      return rotas[/** @type {keyof typeof rotas} */ (pagina)];
    }
    return Login;
  }
</script>

{#key $paginaAtual}
  <svelte:component this={componenteDaPagina($paginaAtual)} />
{/key}
