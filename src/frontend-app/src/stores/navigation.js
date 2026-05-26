import { get } from "svelte/store";
import { push } from "svelte-spa-router";
import { sessionStore } from "./session";

export { api_base_url } from "../lib/config";

function requireAuth(callback) {
  if (!get(sessionStore)) {
    push("/login");
    return;
  }
  callback();
}

export const irParaLogin = () => push("/login");
export const irParaCadastro = () => push("/cadastro");
export const irParaHome = () => push("/home");

export const irParaHomeADM = () => {
  requireAuth(() => push("/admin"));
};

export const irParaAgendamento = () => {
  requireAuth(() => push("/agendamento/1"));
};

export const irParaCadastroADM = () => push("/admin/novo");
export const irParaCadastroSRC = () => push("/admin/servico");
export const irParaCadastroHora = () => push("/admin/horarios/novo");

export const administrarADM = () => push("/admin/administradores");
export const administrarUser = () => push("/admin/usuarios");
export const administrarServico = () => push("/admin/servicos");
export const administrarHorarios = () => push("/admin/horarios");

export const agendamento1 = () => push("/agendamento/1");
export const agendamento2 = () => push("/agendamento/2");
export const agendamento3 = () => push("/agendamento/3");
