<script>
  import Router from "svelte-spa-router";
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

  const routes = {
    "/": Login,
    "/login": Login,
    "/cadastro": Cadastro,
    "/home": Home,
    "/admin": HomeAdm,
    "/admin/novo": CadastroADM,
    "/admin/servico": CadastroSRC,
    "/admin/horarios": AdministracaoHorarios,
    "/admin/horarios/novo": CadastroHora,
    "/admin/administradores": AdministracaoAdmins,
    "/admin/usuarios": AdministracaoUsuarios,
    "/admin/servicos": AdministracaoServicos,
    "/agendamento/1": Agendamento1,
    "/agendamento/2": Agendamento2,
    "/agendamento/3": Agendamento3,
    "*": Login,
  };
</script>

<Router {routes} />
