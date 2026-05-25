import { get, writable } from "svelte/store";
import { sessionStore } from "./session";

export { api_base_url } from "../lib/config";

export const paginaAtual = writable("login");

function requireAuth(callback) {
  if (!get(sessionStore)) {
    paginaAtual.set("login");
    return;
  }
  callback();
}

export const irParaLogin = () => paginaAtual.set("login");
export const irParaCadastro = () => paginaAtual.set("cadastro");
export const irParaHome = () => paginaAtual.set("home");

export const irParaHomeADM = () => {
  requireAuth(() => paginaAtual.set("homeadm"));
};

export const irParaAgendamento = () => {
  requireAuth(() => paginaAtual.set("ag1"));
};

export const irParaCadastroADM = () => paginaAtual.set("cadadm");
export const irParaCadastroSRC = () => paginaAtual.set("cadsrc");
export const irParaCadastroHora = () => paginaAtual.set("cadhora");

export const administrarADM = () => paginaAtual.set("admadm");
export const administrarUser = () => paginaAtual.set("admuser");
export const administrarServico = () => paginaAtual.set("admservico");
export const administrarHorarios = () => paginaAtual.set("admhorarios");

export const agendamento1 = () => paginaAtual.set("ag1");
export const agendamento2 = () => paginaAtual.set("ag2");
export const agendamento3 = () => paginaAtual.set("ag3");
