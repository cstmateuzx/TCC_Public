import axios from "axios";
import { get } from "svelte/store";
import { api_base_url } from "./config.js";
import { sessionStore } from "../stores/session.js";
import { irParaLogin } from "../stores/navigation.js";

export const api = axios.create({
  baseURL: api_base_url,
  headers: { Accept: "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && get(sessionStore)) {
      sessionStore.set(null);
      irParaLogin();
    }
    return Promise.reject(error);
  }
);

/** Mensagem legível a partir de erro axios. */
export function mensagemErroApi(err, fallback = "Erro inesperado.") {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) return "Sessão expirada. Faça login novamente.";
  if (err.response?.status === 404) return "Recurso não encontrado.";
  if (err.response?.status === 409) return "Conflito: este horário já não está disponível.";
  if (!err.response) return "Sem conexão com o servidor. Verifique se a API está rodando.";
  return fallback;
}
